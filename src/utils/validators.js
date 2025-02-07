// src/utils/validators.js

// Valide un email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Valide le code postal français (5 chiffres)
function validatePostalCode(postalCode) {
    const regex = /^\d{5}$/;
    return regex.test(postalCode);
}

// Valide les noms, prénoms, villes (sans caractères spéciaux ni chiffres)
function validateName(name) {
    const regex = /^[A-Za-zÀ-ÿ' -]+$/;
    return regex.test(name);
}

// Vérifie si l'utilisateur a plus de 18 ans
function isAdult(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    return age > 18 || (age === 18 && monthDiff >= 0);
}

module.exports = {
    validateEmail,
    validatePostalCode,
    validateName,
    isAdult
};
