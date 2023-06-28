const adminMiddleware = (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    const requiredRole = "admin"; // Rôle requis (dans cet exemple : "admin")

    if (userRole === requiredRole) {
        next(); // L'utilisateur a le rôle d'admin, passe à la prochaine étape
    } else {
        res.sendStatus(403); // L'utilisateur n'a pas le rôle d'admin, envoie une réponse "Forbidden"
    }
};

module.exports = adminMiddleware;