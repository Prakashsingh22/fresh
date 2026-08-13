
const allProducts = [
    { productName: "iPhone 13", manufacturerName: "Apple", category: "Phones" },
    { productName: "Samsung Galaxy S21", manufacturerName: "Samsung", category: "Phones" },
    { productName: "Levis Men Jeans", manufacturerName: "Levis", category: "Fashion" },
    { productName: "Women Red Dress", manufacturerName: "Zara", category: "Fashion" },
    { productName: "Gold Necklace", manufacturerName: "Tanishq", category: "Jewelry" },
    { productName: "OnePlus 9", manufacturerName: "OnePlus", category: "Phones" },
    { productName: "Xiaomi Redmi Note 10", manufacturerName: "Xiaomi", category: "Phones" }
];

function filter(category, products) {
    if (category === "All") return products;

    const target = category.toLowerCase();

    const searchTerms =
        target === "phones" ? ["phone", "mobile", "smartphone", "cell", "iphone", "samsung", "pixel", "oneplus", "nokia", "moto", "xiaomi", "redmi", "realme", "oppo", "vivo"] :
            target === "freshvegitable" ? ["veg", "potato", "onion", "tomato", "carrot", "broccoli", "green", "fresh", "organic"] :
                target === "homedecoration" ? ["decor", "home", "painting", "vase", "lamp", "wall", "clock", "furniture"] :
                    target === "beauty" ? ["beauty", "makeup", "skin", "care", "hair", "lipstick", "cream", "lotion", "serum"] :
                        target === "jewelry" ? ["jewelry", "necklace", "earring", "bracelet", "ring", "pendant", "gold", "silver", "diamond"] :
                            target === "necklaces" ? ["necklace", "choker", "pendant"] :
                                target === "earrings" ? ["earring", "stud", "hoop", "jhumka"] :
                                    target === "bracelets" ? ["bracelet", "bangle", "wrist"] :
                                        target === "rings" ? ["ring", "band"] :
                                            target === "pendants" ? ["pendant", "pendent", "locket"] :
                                                target === "fashion" ? ["fashion", "clothing", "wear", "shirt", "pant", "top", "dress", "suit", "jacket", "coat"] :
                                                    target === "men" ? ["men", "man", "male", "boy", "gents"] :
                                                        target === "women" ? ["women", "woman", "female", "lady", "ladies", "girl"] :
                                                            [target];

    console.log(`Filtering for category: ${category}, terms: ${searchTerms}`);

    return products.filter(p => {
        const text = `${p.productName} ${p.manufacturerName}`.toLowerCase();
        return searchTerms.some(term => {
            // local logic copy
            if (["men", "man", "boy", "girl", "lady"].includes(term)) {
                const regex = new RegExp(`\\b${term}\\b`, 'i');
                return regex.test(text);
            }
            return text.includes(term);
        });
    });
}

console.log("--- Testing Fashion ---");
console.log(filter("Fashion", allProducts));

console.log("--- Testing Men ---");
console.log(filter("Men", allProducts));

console.log("--- Testing Women ---");
console.log(filter("Women", allProducts));

console.log("--- Testing Phones ---");
console.log(filter("Phones", allProducts));

console.log("--- Testing Jewelry ---");
console.log(filter("Jewelry", allProducts));
