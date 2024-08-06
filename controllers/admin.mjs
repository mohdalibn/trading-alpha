
// Importing dependencies for this module
import {getGamesCollection, getPlayersCollection, isAdmin} from '../utils/database.mjs';
import {Game} from '../models/game.mjs';
import { htmlFiles } from '../app.mjs';


// This function is used to serve an admin user with the admin page for /admin route
export async function adminPageGET(req, res){

    const username = req.session.username;

    if(!await isAdmin(username)){
        return res.status(401).send(`Player ${username} is not an admin! Only admins can access further pages!`);
    }

    if(!(htmlFiles + '/admin.html')) {

        return res.status(404).send('The file admin.html file is not found!');

    }

    return res.status(200).sendFile(htmlFiles + '/admin.html');
}


export async function gamesListGET(req, res){
    
    const username = req.params.admin;

    if(!await isAdmin(username)){
        return res.status(401).send(`Player ${username} is not an admin! Only admins can access further pages!`);
    }

    const gamesCollection = await getGamesCollection();
    // Get all the gameID and gameStatus by filtering from the games collection
    const gamesList = await gamesCollection.find({}, {projection: {gameID: 1, gameStatus: 1}}).toArray();

    if(gamesList.length === 0){
        return res.status(404).send('No games found!');
    }

    return res.status(200).json(gamesList);

}

// export async function adminAuthPOST(req, res){

//     const playerCollection = await getPlayersCollection(); 

//     const username = req.body.username;
//     const password = req.body.password;

//     const player = await playerCollection.findOne({username: username, password: password});

//     if(!player){
//         return res.status(401).send('User Does not exists! Invalid username or password!');
//     }

//     if(!await isAdmin(username)){
//         return res.status(401).send(`Player ${username} is not an admin! Only admins can access further pages!`);
//     }

//     req.session.username = username;

//     return res.status(200).send('You have been successfully logged in!');

// }


// This function is used to create a new game and store it in the database
export async function createGamePOST(req, res){

    const username = req.params.admin;
    const gameID = req.params.gameID;

    const adminStatus = await isAdmin(username); // Stores the admin status of the player
    if (!adminStatus){ 
        return res.status(401).send(`Player ${username} is not an admin! Only admins can create games!`);
    }

    const game = new Game(gameID); // Creating a new game instance
    const gamesCollection = await getGamesCollection(); // Connecting to games collection 
    const addition = await gamesCollection.insertOne(game); // Adding the new game instance to the database

    if (addition && addition.acknowledged){
        return res.status(200).send(`Game ${game.getGameID()} has been successfully created!`);
    }
    else{
        return res.status(404).send(`Error saving Game ${game.getGameID()} to the Games Collection!`);
    }
}


// This function is used to start a created game
export async function startGamePOST(req, res){
    
    const gameID = req.params.gameID;
    const username = req.params.username;

    const adminStatus = await isAdmin(username); 
    if (!adminStatus){
        return res.status(401).send(`Player ${username} is not an admin! Only admins can start games!`);
    }
    const gamesCollection = await getGamesCollection(); // Connecting to games collection
    const currGame = await gamesCollection.findOne({gameID: gameID}); // Getting the game from the database
    
    if(currGame.gameStatus === "inactive"){
        await Game.startGame(gameID);
        return res.status(200).send(`Game ${gameID} has been successfully started!`);
    }
    else if (currGame.gameStatus === "finished"){
        return res.status(404).send(`Game ${gameID} has already ended!`);
    }
    else if (currGame.gameStatus === "active"){
        return res.status(409).send(`Game ${gameID} is already active!`);
    }
    else{
        return res.status(404).send(`Game ${gameID} does not exist!`);
    }
    
}


// This function is used to add a player to a game by the admin
export async function addPlayerToGamePOST(req, res){

    const admin = req.params.admin;
    const gameID = req.params.gameID;
    const username = req.params.username;

    const adminStatus = await isAdmin(admin); 
    if (!adminStatus){
        return res.status(401).send(`Player ${username} is not an admin! Only admins can add players to games!`);
    }

    const gamesCollection = await getGamesCollection(); // Connecting to games collection 
    const currGame = await gamesCollection.findOne({gameID: gameID}); // Getting the game from the database

    // if(currGame.gameStatus === "inactive"){
    //     await Game.startGame(gameID);
    // }

    const addUsernameToList = await gamesCollection.updateOne({gameID: gameID}, { $addToSet: { playerList: username } });

    // Giving the player an intial amount of cash to start with
    const initialFunding = 10000;
    const playerCollection = await getPlayersCollection();
    const addFunding = await playerCollection.updateOne({username: username}, {$set: {funding: initialFunding}});

    if(addUsernameToList.modifiedCount === 1 && addFunding.modifiedCount === 1){
        return res.status(200).send(`Player ${username} successfully added to the game ${gameID}`);
    }
    else{
        return res.status(404).send(`Player ${username} already exists in the game ${gameID}!`);
    }
}

// This function is used to declare the winner of a game
export async function declareWinnerPOST(req, res){

    // Check if the game is still active
    const gameID = req.params.gameID;
    const username = req.params.username;

    const adminStatus = await isAdmin(username);
    if (!adminStatus){
        return res.status(401).send(`Player ${username} is not an admin! Only admins can declare winners!`);
    }

    const winnerList = Game.endGame(gameID);

    if(winnerList === -1){
        return res.status(404).send(`Game ${gameID} is inactive!`);
    }

    return res.status(200).json(winnerList);

}