const { validateEmail, validatePostalCode, validateName, isAdult } = require("../src/utils/validators");

describe("Tests de validation des données", () => {
    test("Devrait valider un email correct", () => {
        expect(validateEmail("test@example.com")).toBe(true);
        expect(validateEmail("invalid-email")).toBe(false);
    });

    test("Devrait valider un code postal français", () => {
        expect(validatePostalCode("75001")).toBe(true);
        expect(validatePostalCode("123")).toBe(false);
        expect(validatePostalCode("ABCDE")).toBe(false);
    });

    test("Devrait valider les noms et prénoms", () => {
        expect(validateName("Jean-Pierre")).toBe(true);
        expect(validateName("O'Connor")).toBe(true);
        expect(validateName("John123")).toBe(false);
        expect(validateName("Marie!")).toBe(false);
    });

    test("Devrait vérifier si l'utilisateur est majeur", () => {
        expect(isAdult("2000-01-01")).toBe(true);
        expect(isAdult("2010-01-01")).toBe(false);
    });
});
