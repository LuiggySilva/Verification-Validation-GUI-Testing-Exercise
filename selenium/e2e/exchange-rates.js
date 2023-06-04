const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');


async function addExchangeRate(driver, source, target, ratio) {
    // Click in exchange rates in side menu
    await driver.findElement(By.linkText('Exchange rates')).click();

    // Click on create button
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon button  primary "]'));
    await buttons[0].click();

    // Select Source currency
    const sourceDropdown = await driver.findElement(By.id('sylius_exchange_rate_sourceCurrency'));
    await driver.executeScript(`arguments[0].value = '${source}';`, sourceDropdown);

    // Select Source currency
    const targetDropdown = await driver.findElement(By.id('sylius_exchange_rate_targetCurrency'));
    await driver.executeScript(`arguments[0].value = '${target}';`, targetDropdown);

    // Type ratio to 5
    await driver.findElement(By.id('sylius_exchange_rate_ratio')).sendKeys(ratio);

    // Click on create button
    const buttonToCreate = await driver.findElements(By.css('*[class^="ui labeled icon primary button"]'));
    await buttonToCreate[0].click();

    // Click in exchange rates in side menu
    await driver.findElement(By.linkText('Exchange rates')).click();
}


describe('exchange rates', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    // await driver.get('http://150.165.75.99:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });
  
  afterEach(async () => {
    // Click in exchange rates in side menu
    await driver.findElement(By.linkText('Exchange rates')).click();
    // Verify if bulk delete button exists
    const sylius_grid_nav = await driver.findElement(By.className('sylius-grid-nav'));
    const sylius_grid_nav_childrens = await sylius_grid_nav.findElements({ css: '*' });
    const sylius_grid_nav_childrens_length = sylius_grid_nav_childrens.length;
    if (sylius_grid_nav_childrens_length > 1) {
      // Click in Select All Items of Exchange rate's list
      await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[1]/input')).click();
      // Click in the First of two Delete buttons at the page
      await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[1]/div[1]/form')).click();
      // Click in confirmation button
      await driver.findElement(By.id('confirmation-button')).click();
    }
  });

  it('test case 09: Verify Filter list with existents exchange rates', async () => {
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');
    await addExchangeRate(driver, 'USD', 'EUR', '10');

    // Select CNY in filter
    const filterDropdown = await driver.findElement(By.id('criteria_currency'));
    await driver.executeScript(`arguments[0].value = '6';`, filterDropdown);
    // Click in filter button
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/form/button')).click();
    // Click in button to descending order all exchange rates by ratio
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[4]')).click();
    
    // Testing if filter return only exchange rates with CNY in source or target
    const items_table_tbody = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/tbody'));
    const items_table_tbody_childrens = await items_table_tbody.findElements(By.className('item'));
    assert.strictEqual(items_table_tbody_childrens.length, 2);

    const exchange_rate1 = await items_table_tbody_childrens[0].findElements(By.tagName('td'));
    const source1 = await exchange_rate1[1].getText();
    const target1 = await exchange_rate1[2].getText();
    const ratio1 = await exchange_rate1[3].getText();
    assert.strictEqual(source1, 'Chinese Yuan');
    assert.strictEqual(target1, 'US Dollar');
    assert.strictEqual(ratio1, '5');
    
    const exchange_rate2 = await items_table_tbody_childrens[1].findElements(By.tagName('td'));
    const source2 = await exchange_rate2[1].getText();
    const target2 = await exchange_rate2[2].getText();
    const ratio2 = await exchange_rate2[3].getText();
    assert.strictEqual(source2, 'Euro');
    assert.strictEqual(target2, 'Chinese Yuan');
    assert.strictEqual(ratio2, '1');
  });


  it('test case 10: Verify Filter list with inexistents exchange rates', async () => {
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');
    await addExchangeRate(driver, 'USD', 'EUR', '10');

    // Select All in filter
    const filterDropdown = await driver.findElement(By.id('criteria_currency'));
    await driver.executeScript(`arguments[0].value = '10';`, filterDropdown);
    // Click in filter button
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/form/button')).click();
    
    // Testing if the filter returns nothing
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });


  it('test case 11: Verify Filter list with All exchange rates', async () => {
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Select All in filter
    const filterDropdown = await driver.findElement(By.id('criteria_currency'));
    await driver.executeScript(`arguments[0].value = '';`, filterDropdown);
    // Click in filter button
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/form/button')).click();
    // Click in button to descending order all exchange rates by ratio
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[4]')).click();
    
    // Testing if filter return all exchange rates
    const items_table_tbody = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/tbody'));
    const items_table_tbody_childrens = await items_table_tbody.findElements(By.className('item'));
    assert.strictEqual(items_table_tbody_childrens.length, 2);

    const exchange_rate1 = await items_table_tbody_childrens[0].findElements(By.tagName('td'));
    const source1 = await exchange_rate1[1].getText();
    const target1 = await exchange_rate1[2].getText();
    const ratio1 = await exchange_rate1[3].getText();
    assert.strictEqual(source1, 'Chinese Yuan');
    assert.strictEqual(target1, 'US Dollar');
    assert.strictEqual(ratio1, '5');
    
    const exchange_rate2 = await items_table_tbody_childrens[1].findElements(By.tagName('td'));
    const source2 = await exchange_rate2[1].getText();
    const target2 = await exchange_rate2[2].getText();
    const ratio2 = await exchange_rate2[3].getText();
    assert.strictEqual(source2, 'Euro');
    assert.strictEqual(target2, 'Chinese Yuan');
    assert.strictEqual(ratio2, '1');
  });


  it('test case 12: Clear filters after filter existents exchange rates', async () => {
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Select MEX in filter
    const filterDropdown = await driver.findElement(By.id('criteria_currency'));
    await driver.executeScript(`arguments[0].value = '10';`, filterDropdown);
    // Click in filter button
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/form/button')).click();
    // Testing if the filter returns nothing
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));

    // Click in clear filter button
    const bnt = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[3]/div[2]/form/a'));
    await bnt.click();
    // Click in button to descending order all exchange rates by ratio
    const link = await driver.findElement(By.css('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]'));
    await link.click();
    
    // Testing if filter return all exchange rates
    const items_table_tbody = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/tbody'));
    const items_table_tbody_childrens = await items_table_tbody.findElements(By.className('item'));
    assert.strictEqual(items_table_tbody_childrens.length, 2);

    const exchange_rate1 = await items_table_tbody_childrens[0].findElements(By.tagName('td'));
    const source1 = await exchange_rate1[1].getText();
    const target1 = await exchange_rate1[2].getText();
    const ratio1 = await exchange_rate1[3].getText();
    assert.strictEqual(source1, 'Chinese Yuan');
    assert.strictEqual(target1, 'US Dollar');
    assert.strictEqual(ratio1, '5');
    
    const exchange_rate2 = await items_table_tbody_childrens[1].findElements(By.tagName('td'));
    const source2 = await exchange_rate2[1].getText();
    const target2 = await exchange_rate2[2].getText();
    const ratio2 = await exchange_rate2[3].getText();
    assert.strictEqual(source2, 'Euro');
    assert.strictEqual(target2, 'Chinese Yuan');
    assert.strictEqual(ratio2, '1');
  });


  it('test case 17: Delete one exchange rates using its specific button', async () => {
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'USD', 'EUR', '10');

    // Click to remove first exchange rate
    await driver.findElement(By.css('button[type="submit"][data-requires-confirmation=""]')).click();
    // Click in confirmation button
    await driver.findElement(By.id('confirmation-button')).click();

    // Testing if has only one exchange rate and if it equals to ('EUR', 'CNY', 1)
    const items_table_tbody_childrens = await driver.findElements(By.css('tbody tr[class^="item"]'));
    assert.strictEqual(items_table_tbody_childrens.length, 1);

    const source = await items_table_tbody_childrens[0].findElement(By.xpath('./td[2]')).getText();
    const target = await items_table_tbody_childrens[0].findElement(By.xpath('./td[3]')).getText();
    const ratio = await items_table_tbody_childrens[0].findElement(By.xpath('./td[4]')).getText();
    assert.strictEqual(source, 'Euro');
    assert.strictEqual(target, 'Chinese Yuan');
    assert.strictEqual(ratio, '1');
  });


  it('test case 18: Delete two or more items of exchange rates using checkbox', async () => {
    await addExchangeRate(driver, 'USD', 'EUR', '10');
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Click in button to descending order all exchange rates by ratio
    const link = await driver.findElement(By.css('th.sortable a[href*="/admin/exchange-rates/?sorting%5Bratio%5D="]'));
    await link.click();
    // Select first exchange rate ('CNY', 'USD', 5)
    const checkboxes = await driver.findElements(By.css('input[class^="bulk-select-checkbox"]'));
    await checkboxes[0].click();
    // Select last exchange rate  ('USD', 'EUR', 10)
    await checkboxes[checkboxes.length - 1].click();

    // Click in the First of two Delete buttons at the page
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[1]/div[1]/form')).click();
    // Click in confirmation button
    await driver.findElement(By.id('confirmation-button')).click();

    // Testing if has only one exchange rate and if it equals to ('EUR', 'CNY', 1)
    const items_table_tbody_childrens = await driver.findElements(By.css('tr[class^="item"]'));
    assert.strictEqual(items_table_tbody_childrens.length, 1);

    const source = await items_table_tbody_childrens[0].findElement(By.xpath('./td[2]')).getText();
    const target = await items_table_tbody_childrens[0].findElement(By.xpath('./td[3]')).getText();
    const ratio = await items_table_tbody_childrens[0].findElement(By.xpath('./td[4]')).getText();
    assert.strictEqual(source, 'Chinese Yuan');
    assert.strictEqual(target, 'US Dollar');
    assert.strictEqual(ratio, '5');
  });


  it('test case 19: Delete all items of exchange rates', async () => {
    await addExchangeRate(driver, 'USD', 'EUR', '10');
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Click in Select All Items of Exchange rate's list
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[1]/input')).click();
    // Click in the First of two Delete buttons at the page
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[1]/div[1]/form')).click();
    // Click in confirmation button
    await driver.findElement(By.id('confirmation-button')).click();

    // Testing if it has no exchange rate
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });


  it('test case 20: Testing if all they exchange rates are in descending order', async () => {
    await addExchangeRate(driver, 'USD', 'EUR', '10');
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Click in button to descending order all exchange rates by ratio
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[4]')).click();
    // Getting all exchange rates and verify if they are in descending order
    var descending = true;
    const items_table_tbody = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/tbody'));
    const items_table_tbody_childrens = await items_table_tbody.findElements(By.className('item'));
    for (let i = 0; i < items_table_tbody_childrens.length - 1; i++) {
      const exchange_rate1 = await items_table_tbody_childrens[i].findElements(By.tagName('td'));
      const exchange_rate2 = await items_table_tbody_childrens[i+1].findElements(By.tagName('td'));
      const ratio1 = await exchange_rate1[3].getText();
      const ratio2 = await exchange_rate2[3].getText();
      if (parseFloat(ratio1) < parseFloat(ratio2)) {
        descending = false;
        break;
      }
    }
    // Testing if all exchange rates are in descending order
    assert(descending);
  });


  it('test case 21: Testing if all they exchange rates are in ascending order', async () => {
    await addExchangeRate(driver, 'USD', 'EUR', '10');
    await addExchangeRate(driver, 'EUR', 'CNY', '1');
    await addExchangeRate(driver, 'CNY', 'USD', '5');

    // Click in button to descending order all exchange rates by ratio
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[4]')).click();
    // Click in button again to ascending order all exchange rates by ratio
    await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/thead/tr/th[4]')).click();
    // Getting all exchange rates and verify if they are in ascending order
    var ascending = true;
    const items_table_tbody = await driver.findElement(By.xpath('/html/body/div[1]/div[2]/div[2]/div[5]/div[2]/table/tbody'));
    const items_table_tbody_childrens = await items_table_tbody.findElements(By.className('item'));
    for (let i = 0; i < items_table_tbody_childrens.length - 1; i++) {
      const exchange_rate1 = await items_table_tbody_childrens[i].findElements(By.tagName('td'));
      const exchange_rate2 = await items_table_tbody_childrens[i+1].findElements(By.tagName('td'));
      const ratio1 = await exchange_rate1[3].getText();
      const ratio2 = await exchange_rate2[3].getText();
      if (parseFloat(ratio1) > parseFloat(ratio2)) {
        ascending = false;
        break;
      }
    }
    // Testing if all exchange rates are in ascending order
    assert(ascending);
  });

});

