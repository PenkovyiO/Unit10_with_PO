import { BaseSwagLabPage } from './BaseSwagLab.page';

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    headerTitle = this.page.locator('.title');

    inventoryItems = this.page.locator('.inventory_item');

    addItemToCartButton = this.page.locator('[id^="add-to-cart"]');

    sortingElement = this.page.locator('.product_sort_container')

    async addItemToCartById(id) {
        await this.addItemToCartButton.nth(id).click();
    }

    // Generate and return random number  generateRandomNumber(0, 6)  from 0 to 5 include.
    static generateRandomNumber(min, max){
        return  Math.floor( Math.random()*(max - min) + min)
    }

    async getRandomNumbersArray(max=6, length=2, min=0){
        //not finished!
        const randomItem = Math.floor( Math.random()*(max - min) + min)
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
    
    async parseAllItems(){
        let allItemArray =[]
        for (let i=0; i<6; i++) {
            const productItem =  this.page.locator('.inventory_item').nth(i); 
            allItemArray.push({
                name: await productItem.locator('.inventory_item_name').innerText(),
                description: await productItem.locator('.inventory_item_desc').innerText(),
                price: Number((await productItem.locator('.inventory_item_price').innerText()).replace('$', '')),
            })
        }
        return allItemArray
    }

    async sortNameFromAtoZ(){
        await this.sortingElement.selectOption({value:'az'})
    }
    async sortNameFromZtoA(){
        await this.sortingElement.selectOption({value:'za'})
    }
    async sortPriceFromLowToHight(){
        await this.sortingElement.selectOption({value:'lohi'})
    }
    async sortPriceFromHightToLow(){
        await this.sortingElement.selectOption({value:'hilo'})
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
        return Promise.all(
            productIndexArray.map( async el => {
                return  await this.parseItemDataByIndexCatalog(el);
            })
        )
    }

    async addTwoRandomItemToCartById(productIndexArray) {
        for (let index of productIndexArray) {
            await this.page.locator('.inventory_item').nth(index).locator('button:has-text("Add to cart")').click();
        }
    }



}
