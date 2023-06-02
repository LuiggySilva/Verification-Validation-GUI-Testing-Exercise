describe('exchange rates', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });

  afterEach(() => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Verify if bulk delete button exists
    cy.get('div[class^="sylius-grid-nav"]').children().its('length').should('be.gt', 0).then((length) => {
      if (length > 1) {
        // Click in Select All Items of Exchange rate's list
        cy.get('th[class^="center aligned"]').click();
        // Click in the First of two Delete buttons at the page
        cy.get('button[class^="ui red labeled icon button"]').first().then((element) => {
          element.click();
        });
        // Click in confirmation button
        cy.get('div[id^="confirmation-button"]').click();
      }
    });
  });

  it('1. Create an exchange rate without ratio added.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('2. Create an exchange rate with equals Source and Target currency.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').type('5');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('3. Create an exchange rate with negative ratio.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to -5
    cy.get('#sylius_exchange_rate_ratio').type('-5');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('4. Create an exchange rate with ratio equals zero.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 0
    cy.get('#sylius_exchange_rate_ratio').type('0');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('5. Create a valid exchange rate.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');
  });

  it('6. Add input values and click in "Cancel".', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on Cancel button
    cy.get('a[class^="ui button"]').scrollIntoView().click();

    // Verify some exchange rate existence
    cy.get('div[class^="sylius-grid-wrapper"]').should(($children) => {
      let content = $children[0].children[1].children[1].children[1].textContent;

      expect(content).to.be.equals('There are no results to display');
    });
  });

  it('7. Create a new exchange rate equal a existent yet.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Create a other one

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('8. Create a new exchange rate equal a existent yet, but with inversal order of Source and Target.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Create a other one

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_targetCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('test case 09: Verify Filter list with existents exchange rates', () => {
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);
    cy.addExchangeRate('USD', 'EUR', 10);

    // Select CNY in filter
    cy.get('#criteria_currency').select("6");
    // Click in filter button
    cy.get('button[class^="ui blue labeled icon button"]').click();
    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?criteria%5Bcurrency%5D="]').click();

    // Testing if filter return only exchange rates with CNY in source or target
    cy.get('tr[class^="item"]').should(($children) => {
      expect($children.length).to.equal(2);

      let source1 = $children[0].children[1].textContent.replace('\n', '');
      let target1 = $children[0].children[2].textContent.replace('\n', '');
      let ratio1 = $children[0].children[3].textContent.replace('\n', '');
      expect(source1).to.equal('Chinese Yuan');
      expect(target1).to.equal('US Dollar');
      expect(ratio1).to.equal('5');

      let source2 = $children[1].children[1].textContent.replace('\n', '');
      let target2 = $children[1].children[2].textContent.replace('\n', '');
      let ratio2 = $children[1].children[3].textContent.replace('\n', '');
      expect(source2).to.equal('Euro');
      expect(target2).to.equal('Chinese Yuan');
      expect(ratio2).to.equal('1');
    });

  });


  it('test case 10: Verify Filter list with inexistents exchange rates', () => {
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);
    cy.addExchangeRate('USD', 'EUR', 10);

    // Select MEX in filter
    cy.get('#criteria_currency').select("10");
    // Click in filter button
    cy.get('button[class^="ui blue labeled icon button"]').click();
    // Testing if the filter returns nothing
    cy.get('body').should('contain', 'There are no results to display');

  });


  it('test case 11: Verify Filter list with All exchange rates', () => {
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Select All in filter
    cy.get('#criteria_currency').select("");
    // Click in filter button
    cy.get('button[class^="ui blue labeled icon button"]').click();
    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?criteria%5Bcurrency%5D="]').click();

    // Testing if filter return all exchange rates
    cy.get('tr[class^="item"]').should(($children) => {
      expect($children.length).to.equal(2);

      let source1 = $children[0].children[1].textContent.replace('\n', '');
      let target1 = $children[0].children[2].textContent.replace('\n', '');
      let ratio1 = $children[0].children[3].textContent.replace('\n', '');
      expect(source1).to.equal('Chinese Yuan');
      expect(target1).to.equal('US Dollar');
      expect(ratio1).to.equal('5');

      let source2 = $children[1].children[1].textContent.replace('\n', '');
      let target2 = $children[1].children[2].textContent.replace('\n', '');
      let ratio2 = $children[1].children[3].textContent.replace('\n', '');
      expect(source2).to.equal('Euro');
      expect(target2).to.equal('Chinese Yuan');
      expect(ratio2).to.equal('1');
    });

  });


  it('test case 12: Clear filters after filter existents exchange rates', () => {
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Select MEX in filter
    cy.get('#criteria_currency').select("10");
    // Click in filter button
    cy.get('button[class^="ui blue labeled icon button"]').click();
    // Testing if the filter returns nothing
    cy.get('body').should('contain', 'There are no results to display');

    // Click in clear filter button
    cy.get('a[class^="ui labeled icon button"][href^="/admin/exchange-rates/"]').last().click();
    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]').click();
    // Testing if filter return all exchange rates
    cy.get('tr[class^="item"]').should(($children) => {
      expect($children.length).to.equal(2);

      let source1 = $children[0].children[1].textContent.replace('\n', '');
      let target1 = $children[0].children[2].textContent.replace('\n', '');
      let ratio1 = $children[0].children[3].textContent.replace('\n', '');
      expect(source1).to.equal('Chinese Yuan');
      expect(target1).to.equal('US Dollar');
      expect(ratio1).to.equal('5');

      let source2 = $children[1].children[1].textContent.replace('\n', '');
      let target2 = $children[1].children[2].textContent.replace('\n', '');
      let ratio2 = $children[1].children[3].textContent.replace('\n', '');
      expect(source2).to.equal('Euro');
      expect(target2).to.equal('Chinese Yuan');
      expect(ratio2).to.equal('1');
    });

  });

  it('13. Edit the ratio of an existent exchange rate.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Edit

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on edit button
    cy.get('a[class^="ui labeled icon button "]').eq(1).click();

    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').clear().type('5');

    // Click on save changes button
    cy.get('button[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been created
    cy.get('body').should('contain', 'Exchange rate has been successfully updated.');

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // // Assert that exchange rate has been edited
    cy.get('table[class^="ui sortable stackable very basic celled table"]').should(($children) => {
      let content = $children[0].children[1].children[0].children[3].textContent;

      expect(content).to.be.equals('5');
    });
  });

  it('14. Edit the ratio of an existent exchange rate with negative ratio.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Edit

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on edit button
    cy.get('a[class^="ui labeled icon button "]').eq(1).click();

    // Type ratio to -5
    cy.get('#sylius_exchange_rate_ratio').clear().type('-5');

    // Click on save changes button
    cy.get('button[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been edited
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it('15. Edit the ratio of an existent exchange rate with ratio equals zero.', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Edit

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on edit button
    cy.get('a[class^="ui labeled icon button "]').eq(1).click();

    // Type ratio to 0
    cy.get('#sylius_exchange_rate_ratio').clear().type('0');

    // Click on save changes button
    cy.get('button[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has not been edited
    cy.get('body').should('contain', 'This form contains errors.');
  });

  it.only('16. Edit the ratio of an existent exchange rate and click in "Cancel".', () => {
    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on create button
    cy.get('*[class^="ui labeled icon button  primary "]').click();

    // Select US Dollar Source currency
    cy.get('#sylius_exchange_rate_sourceCurrency').select('USD');

    // Type ratio to 10
    cy.get('#sylius_exchange_rate_ratio').type('10');

    // Click on create button
    cy.get('*[class^="ui labeled icon primary button"]').scrollIntoView().click();

    // Assert that exchange rate has been created
    cy.get('body').should('contain', 'Exchange rate has been successfully created.');

    // Edit

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');

    // Click on edit button
    cy.get('a[class^="ui labeled icon button "]').eq(1).click();

    // Type ratio to 5
    cy.get('#sylius_exchange_rate_ratio').clear().type('5');

    // Click on Cancel button
    cy.get('a[class^="ui button"]').scrollIntoView().click();

    // Assert that exchange rate has not been edited
    cy.get('table[class^="ui sortable stackable very basic celled table"]').should(($children) => {
      let content = $children[0].children[1].children[0].children[3].textContent;

      expect(content).to.be.equals('10');
    });
  });

  it('test case 17: Delete one exchange rates using its specific button', () => {
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('USD', 'EUR', 10);
    
    // Click to remove first exchange rate
    cy.get('button[type="submit"][data-requires-confirmation=""]').first().click();
    // Click in confirmation button
    cy.get('div[id^="confirmation-button"]').click();

    // Test if has only one exchange rate and if it equals to ('EUR', 'CNY', 1)
    cy.get('tr[class^="item"]').should(($children) => {
      expect($children.length).to.equal(1);
      let source = $children[0].children[1].textContent.replace('\n', '');
      let target = $children[0].children[2].textContent.replace('\n', '');
      let ratio = $children[0].children[3].textContent.replace('\n', '');
      expect(source).to.equal('Euro');
      expect(target).to.equal('Chinese Yuan');
      expect(ratio).to.equal('1');
    });

  });

  
  it('test case 18: Delete two or more items of exchange rates using checkbox.', () => {
    cy.addExchangeRate('USD', 'EUR', 10);
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]').click();

    // Select first exchange rate ('CNY', 'USD', 5)
    cy.get('input[class^="bulk-select-checkbox"]').first().click();
    // Select last exchange rate  ('USD', 'EUR', 10)
    cy.get('input[class^="bulk-select-checkbox"]').last().click();
    // Click in the First of two Delete buttons at the page
    cy.get('button[class^="ui red labeled icon button"]').first().then((element) => {
      element.click();
    });
    // Click in confirmation button
    cy.get('div[id^="confirmation-button"]').click();

    // Test if has only one exchange rate and if it equals to ('EUR', 'CNY', 1)
    cy.get('tr[class^="item"]').should(($children) => {
      expect($children.length).to.equal(1);
      let source = $children[0].children[1].textContent.replace('\n', '');
      let target = $children[0].children[2].textContent.replace('\n', '');
      let ratio = $children[0].children[3].textContent.replace('\n', '');
      expect(source).to.equal('Chinese Yuan');
      expect(target).to.equal('US Dollar');
      expect(ratio).to.equal('5');
    });

  });


  it('test case 19: Delete all items of exchange rates', () => {
    cy.addExchangeRate('USD', 'EUR', 10);
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Click in exchange rates in side menu
    cy.clickInFirst('a[href="/admin/exchange-rates/"]');
    // Click in Select All Items of Exchange rate's list
    cy.get('th[class^="center aligned"]').click();
    // Click in the First of two Delete buttons at the page
    cy.get('button[class^="ui red labeled icon button"]').first().then((element) => {
      element.click();
    });
    // Click in confirmation button
    cy.get('div[id^="confirmation-button"]').click();
    // Testing if it has no exchange rate
    cy.get('body').should('contain', 'There are no results to display');
    
  });


  it('test case 20: Testing if all they exchange rates are in descending order', () => {
    cy.addExchangeRate('USD', 'EUR', 10);
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]').click();
    // Getting all exchange rates and verify if they are in descending order
    cy.get('tr[class^="item"]').should(($children) => {
      var descending = true;
      for (let index = 0; index < $children.length - 1; index++) {
        let ratio1 = $children[index].children[3].textContent;
        let ratio2 = $children[index+1].children[3].textContent;

        if (parseFloat(ratio1) < parseFloat(ratio2)) {
          descending = false;
          break;
        }
      }
      // Testing if all exchange rates are in descending order
      expect(descending).to.be.true;
    }).as("Testing if all they exchange rates are in descending order");
  
  });


  it('test case 21: Testing if all they exchange rates are in ascending order', () => {
    cy.addExchangeRate('USD', 'EUR', 10);
    cy.addExchangeRate('EUR', 'CNY', 1);
    cy.addExchangeRate('CNY', 'USD', 5);

    // Click in button to descending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]').click();
    // Click in button again to ascending order all exchange rates by ratio
    cy.get('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]').click();
    // Getting all exchange rates and verify if they are in ascending order
    cy.get('tr[class^="item"]').should(($children) => {
      var ascending = true;
      for (let index = 0; index < $children.length - 1; index++) {

        let ratio1 = $children[index].children[3].textContent;
        let ratio2 = $children[index+1].children[3].textContent;

        if (parseFloat(ratio1) > parseFloat(ratio2)) {
          ascending = false;
          break;
        }
      }
      // Testing if all exchange rates are in ascending order
      expect(ascending).to.be.true;
    }).as("Testing if all they exchange rates are in ascending order");
  
  });

});
