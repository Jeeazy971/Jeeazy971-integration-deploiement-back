const User = require("../models/User");
const { validateEmail, validatePostalCode, validateName, isAdult } = require("../utils/validators");

/**
 * Permet à un utilisateur de s'inscrire publiquement.
 * Effectue toutes les vérifications (présence, format, âge).
 * Exportée sous le nom registerUser (pour que les tests la trouvent).
 */
exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthDate, city, postalCode } = req.body;

        if (!firstName || !lastName || !email || !password || !birthDate || !city || !postalCode) {
            return res.status(400).json({ msg: "Tous les champs sont requis." });
        }
        if (!validateName(firstName)) {
            return res.status(400).json({ msg: "Le prénom n'est pas valide." });
        }
        if (!validateName(lastName)) {
            return res.status(400).json({ msg: "Le nom n'est pas valide." });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ msg: "L'email n'est pas valide." });
        }
        if (!validatePostalCode(postalCode)) {
            return res.status(400).json({ msg: "Le code postal n'est pas valide." });
        }
        if (!validateName(city)) {
            return res.status(400).json({ msg: "La ville n'est pas valide." });
        }
        if (!isAdult(birthDate)) {
            return res.status(400).json({ msg: "Vous devez être majeur pour vous inscrire." });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Un utilisateur avec cet email existe déjà." });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            birthDate,
            city,
            postalCode,
            role: "user"
        });
        await newUser.save();
        return res.status(201).json({ msg: "Inscription réussie." });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ msg: "Erreur serveur." });
    }
};

/**
 * Renvoie la liste publique des inscrits en masquant email et date de naissance.
 */
exports.getPublicUsers = async (req, res) => {
    try {
        const users = await User.find({}, { email: 0, birthDate: 0, __v: 0 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        return res.status(500).json({ msg: "Erreur serveur." });
    }
};
