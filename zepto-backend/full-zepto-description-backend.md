# Zepto Backend - Comprehensive Project Description

## 1. Introduction
The `zepto-backend` is a Java-based RESTful API built using the Spring Boot framework (version 3.2.1) and Java 17. It manages e-commerce/delivery functionalities, including users, products, orders, payments, and warehouses. 

## 2. Project Structure & Architecture
The project follows a standard layered monolithic architecture based on the robust MVC (Model-View-Controller) design pattern logic.

* **Controllers** (`controllers/`): Handle all the incoming HTTP requests, validate URL parameters or body payloads, and route commands to the appropriate service.
* **Services** (`services/`): Contain the core business logic. This is where pricing calculations, user validation, and orchestrations happen.
* **Repositories** (`repositries/`): Interfaces extending Spring Data JPA's generic repositories to seamlessly communicate with the database via query methods without writing raw SQL.
* **Models / Entities** (`models/`): Represent the logical schema of the database tables (e.g., `User`, `Product`, `Order`).
* **DTOs** (`dtos/`): Data Transfer Objects. Objects exclusively designated to transport data shapes required by the API without exposing the internal database scheme.
* **Security** (`security/`): Contains the JWT (JSON Web Token) authentication filters and endpoint protection rules.
* **Utility / Exceptions / Enums**: Helper classes (`MappingUtility`), custom error handling (`UserNotFoundException`), and application constants (`UserType`).

### Architectural Flow (Code to Database)
When a user interacts with the system, the request generally follows this typical Spring Boot MVC flow:

1. **Frontend Request** -> `AuthFilter` (Validates the token in header)
2. **AuthFilter** -> `Controller` (e.g., `ProductController` accepts request)
3. **Controller** -> `Service` (e.g., `ProductService` processes business logic)
4. **Service** -> `Repository` (e.g., `ProductRepository` looks up data)
5. **Repository** -> `Database` (MySQL query via Hibernate mapping)

---

## 3. Explaining the Core Components with Code

### A. The Model / Entity (`models/`)
Entities map directly to our MySQL database tables using JPA/Hibernate notations (`@Entity`, `@Table`). 
*Example: Product.java*
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false)
    private String productName;
    
    // Establishing a relationship with the User entity (The vendor/admin)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### B. The Repository (`repositries/`)
Repositories act as the Data Access Layer (DAO). By extending `JpaRepository`, Spring Boot immediately gives us CRUD methods (like `save`, `findAll`, `findById`). We can also add automated custom queries based on method names.
*Example: ProductRepository.java (Hypothetical internal representation)*
```java
public interface ProductRepository extends JpaRepository<Product, UUID> {
    // Spring automatically generates a SQL query to find products by their name
    List<Product> findByProductNameStartingWithIgnoreCase(String productName);
}
```

### C. The Service Layer (`services/`)
Services inject the repositories and enforce business rules before hitting the database.
*Example: ProductService.java*
```java
@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    public Product saveOrUpdateProduct(Product product) {
        return this.productRepository.save(product); // Interacts directly with DB
    }

    public List<Product> searchProductByName(String productName) {
        // Business logic validation
        if (productName == null || productName.trim().isEmpty()) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        // Calling repository
        return productRepository.findByProductNameStartingWithIgnoreCase(productName);
    }
}
```

### D. The Controller (`controllers/`)
Controllers map URL paths to our codebase. They take the incoming JSON (mapped to DTOs), verify authentication credentials (like `Principal`), call the `Service` layer, and package the response as a `ResponseEntity`.
*Example: ProductController.java*
```java
@RestController
@RequestMapping("/api/v1/product")
// Enables cross-origin requests from the React application
@CrossOrigin(origins = "http://localhost:3000") 
public class ProductController {
    
    @Autowired
    ProductService productService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProduct(@RequestBody CreateProductRequestBody body, Principal principal) {
        // Find user via token ID / principal
        User user = userService.getUserByEmail(principal.getName());
        // Passes request down to service layer safely
        productService.registerProduct(body, user);
        return new ResponseEntity<>("Product created successfully", HttpStatus.CREATED);
    }
}
```

### E. DTOs (Data Transfer Objects) (`dtos/`)
DTOs separate the internal database structure from the API input/output. Instead of asking the frontend to provide the entire `Product` entity (which involves database primary keys), we ask for a customized body like `CreateProductRequestBody`.
```java
public class CreateProductRequestBody {
    private String productName;
    private double basePrice;
    // Exclusively holds fields needed for creation
}
```

### F. Helpers & Utility (`utility/`)
Utilities perform repetitive data conversions. `MappingUtility.java` is heavily used here to transport data between DTOs and actual Entities manually to stop boilerplate code from crowding the service layer.

---

## 4. Frontend to Backend Connection Details

### How does the frontend user (React) connect to this Spring Boot backend?

To make this system a full-stack application, the `zepto-fronted` project communicates with the `zepto-backend` via **RESTful APIs over HTTP**. 

1. **API Client & CORS Issues:** 
   The frontend runs on an external development server (port `3000`) and the backend locally on port `8080`. The React frontend uses an HTTP tool like `fetch` or `axios` to make web requests. To prevent the browser rejecting requests coming from port 3000 to 8080, the backend controllers are annotated with `@CrossOrigin(origins = "http://localhost:3000")`.
   
2. **The Authentication Flow (JWT):**
   * **Login Transaction:** The frontend sends a user's credentials (email/password payload) to `/login`.
   * **Token Issuing:** The backend checks the MySQL database in the `UserRepository`. If valid, the backend (`JwtUtil.java`) signs a JSON Web Token (JWT). This unique, tamper-proof string is returned to the frontend.
   * **State retention:** The React UI saves this token (in localStorage or cookies).
   * **Secured API Hits:** Upon hitting a secured endpoint (e.g. `GET /api/v1/product/list`), the React frontend appends an `Authorization` header containing `Bearer <TOKEN_STRING>`.
   
3. **Token Interception (`AuthFilter.java`):**
   When the request reaches the Spring server, it goes through `AuthFilter.java` before touching the Controller. The filter plucks out the JWT, decrypts it, and extracts the user's email and `UserType`. It saves this user detail contextually in Spring's `SecurityContextHolder`, which the controller injects as the `Principal` parameter.

4. **Data Passing:** 
   Eventually, the controller requests data from the service layer via JPA and MySQL. The controller returns this list as an automated Java-to-JSON format. The React frontend promises accurately receive this parsed JSON data and loop through it dynamically binding it to frontend components to display to the user.
