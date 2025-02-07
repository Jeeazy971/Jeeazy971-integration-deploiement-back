const { validateEmail, validatePostalCode, validateName, isAdult } = require("../src/utils/validators");

describe("Tests de validation des données", () => {
    it("Devrait valider un email correct", () => {
        expect(validateEmail("test@example.com")).toBe(true);
        expect(validateEmail("invalid-email")).toBe(false);
    });

    it("Devrait valider un code postal français", () => {
        expect(validatePostalCode("75001")).toBe(true);
        expect(validatePostalCode("123")).toBe(false);
        expect(validatePostalCode("ABCDE")).toBe(false);
    });

    it("Devrait valider les noms et prénoms", () => {
        expect(validateName("Jean-Pierre")).toBe(true);
        expect(validateName("O'Connor")).toBe(true);
        expect(validateName("John123")).toBe(false);
        expect(validateName("Marie!")).toBe(false);
    });

    it("Devrait vérifier si l'utilisateur est majeur", () => {
        expect(isAdult("2000-01-01")).toBe(true);
        expect(isAdult("2010-01-01")).toBe(false);
    });
});
