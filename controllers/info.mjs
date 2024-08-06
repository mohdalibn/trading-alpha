
// Importing dependencies for this module
import { htmlFiles } from '../app.mjs';
import {getPlayersCollection, isAdmin} from '../utils/database.mjs';
import { getStockInfo } from '../utils/stockapi.mjs';
import { adminPageGET } from './admin.mjs';

// This function is used to display the dashboard page
export async function dashboardPageGET(req, res){

    // checking if the user is an admin
    const username = req.session.username;
    const adminStatus = await isAdmin(username);

    if(adminStatus){
        return res.redirect('/admin');
    
    }

    // checking if the html file exists
    if(!(htmlFiles + '/dashboard.html')) {

        return res.status(404).send('The file dashboard.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/dashboard.html');

}

// This function is used to display the buy page
export async function buyPageGET(req, res){

    // checking if the html file exists
    if(!(htmlFiles + '/buy.html')) {

        return res.status(404).send('The file buy.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/buy.html');

}


// This function is used to display the sell page
export async function sellPageGET(req, res){

    // checking if the html file exists
    if(!(htmlFiles + '/sell.html')) {

        return res.status(404).send('The file sell.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/sell.html');

}


// This function is used to display the friends page
export async function friendsPageGET(req, res){

    // checking if the html file exists
    if(!(htmlFiles + '/friends.html')) {

        return res.status(404).send('The file friends.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/friends.html');

}


// This function is used to display the chat page
export async function chatPageGET(req, res){

    // checking if the html file exists
    if(!(htmlFiles + '/chat.html')) {

        return res.status(404).send('The file chat.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/chat.html');

}


// This function is used to get the users specifc dashboard info
export async function userDashboardInfoGET(req, res){
    
    const username = req.session.username;

    const playerCollection = await getPlayersCollection();

    const player = await playerCollection.findOne({username: username});

    if(player){

        return res.status(200).json(player);

    }
    else{
        return res.status(404).send(`Player ${username} does not exist!`);
    }
    
}


// This function is used to retrieve the user's portfolio for a game
export async function userPortfolioGET(req, res){

    const username = req.session.username;

    const playerCollection = await getPlayersCollection();

    const player = await playerCollection.findOne({username: username});

    if(player){

        if(player.portfolio.length === 0){

            const adminStatus = await isAdmin(username);
            if (adminStatus){
                return res.status(401).send(`Player ${username} is an admin! Admins don't have portfolios!`);
            }

            res.setHeader('Content-Type', 'text/plain');

            return res.status(200).send(`Player ${username} currently has no stocks in his portfolio!`);
        }

        const portfolioInfo = {
            "portfolio": player.portfolio,
            "cash remaining": player.funding,
            "total portfolio value": player.totalValue
        }

        res.setHeader('Content-Type', 'application/json');

        return res.status(200).json(JSON.stringify(portfolioInfo));
    }
    else{
        return res.status(404).send(`Player ${username} does not exist!`);
    }
    

}


// This function is used to get current information of the stock requested
export async function stockInfoGET(req, res){

    const ticker = req.params.stockticker;
 
    var requestStockInfo = await getStockInfo(ticker, true);

    if(!requestStockInfo){
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(`Stock with ticker ${ticker} not found`);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(JSON.stringify(requestStockInfo));

}


// This function is used to retrieve the friends page info for a specific player
export async function friendsInfoGET(req, res){

    const username = req.session.username;

    const playerCollection = await getPlayersCollection();

    const player = await playerCollection.findOne({username: username});

    if(player){
        // get the friendList and requestList of the player
        const friendList = player.friendList;
        const requestList = player.requestList;

        res.status(200).json({
            "friendList": friendList,
            "requestList": requestList
        });

    }

}