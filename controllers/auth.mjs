
// Importing dependencies for this module
import {getPlayersCollection} from '../utils/database.mjs';
import {Player} from '../models/player.mjs';
import { htmlFiles } from '../app.mjs';


// This function is used to redirect the user to the login page
export function loginGET(req, res){
    
    // checking if the html file exists
    if(!(htmlFiles + '/login.html')) {
      return res.status(404).send('The file login.html file is not found!');
    }
    // sending the response to the user
    return res.status(200).sendFile(htmlFiles + '/login.html');

}


// This function is used to authenticate a player's credentials
export async function loginPOST(req, res){

    // Getting the project player database object
    const playerCollection = await getPlayersCollection(); // Getting the Players Collection from DB

    // Getting the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Getting the player object from the database
    const player = await playerCollection.findOne({username: username, password: password});

    // Checking whether the player object is null
    if(!player){
        // Sending an error message to the user
        return res.status(401).send('User Does not exists! Invalid username or password!');
    }

    // Storing the player username in the session
    req.session.username = username;

    // Sending a success message to the user
    return res.status(200).send('You have been successfully logged in!');

    // PART 3 REMINDER: Will redirect user to the dashboard after successful login
    // return res.redirect('/dashboard');

}


// This function is used to redirect the user to the registration page
export function registerGET(req, res){

    // checking if the html file exists
    if(!(htmlFiles + '/register.html')) {
        return res.status(404).send('The file register.html file is not found!');
    }
    // sending the response to the user
    return res.status(200).sendFile(htmlFiles + '/register.html');

}


// This function is used to register a new player
export async function registerPOST(req, res){

    // Getting the project player database object
    const playerCollection = await getPlayersCollection(); // Getting the Players Collection from DB

    // Getting the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Checking whether the username already exist in the database
    const player = await playerCollection.findOne({username: username});
    // Throwing an error if the username already exist
    if(player){
        return res.status(409).send('The username you chose already exist!'); // Notifying the user that the username already exist
    }
    
    // Adding the new user to the database
    const newPlayer = new Player(username, password);

    // Inserting the new user to the database
    await playerCollection.insertOne(newPlayer);

    // Storing the player username in the session
    req.session.username = username;

    // Sending a success message to the user
    return res.status(200).send('You have been successfully registered!');

}


// This function is used to logout the user
export async function logoutGET(req, res){

    // Delete the user session and redirect them to the login page
    req.session.destroy(() => {

        return res.redirect('/login');

        // setTimeout(() => {
        //     return res.redirect('/login');
        // }, 1500);

    });

}
