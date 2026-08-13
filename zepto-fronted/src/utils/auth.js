export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
