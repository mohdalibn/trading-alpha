
// Importing the required dependencies for this module
import express from 'express';
import { DBConnect, DBCloseConn } from './utils/database.mjs';
import { loginGET, loginPOST, registerGET, registerPOST, logoutGET } from './controllers/auth.mjs';  
import { dashboardPageGET, buyPageGET, sellPageGET, friendsPageGET, chatPageGET, userDashboardInfoGET, userPortfolioGET, stockInfoGET, friendsInfoGET} from './controllers/info.mjs'; 
import {buyStockPOST, sellStockPOST, addFriendPOST, acceptFriendPOST, userFriendsGET} from './controllers/player.mjs';
import {adminPageGET, gamesListGET, createGamePOST, addPlayerToGamePOST, startGamePOST, declareWinnerPOST} from './controllers/admin.mjs';
import { updateStocksInfo } from './utils/stockapi.mjs';
import session from 'express-session';
import {Server} from 'socket.io';
import cron from 'node-cron';


// Initializing the web app and setting the port
const app = express();
const port = 3100; // Selected the Port number the same as the course number


app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 


// Creating a random string using the crypto module
import crypto from 'crypto';

const secretKey = crypto.randomBytes(32).toString('hex');

// Using Sessions to do user session management
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
}))


// Using a middleware to check if the user is authenticated or not using sessions
function authUser(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } 
    else{
        // redirecting the user to the login page if the user is not authenticated
        res.status(401).redirect('/login');
    }
}
  

// Using static contents like html pages
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export const htmlFiles = __dirname + '/views';
app.use(express.static(htmlFiles));


// Cron Job to calls the utility function to update the stocks.txt file with the updated stock info/price
// Executes every 10 minutes
var task = cron.schedule('*/10 * * * *', () =>  {
    updateStocksInfo();
    var currDate = new Date();
    console.log('Stock data updated by cron job on ' + currDate);
});
  

var server; // Variable to store the server object

async function startServer(){

    try{

        // Connecting to the MongDB database
        await DBConnect();

        // ALL ADMIN AND PLAYER ROUTES ARE used in the adminRouter and playerRouter above

        // Routes HTTP API Calls for Login and Registration

        // GENERAL ROUTES
        app.get('/', (req, res) => {
            res.redirect('/login');
        });

        app.get('/login', loginGET); // GET request to redirect the user to the login page

        app.post('/login', loginPOST); // POST request for when a user is trying to login

        app.get('/register', registerGET); // GET request to redirect the user to the registration page

        app.post('/register', registerPOST); // POST request for when a user is trying to register

        app.get('/stockinfo/:stockticker', authUser, stockInfoGET); // GET request to get information about a specific stock


        // ADMIN SPECIFIC ROUTES

        app.get('/admin', authUser, adminPageGET); // GET request to display the admin page

        app.get('/:admin/getgames', authUser, gamesListGET); // GET request for when an admin is trying to get all the games

        app.post('/:admin/creategame/:gameID', authUser, createGamePOST); // POST request for when an admin is trying to create a game 

        app.post('/:admin/addplayer/:gameid/:username', authUser, addPlayerToGamePOST); // POST request for when an admin is trying to add a user to a game

        app.post('/:admin/startgame/:gameid', authUser, startGamePOST); // POST request for when an admin is trying to start a game

        app.get('/:admin/getwinner/:gameid', authUser, declareWinnerPOST) // GET request for when an admin is trying to end a game and get the winner

        // PLAYER SPECIFIC ROUTES

        app.get('/dashboard', authUser, dashboardPageGET); // GET request to display the dashboard page

        app.get('/dashboardinfo', authUser, userDashboardInfoGET); // GET request for the specific user's dashboard info

        app.get('/portfolio', authUser, userPortfolioGET); // GET request for the specific user's portfolio

        app.get('/buy', authUser, buyPageGET); // GET request for the specific user's buy stock page
        
        app.get('/sell', authUser, sellPageGET); // GET request for the specific user's sell stock page

        app.get('.friends', authUser, friendsPageGET); // GET request for the specific user's friends page

        app.get('/friendsinfo', authUser, friendsInfoGET); // GET request for the specific user's friend's page information

        app.get('/chat', authUser, chatPageGET); // GET request for getting chat page

        app.post('/buy/:username/:stockticker/:quantity', authUser, buyStockPOST); // POST request for the specific user to buy a certain quantity of stocks 

        app.post('/sell/:username/:stockticker/:quantity', authUser, sellStockPOST); // POST request for the specific user to sell a certain quantity of stocks
        
        // Additional Features

        app.get('/logout', authUser, logoutGET); // GET request for the specific user to logout

        app.get('/friends', authUser, friendsPageGET); // GET request for the specific user's dashboard

        app.post('/:username/addfriend/:friend', authUser, addFriendPOST); // POST request for the specific user to add a friend

        app.post('/:username/acceptfriend/:friend', authUser, acceptFriendPOST); // POST request for the specific user to accept a request of a friend

        // Listening for incoming requests on the selected port
        server = app.listen(port, () => {
            console.log(`The App is Listening on port ${port} at http://localhost:${port}`);

        var io = new Server(server);
        
        io.on('connection', (socket) => {
            console.log("User just connected");    
            // Send msg to all clients
            socket.on('chat', (data) => {
                io.sockets.emit('chat', data); 
            });
            // Send msg to all others connected
            socket.on('typing', (data) => {
                socket.broadcast.emit('typing', data);
            });
        });

        });

    }
    catch (err){
        console.log(err);
        throw err;
    }

}

startServer(); // Starting the Server/App


// Function to close the database connection when an interrupt occurs
// function interruptCloseDBConnection(){
//     console.log('SIGINT signal received! Closing the connection to the database...');
//     server.close(async function(){
//       let closeMsg = await DBCloseConn();
//       console.log(closeMsg);
//     });
// }

// // Closes the Database connection on Signal interupts
// process.on('SIGINT', interruptCloseDBConnection());