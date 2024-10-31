describe('template spec', () => {
    it('passes', () => {
        cy.visit(' http://localhost:9000');

        cy.get('[data-testid="cypress-titel"]').should('exist');
    });
});

describe('Home Component E2E Tests', () => {
    beforeEach(() => {
        cy.visit(' http://localhost:9000');
    });
    it('should display an error for invalid email format', () => {
        cy.get('input[type="email"]').type('invalid-email');
        cy.get('input[type="password"]').type('password123');
        cy.get('button').contains('Create an account').click();

        cy.on('window:alert', (str) => {
            expect(str).to.equal('Invalid email format');
        });
    });

    it('should display register form by default', () => {
        cy.contains('Register');
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
    });

    it('should allow user to register', () => {
        cy.get('input[type="email"]').type('testuser@ex345amplwd.com');
        cy.get('input[type="password"]').type('password12');
        cy.get('button').contains('Create an account').click();

        cy.url().should('include', '/private');
    });
    it('sing out', () => {
        cy.get('button').contains('logout').click;
    });
});
