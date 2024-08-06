
// Importing dependencies for this module
import {getGamesCollection, getPlayersCollection} from '../utils/database.mjs';


export class Game{

    constructor(gameID){
        this.gameID = gameID; // This is the gameID for the game instance
        this.gameStatus = "inactive"; // This is the status of the game
        this.startdate = new Date(); // This is the start date of the game
        this.enddate = null; // This is the end date of the game
        this.playerList = []; // This is an array to keep track of all the players in the game
        this.bestPlayer = null; // This is the best player in the game

    }

    // Function to get the gameID of the instance
    getGameID(){
        return this.gameID;
    }

    // Function to start a game and set the time
    static async startGame(gameID){

        // Get the game from the games database
        const gamesCollection = await getGamesCollection();
        const currGame = await gamesCollection.findOne({gameID: gameID});

        // Checks if the game is inactive and starts the game
        if(currGame.gameStatus === "inactive"){
            currGame.startdate = new Date();
            currGame.gameStatus = "active"; 
        }
        else{
            console.log("Game is already active!");
        }
    }

    // Function to add a player to the game
    static async addPlayerToGame(username, gameID){

        // Get the game from the games database
        const gamesCollection = await getGamesCollection();
        const currGame = await gamesCollection.findOne({gameID: gameID});

        // Checks if the game is inactive and starts the game
        if(currGame.gameStatus === "inactive"){
            currGame.startGame();
        }

        if(currGame){
            const updateList = await gamesCollection.updateOne({gameID: this.gameID}, { $addToSet: { playerList: username } });
            if(updateList.modifiedCount === 1){
            console.log(`Player ${username} successfully added to the game ${gameID}`);
            }
            else{
                console.log(`Player ${username} already exists in the game ${gameID}!`);
            }
        }
        
    }

    static async removePlayerFromGame(username, gameID){

        const gamesCollection = await getGamesCollection();
        const currGame = await gamesCollection.findOne({gameID: gameID});

        if(currGame){
            const updateList = await gamesCollection.updateOne({gameID: this.gameID},{ $pull: { playerList: username } });

            if(updateList.modifiedCount === 1){
                console.log(`Player ${username} successfully removed from game ${gameID}`);
            }
            else{
                console.log(`Player ${username} does not exist in game ${gameID}!`);
            }
        }

    }



    // This function returns all the gameIDs from the database
    static async getAllGamesIDs(){
        const gamesCollection = await getGamesCollection();
        const allGameIDs = await gamesCollection.find({}, { projection: {_id: 0, gameID: 1} }).toArray();
        return allGameIDs;
    }

    // This functions returns the winner of a concluded game
    static async getBestPlayer(gameID){

        const gamesCollection = await getGamesCollection();

        const bestPlayer = await gamesCollection.findOne({gameID: gameID});

        return bestPlayer.bestPlayer;

    }


    // Function to end a game
    static async endGame(gameID){

        const gamesCollection = await getGamesCollection();
        const currGame = await gamesCollection.findOne({gameID: gameID});

        // Checking if the game has already ended
        if(currGame.gameStatus === "end"){
            console.log("Game is already ended!");
            return Game.getBestPlayer(gameID);
        }
        else if (currGame.gameStatus === "inactive"){
            console.log("You cant end a game is already inactive!");
            return -1;
        }

        currGame.gameStatus = "finished"; // Setting the game status to end

        const playerList = currGame.playerList;
        const totalValue = [];
        for(let i = 0; i < playerList.length; i++){
            const player = await getPlayersCollection().findOne({username: playerList[i]});
            totalValue.push(player.totalValue);
        }

        // Finding the best player or players
        let bestPlayerList = [];
        let bestValue = 0;
        for(let i = 0; i < totalValue.length; i++){
            if(totalValue[i] >= bestValue){
                bestValue = totalValue[i];
                bestPlayerList.push(playerList[i]);
            }
        }

        //Updating the best players and winner list in the games collection of the database
        await gamesCollection.updateOne({gameID: gameID}, { $set: {bestPlayer: bestPlayerList}});

        return bestPlayerList;

    }
    

}