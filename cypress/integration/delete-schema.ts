it('Delete schema', () => {
  cy.visit('/')
  cy.findByTitle("+ Create schema")
    .click()
  cy.findByTitle("Save schema")
    .click()
  cy.findByTitle("- Delete schema")
    .click()
  cy.findByText("No schema's found.");
});
