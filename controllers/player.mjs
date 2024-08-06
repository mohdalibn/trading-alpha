
// Importing dependencies for this module
import {getPlayersCollection} from '../utils/database.mjs';
import {getStockInfo} from '../utils/stockapi.mjs';
import { PortfolioItem } from '../models/portfolio.mjs';
import { htmlFiles } from '../app.mjs';

// This function is used to buy stocks for a user
export async function buyStockPOST(req, res){

    // Getting the username, stock symbol and quantity from the request
    const username = req.params.username;
    const stockSymbol = req.params.stockticker;
    const quantity = req.params.quantity;

    // Checking if the stock is in the stocks.txt file
    const stock = await getStockInfo(stockSymbol);
    if(!stock){
        return res.status(404).send(`Stock with the symbol ${stockSymbol} does not exist!`);
    }

    // Getting the player collection
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: username});

    // If the player exists in the players collection
    if(player){
        // If the player has enough funding to buy the stocks
        if(player.funding >= stock.price * quantity){
            // Adding the stock to the player's portfolio
            player.portfolio.push(new PortfolioItem(stock, quantity));
            // Updating the player's funding
            player.funding -= stock.price * quantity;
            // Updating the player's total value
            player.totalValue += stock.price * quantity;
            // Updating the player's portfolio
            await playerCollection.updateOne({username: username}, {$set: {portfolio: player.portfolio}});
            // Updating the player's funding
            await playerCollection.updateOne({username: username}, {$set: {funding: player.funding}});
            // Updating the player's total value
            await playerCollection.updateOne({username: username}, {$set: {totalValue: player.totalValue}});
            return res.status(200).send(`Successfully bought ${quantity} stocks of ${stockSymbol} for ${username}`);
        }
        else{
            return res.status(401).send(`Player ${username} does not have enough funding to buy ${quantity} stocks of ${stockSymbol}`);
        }
    }
    else{
        return res.status(404).send(`Player with the username ${username} does not exist!`);
    }

}

// This function is used to sell stocks for a user
export async function sellStockPOST(req, res){ 

    // Getting the username, stock symbol and quantity from the request
    const username = req.params.username;
    const stockSymbol = req.params.stockticker;
    const quantity = req.params.quantity;

    // Getting the player collection
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: username});

    // If the player exists in the players collection
    if(player){
        // Checking if the player has the stock in his portfolio
        const stockIndex = player.portfolio.findIndex(stock => stock.symbol === stockSymbol);
        if(stockIndex !== -1){
            // If the player has enough stocks to sell
            if(player.portfolio[stockIndex].quantity >= quantity){
                // Getting the stock from the player's portfolio
                const stock = player.portfolio[stockIndex];
                // Updating the player's funding
                player.funding += stock.currentPrice * quantity;
                // Updating the player's total value
                player.totalValue -= stock.currentPrice * quantity;
                // Updating the player's portfolio
                player.portfolio[stockIndex].quantity -= quantity;
                // Updating the player's portfolio
                await playerCollection.updateOne({username: username}, {$set: {portfolio: player.portfolio}});
                // Updating the player's funding
                await playerCollection.updateOne({username: username}, {$set: {funding: player.funding}});
                // Updating the player's total value
                await playerCollection.updateOne({username: username}, {$set: {totalValue: player.totalValue}});
                return res.status(200).send(`Successfully sold ${quantity} stocks of ${stockSymbol} for ${username}`);
            }
            else{
                return res.status(401).send(`Player ${username} does not have enough stocks of ${stockSymbol} to sell!`);
            }
        }
        else{
            return res.status(404).send(`Player ${username} does not have any stocks of ${stockSymbol} to sell!`);
        }
    }
    else{
        return res.status(404).send(`Player with the username ${username} does not exist!`);
    }


}

// This function is used to add/request other players as friends
export async function addFriendPOST(req, res){
    
    const friendUsername = req.params.friend;
    const currPlayer = req.params.username;
    // const currPlayer = req.session.username;
    
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: friendUsername});

    if(player){
        // If the friend is already added to the friends list
        if(player.friendList.includes(currPlayer)){
            return res.status(409).send(`Player with the username ${friendUsername} is already a friend!`);
        }

        if(player.requestList.includes(currPlayer)){
            return res.status(409).send(`You've already sent ${friendUsername} a friend request!`);
        }

        // Adding the other players username to the sent list
        await playerCollection.updateOne({username: currPlayer}, { $addToSet: { sendList: friendUsername } });

        // Adding the current players username to the requested player's reqest list
        await playerCollection.updateOne({username: friendUsername}, { $addToSet: { requestList: currPlayer } });

        return res.status(200).send(`Successfully sent a friend request sent to ${friendUsername}`);
    }
    else{
        return res.status(404).send(`Player with the username ${friendUsername} does not exist!`);
    }

}

// This function is used to accept friend requests
export async function acceptFriendPOST(req, res){

    const friendUsername = req.params.friend;
    const currPlayer = req.params.username;

    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: friendUsername});

    if(player){
        // If the friend is already added to the friends list
        if(player.friendList.includes(currPlayer)){
            return res.status(409).send(`Player with the username ${friendUsername} is already a friend!`);
        }

        // Adding the other players username to the sent list
        await playerCollection.updateOne({username: currPlayer}, { $addToSet: { friendList: friendUsername } });
        // Remove from the requested player from the current player's request list
        await playerCollection.updateOne({username: currPlayer}, { $pull: { requestList: friendUsername } });

        // Adding the current players username to the requested player's reqest list
        await playerCollection.updateOne({username: friendUsername}, { $addToSet: { friendList: currPlayer } });
        // Remove from the sent list of the reqested player
        await playerCollection.updateOne({username: friendUsername}, { $pull: { sendList: currPlayer } });

        return res.status(200).send(`Successfully added ${friendUsername} as a friend!`);
    }
    else{
        return res.status(404).send(`Player with the username ${friendUsername} does not exist!`);
    }

}


// This function is used to retrieve the user's friends page
export async function userFriendsGET(req, res){

    const username = req.session.username;

    const playerCollection = await getPlayersCollection();

    const player = await playerCollection.findOne({username: username});

    if(player){

        const userData = {
            username: username,
            player: player
        };

        // sending the response to the user
        return res.status(200).render(htmlFiles + '/friends', {userData: userData});
        // // return res.status(200).sendFile(htmlFiles + '/dashboard.html');


    }
    else{
        return res.status(404).send(`Player ${username} does not exist!`);
    }
    

}