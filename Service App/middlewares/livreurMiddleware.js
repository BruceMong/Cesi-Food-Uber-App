const livreurMiddleware = (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    const allowedRoles = ["Livreur", "admin"]; // Rôles autorisés (dans cet exemple : "Livreur" et "Admin")

    if (allowedRoles.includes(userRole)) {
        next(); // L'utilisateur a l'un des rôles autorisés, passe à la prochaine étape
    } else {
        res.sendStatus(403); // L'utilisateur n'a pas l'un des rôles autorisés, envoie une réponse "Forbidden"
    }
};

module.exports = livreurMiddleware;