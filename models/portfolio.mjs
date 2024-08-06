
// Importing required dependencies
import {getPlayersCollection} from '../utils/database.mjs';


// This class is used to create new portfolio item
export class PortfolioItem{
    constructor(stockObj, quantity){
        this.symbol = stockObj.symbol; // This is the symbol of the stock
        this.name = stockObj.name; // This is the name of the stock
        this.quantity = quantity; // This is the quantity of the stock bought
        this.purchasePrice = stockObj.price; // This is the price of the stock when it was bought
        this.currentPrice = stockObj.price; // This is the current price of the stock
        this.purchaseDate = new Date(); // This is the date when the stock was bought
        this.profit = this.currentPrice - this.purchasePrice; // This is the profit made from the stock
        this.totalValue = this.quantity * (this.currentPrice + this.profit); // This is the total value of the stock
    }


}