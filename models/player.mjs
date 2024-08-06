
// Importing dependencies for this module
import {getPlayersCollection} from '../utils/database.mjs';


export class Player{
    constructor(username, password){
        this.username = username; // This is the username of the player
        this.password = password;  // This is the password of the player
        this. portfolio = []; // This is the portfolio of the player
        this.funding = 0; // This is the initial cash of the player
        this.totalValue = 0; // This is the total value of the player's portfolio
        this.userStatus = "player"; // This is the user status of the player
        this.gameID = null;   // This is the gameID of the game that the player is registered for
        this.friendList = []; // This is the friend list of the player
        this.sendList = []; // This is the list of players that this player has sent requests to
        this.requestList = []; // This is the request list of the player
    }


    // Class method to retrieve all the player objects from the database
    static async getAllPlayers(){

        const playerCollection = await getPlayersCollection();
        const allPlayers = await playerCollection.find({}).toArray();
        return allPlayers;

    }

    // Class method to retrieve all the usernames from the database
    static async getAllUsernames(){

        const playerCollection = await getPlayersCollection();
        const allPlayers = await playerCollection.find({}).toArray();
        return allPlayers.map(player => player.username);
        
    }

}