describe("homepage without login", () => {
  afterEach(() => {
    cy.logout();
  });

  it("can login", () => {
    cy.login();
    cy.url().should("eq", "http://localhost:3000/dashboard");
  });
});
