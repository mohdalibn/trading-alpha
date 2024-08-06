

// importing mongodb dependencies to connect to the database
import { MongoClient } from 'mongodb';


var dbName = 'mohdalibn-project-db'; // Stores the name of the database
const dbURI ="mongodb://localhost:27017"; // Stores the URI of the database
const client = new MongoClient(dbURI); // Creating a new client to connect to mongodb server
export var database; // Variable to store the database object


// This function is used to connect to the database
export async function DBConnect() {
    try {
        await client.connect(); // Trying to connect to the mongodb server
        database = client.db(dbName); // Getting the required database
        console.log(`You've successfully connected to the ${dbName} database`);  
        return database;
    } 
    catch (err) {
        console.log(err);
        throw err; 
    } 
}

// This function is used to retrieve the database object
export async function getDB() {
    return database;
}

// This function returns the players collection object from the database
export async function getPlayersCollection(){
    return database.collection('players');
}

// This function returns the games collection object from the database
export async function getGamesCollection(){
    return database.collection('games');

}

// This function is used to delete a game from the games' collection
export async function deleteGameFromCollection(gameID){

    const gamesCollection = await getGamesCollection();
    const deletion = await gamesCollection.deleteOne({gameID: gameID});

    if(deletion.deletedCount === 1){
        return `Game ${gameID} has been successfully deleted!`;
    }
    else{
        return `Game ${gameID} does not exist!`;
    }
}


// This function is used to delete an existing player from the players's collection
export async function deletePlayer(username){
    const playerCollection = await getPlayersCollection();
    const deletion = await playerCollection.deleteOne({username: username});   
    if(deletion.deletedCount === 1){
        return `Player ${username} has been successfully deleted!`;
    }
    else{
        return `Player ${username} does not exist!`;
    }
}


// This function checks if the user is an admin
export async function isAdmin(username){
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: username});

    console.log(player);

    if(player === null){
        return false;
    }
    else if(player.userStatus === "admin"){
        return true;
    }
    else{
        return false;
    }
}


// This function is used to remove a friend
export async function removeFriend(username, friendUsername){
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: username});
    if(player){
        const friendIndex = player.friendList.indexOf(friendUsername);
        if(friendIndex !== -1){
            player.friendList.splice(friendIndex, 1);
            await playerCollection.updateOne({username: username}, {$set: {friendList: player.friendList}});
            return `${friendUsername} has been successfully removed from ${username}'s friend list!`;
        }
        else{
            return `Friend ${friendUsername} does not exist!`;
        }
    }
}


// This function is used to remove a portfolio item from a players's portfolio list
export async function deletePortfolioItem(username, portfolioItem){
    const playerCollection = await getPlayersCollection();
    const player = await playerCollection.findOne({username: username});
    if(player){
        const stockIndex = player.portfolio.findIndex(stock => stock.symbol === portfolioItem);
        if(stockIndex !== -1){
            player.portfolio.splice(stockIndex, 1);
            await playerCollection.updateOne({username: username}, {$set: {portfolio: player.portfolio}});
            return `${portfolioItem} has been successfully removed from ${username}'s portfolio!`;
        }
        else{
            return `${portfolioItem} does not exist in ${username}'s portfolio!`;
        }
    }
}

// This function is used to close the existing database connection
export async function DBCloseConn(){
    console.log('Closing the connection to the database.....');
    await client.close();
    return `Connection to ${dbName} closed!`;
};
