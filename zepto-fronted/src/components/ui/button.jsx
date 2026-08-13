const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;