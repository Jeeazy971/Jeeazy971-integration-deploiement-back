const User = require("../models/User");

exports.createUserByAdmin = async (req, res) => {
    try {
        // Vérifier que l'utilisateur connecté est admin (vous pouvez aussi le faire dans authMiddleware)
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ msg: "Accès interdit : administrateur uniquement" });
        }

        const { firstName, lastName, email, password, birthDate, city, postalCode, role } = req.body;

        // Vérifier les champs obligatoires
        if (!firstName || !lastName || !email || !password || !birthDate || !city || !postalCode) {
            return res.status(400).json({ msg: "Champs requis manquants." });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Cet utilisateur existe déjà." });
        }

        // Déterminer le rôle : "user" par défaut si pas fourni ou invalide
        let assignedRole = "user";
        if (role && ["user", "admin"].includes(role)) {
            assignedRole = role;
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            birthDate,
            city,
            postalCode,
            role: assignedRole,
            createdBy: req.user.id
        });

        await newUser.save();
        return res.status(201).json({ msg: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la création par un admin:", error);
        return res.status(500).json({ msg: "Erreur serveur" });
    }
};
