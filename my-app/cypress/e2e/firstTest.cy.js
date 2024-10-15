describe('template spec', () => {
    it('passes', () => {
        cy.visit(' http://localhost:9000');

        cy.get('[data-testid="cypress-titel"]').should('exist');
    });
});
