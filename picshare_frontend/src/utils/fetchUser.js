export const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    const userInfo = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    return userInfo;
}