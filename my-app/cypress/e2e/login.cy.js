describe('template spec', () => {
    beforeEach(() => {
        cy.visit(' http://localhost:9000');
    });
    it('Login form', () => {
        cy.get('a').contains('Login').click();
        cy.get('input[type="email"]').type('folder.mg@gmail.com');
        cy.get('input[type="password"]').type('123456');
        cy.get('button').contains('Login').click();
    });
});
