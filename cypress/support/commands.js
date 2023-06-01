Cypress.Commands.add('login', (username, password) => {
  cy.visit('/admin');
  cy.get('[id="_username"]').type(username);
  cy.get('[id="_password"]').type(password);
  cy.get('.primary').click();
});

Cypress.Commands.add('clickInFirst', (element) => {
  cy.get(element).first().scrollIntoView().click();
});

Cypress.Commands.add('addExchangeRate', (source, target, ratio) => {
  // Click in exchange rates in side menu
  cy.clickInFirst('a[href="/admin/exchange-rates/"]');
  // Click on create button
  cy.get('*[class^="ui labeled icon button  primary "]').click();
  // Select Source currency
  cy.get('#sylius_exchange_rate_sourceCurrency').select(source);
  // Select Target currency
  cy.get('#sylius_exchange_rate_targetCurrency').select(target);
  // Type ratio
  cy.get('#sylius_exchange_rate_ratio').type(ratio);
  // Click on create button
  cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();
  // Click in exchange rates in side menu
  cy.clickInFirst('a[href="/admin/exchange-rates/"]');
});
