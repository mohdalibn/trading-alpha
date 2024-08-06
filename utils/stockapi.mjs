
// Importing required dependencies
import axios from "axios";
import fs from "fs";

// My Stock API Key from Financial Modelling Prep
const myAPIKey = 'RtzmutbVBP3j9Rom7agZctwlNYMi1UoQ';

// Function to create axios instance with my API key
const axiosInstance = () => axios.create({
  baseURL: 'https://financialmodelingprep.com/api/v3/',
  params: { apikey: myAPIKey },
});

// This Function gets all the NYSE stocks using axios and my stock API 
export async function getNyseStocks() {
  const instance = axiosInstance();
  try {
    const response = await instance.get('stock/list?exchange=NYSE');
    const allStocks = response.data;
    const nyseStocks = [];

    // Only adding the NYSE Stocks to the list
    for (const stock of allStocks) {
        if (stock.exchangeShortName === 'NYSE') {
          nyseStocks.push(stock);
        }
    }

    // console.log('All NYSE Stocks:', nyseStocks);
    return nyseStocks;
    
  } 
  catch (error) {
    console.error('Error getting the NYSE Stocks:', error);
    return [];
  }
}


// This Function will be used to update the stocks info in the stocks.txt file
export async function updateStocksInfo(){

    var allStocks = await getNyseStocks().then((stocks) => {

        // Checks if the list of NYSE stocks is empty (Possibly due to API error)
        if (stocks.length === 0) {
            console.log('No stocks found!');
            return;
        }

        // Writing the updated stocks info to the stocks.txt file
        fs.writeFile('stocks.txt', JSON.stringify(stocks), (err) => {
            if (err){
                throw err
            };
            // console.log('stocks.txt has been updated!');
        });
    });
    

}


// Function the retrieve the current stock price of a stock from the stocks.txt
export async function getStockInfo(ticker, getFullDetails = false) {
  try {
    const stocks = JSON.parse(fs.readFileSync('stocks.txt', 'utf8'));
    const stock = stocks.find((s) => s.symbol === ticker);

    // If the stock ticker is not found in the stocks.txt file
    if (!stock) {
      console.log('No stock found with ticker:', ticker);
      return null;
    }

    // Returns all the stock info if the full details are requested
    if(getFullDetails){
        return stock
    }
    return {name: stock.name,symbol: stock.symbol, price: stock.price};
  } catch (error) {
    console.error('Error in getStockPrice:', error);
    return null;
  }
}


// console.log(getStockPrice("UBER"));

// await updateStocksInfo();




