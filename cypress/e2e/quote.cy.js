describe("quote", () => {
  afterEach(() => {
    cy.logout();
  });

  it("can quote", () => {
    cy.login();
    cy.visit("http://localhost:3000/quote");
    cy.get('input[type="text"]').type("nflx");
    cy.get("button").contains("Quote").click();
    cy.wait(3000);
    cy.get("h5")
      .contains(/^A share of/g)
      .should("be.visible");
  });
});
