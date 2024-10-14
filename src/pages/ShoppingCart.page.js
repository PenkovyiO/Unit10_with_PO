import { expect } from '@playwright/test';
import { BaseSwagLabPage } from './BaseSwagLab.page';

export class ShoppingCartPage extends BaseSwagLabPage {
    url = '/cart.html';

    cartItemSelector = '.cart_item';

    removeItemSelector = '[id^="remove"]';

    headerTitle = this.page.locator('.title');

    itemTotal = this.page.locator('.summary_subtotal_label');

    summaryTotal = this.page.locator('.summary_total_label');

    summaryTax = this.page.locator('.summary_tax_label');

    cartItems = this.page.locator(this.cartItemSelector);

    firstNameInput = this.page.locator('#first-name');

    lastNameInput = this.page.locator('#last-name');

    zipInput = this.page.locator('#postal-code');

    continueButton = this.page.locator('#continue');

    // async below added to show the function returns a promise
    async getCartItemByName(name) {
        return this.page.locator(this.cartItemSelector, { hasText: name });
    }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }

    //verify cart page
    async verifyCartPage(){
        await this.page.waitForURL('**/cart.html')
        await expect(this.page.getByText('Your Cart')).toBeVisible();
    }

    //check selected item in cart
    async checkSelectedItem(itemArray){
        await expect(this.page.locator('.cart_item').first().locator('.inventory_item_name')).toHaveText(itemArray[0].name);
        await expect(this.page.locator('.cart_item').nth(1).locator('.inventory_item_name')).toHaveText(itemArray[1].name);

        await expect(this.page.locator('.cart_item').first().locator('.inventory_item_desc')).toHaveText(itemArray[0].description);
        await expect(this.page.locator('.cart_item').nth(1).locator('.inventory_item_desc')).toHaveText(itemArray[1].description);

        await expect(this.page.locator('.cart_item').first().locator('data-test=inventory-item-price')).toHaveText('$'+(itemArray[0].price).toString());
        await expect(this.page.locator('.cart_item').nth(1).locator('data-test=inventory-item-price')).toHaveText('$'+(itemArray[1].price).toString());
    }
    async goToCheckout(){
        await this.page.getByRole('button', { name: 'Checkout' }).click();
    }

    async goToFinish(){
        await this.page.getByRole('button', { name: 'Finish' }).click();
    }
    async goToHome(){
        await this.page.getByRole('button', { name: 'Back Home' }).click();
    }
    
    //verify Checkout page
    async verifyCheckoutPage(){
        await this.page.waitForURL('**/checkout-step-one.html')
        await expect(this.page).toHaveURL(/.*checkout-step-one/);
        await expect(this.page.getByText('Checkout: Your Information')).toBeVisible();
    }

    async performCheckout(firstName, lastName, zip) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipInput.fill(zip);
        await this.continueButton.click();
    }

    async itemTotalPrice(productArray){
        let itemsTotalPrice = 0 
        for (let i=0; i < productArray.length; i++) {
            itemsTotalPrice += productArray[i].price
        }
        return itemsTotalPrice
    }

    async taxCalculate(productArray){
        const taxRate = 0.08
        const tax = await this.itemTotalPrice(productArray) * taxRate
        const roundTax = Number(tax.toFixed(2))
        return roundTax
    }

    async calculateTotal(productArray){
        const itemTotal = await this.itemTotalPrice(productArray)
        const tax = await this.taxCalculate(productArray)
        const total = Number(itemTotal.toFixed(2)) + tax
        return total
    }

    async verifyCompletePage(){
        await expect(this.page).toHaveURL(/.*checkout-complete/);
        await expect(this.page.getByText('Checkout: Complete!')).toBeVisible();
        await expect(this.page.locator('.complete-header')).toHaveText('Thank you for your order!');
    }
    
}
    
