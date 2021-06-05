it('Add new schema', () => {
  cy.visit('/');
  cy.findByTitle("+ Create schema").click();

  cy.url().should('include', 'schemas/create');

  cy.findByLabelText("Warmup duration (sec)")
    .focus()
    .type("{rightarrow}");
  cy.findByTitle("Plus rep")
    .click();
  cy.findByTitle("Plus set")
    .click();

  cy.findByTitle("Add exercise")
    .click()
    .click()
    .click();

  cy.findByLabelText("Pause between exercise (sec)")
    .focus()
    .type("{rightarrow}");
  cy.findByLabelText("Pause between reps (sec)")
    .focus()
    .type("{rightarrow}");

  cy.findByTitle("Plus interval reps")
    .click();
  cy.findByLabelText("Interval duration (sec)")
    .focus()
    .type("{rightarrow}");
  cy.findByLabelText("Interval pause (sec)")
    .focus()
    .type("{rightarrow}");

  cy.findByTitle("Save schema")
    .click();

  cy.url().should('include', 'schemas/list');
  cy.findByText("Warmup 15 minutes");
  cy.findByText("4 reps of 13 sets");
  cy.findAllByText("3 reps of 12 sets").should('have.length', 2);
  cy.findByText("with 35 seconds between reps and 70 seconds between exercise");
  cy.findByText("15 x interval 25 seconds on and 15 seconds off");
});