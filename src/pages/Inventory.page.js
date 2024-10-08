import { BaseSwagLabPage } from './BaseSwagLab.page';

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    headerTitle = this.page.locator('.title');

    inventoryItems = this.page.locator('.inventory_item');

    addItemToCartButton = this.page.locator('[id^="add-to-cart"]');

    async addItemToCartById(id) {
        await this.addItemToCartButton.nth(id).click();
    }

    // Generate and return random number  generateRandomNumber(0, 6)  from 0 to 5 include.
    static generateRandomNumber(min, max){
        return  Math.floor( Math.random()*(max - min) + min)
    }

    //parse product data by index from Catalog and return an object
    async parseItemDataByIndexCatalog(index){
        const productItem =  this.page.locator('.inventory_item').nth(index); 
        return {
            name: await productItem.locator('.inventory_item_name').innerText(),
            description: await productItem.locator('.inventory_item_desc').innerText(),
            price: Number((await productItem.locator('.inventory_item_price').innerText()).replace('$', '')),
            productIndex: index,
        }
    }

    // generate two random number (can not be equal) and return result as array 
    async generateTwoNotEqualRandomNumber(){
        let numberOne = InventoryPage.generateRandomNumber(0,6)
        let numberTwo = numberOne
        
        while (numberOne === numberTwo) {
            numberTwo = InventoryPage.generateRandomNumber(0, 6);
        }

        return [numberOne,numberTwo];
    }

    async generateArrayOfProduct(productIndexArray){
        const productOne = await this.parseItemDataByIndexCatalog(productIndexArray[0]);
        const productTwo = await this.parseItemDataByIndexCatalog(productIndexArray[1]);
        return [productOne,productTwo]
    }

    async addTwoRandomItemToCartById(productIndexArray) {
        //await this.page.locator('.inventory_item').nth(productIndexArray[0]).locator('button:has-text("Add to cart")').click();
        //await this.page.locator('.inventory_item').nth(productIndexArray[1]).locator('button:has-text("Add to cart")').click();  
        for (let index of productIndexArray) {
            await this.page.locator('.inventory_item').nth(index).locator('button:has-text("Add to cart")').click();
        }
    }



}
