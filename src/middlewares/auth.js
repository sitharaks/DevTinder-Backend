const adminAuth = (req, res, next) => {
    console.log("Admin middleware executed");
    const token = "xyz"
    const isAuthorized = token === "xyz"; // Example authorization check
    if (!isAuthorized) {
        return res.status(403).send("Forbidden");
    }
    next();
};

module.exports = {
    adminAuth
};