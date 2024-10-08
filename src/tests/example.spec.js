import { expect } from '@playwright/test';
import { test } from '../fixtures/base';

const user ={
    login:'standard_user',
    password:'secret_sauce',
    firstName:' AlexTest',
    lastName: 'Penkovyi',
    zipCode: 'T5M 3N4'
}


test.describe('Saucedemo app basic tests', () => {

    test.beforeEach('Success login', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin(user.login, user.password);
        await expect(app.inventory.headerTitle).toBeVisible();
        expect(await app.inventory.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test.skip('should login successfully', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin(user.login, user.password);

        await expect(app.inventory.headerTitle).toBeVisible();

        expect(await app.inventory.inventoryItems.count()).toBeGreaterThanOrEqual(1);
    });

    test.skip('should add and remove product from the cart', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        await app.login.navigate();
        await app.login.performLogin(user.login, user.password);
        await app.inventory.addItemToCartById(0);
        expect(await app.inventory.getNumberOfItemsInCart()).toBe('1');

        await app.inventory.shoppingCart.click();
        expect(await app.shoppingCart.cartItems.count()).toBeGreaterThanOrEqual(1);

        await app.shoppingCart.removeCartItemById(0);
        await expect(app.shoppingCart.cartItems).not.toBeAttached();
    });
    test('Test 2-3. Select 2 random product in catalog add to cart and buy it', async (
        /** @type {{ app: import('../pages/Application').Application }} */{ app },
    ) => {
        //create variable that get array of 2 random numbers 
        const productIndexArray = await app.inventory.generateTwoNotEqualRandomNumber()

        //add 2 random item to the cart 
        await app.inventory.addTwoRandomItemToCartById(productIndexArray);

        //parse items data into array
        const selectedProducts = await app.inventory.generateArrayOfProduct(productIndexArray)
        
        //check Item number in cart
        expect(await app.inventory.getNumberOfItemsInCart()).toBe(`${productIndexArray.length}`)

        //go to cart
        await app.inventory.shoppingCart.click();
        await app.shoppingCart.verifyCartPage()

        //check Item number in cart
        expect(await app.shoppingCart.cartItems.count()).toEqual(productIndexArray.length);

        //Verify products are displayed correctly (check Name, Description, and Price values)
        expect(await app.shoppingCart.checkSelectedItem(selectedProducts))

        //checkout
        await app.shoppingCart.goToCheckout()

        //Verify checkout page
        await app.shoppingCart.verifyCheckoutPage()

        //fill the form 
        await app.shoppingCart.performCheckout(user.firstName, user.lastName, user.zipCode)
        await expect(app.shoppingCart.headerTitle).toBeVisible();


        //Verify items in page
        expect(await app.shoppingCart.checkSelectedItem(selectedProducts))
        //Verify item total price 
        await expect(app.shoppingCart.itemTotal).toContainText((await (app.shoppingCart.itemTotalPrice(selectedProducts))).toString()) 
        //Tax
        await expect(app.shoppingCart.summaryTax).toContainText((await (app.shoppingCart.taxCalculate(selectedProducts))).toString()) 
        //Total Price
        await expect(app.shoppingCart.summaryTotal).toContainText((await (app.shoppingCart.calculateTotal(selectedProducts))).toString()) 

        //Finish
        await app.shoppingCart.goToFinish()
        //Complete order        
        await app.shoppingCart.verifyCompletePage()
        await app.shoppingCart.goToHome()
    });
});