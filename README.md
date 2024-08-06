# Mohd Ali Bin Naser's COMP 3100 Project Repository (Winter 2024)

<!-- ---------------------------------------------------------------------------- -->
## Repository Layout Explanation

The Layout of this project repository is such that the codebase is divided into several files which are placed in specific folders in the root directory following the MVC pattern. 

- `controllers/` - This folder contains all the controllers that are used to handle the requests from the players and admin.
- `docs/` - This folder contains basic documentation for the project.
- `models/` - This folder contains all the models that are used to store the data of the application.
- `tests/` - This folder contains all the tests that are used to test the functionality of the application.
- `utils/` - This folder contains all the javascript utility modules that are frequently accessed by other components/modules of the codebase.  
- `views/` - This folder will contain the html files that'll be used to render the pages of the application. *(Implementation in Part 3 of the project )*
- `app.mjs` - This file is responsible for starting the server and listening to the specified port number.

<!-- ---------------------------------------------------------------------------- -->
## JS Files Architecture

For this project, I decided to follow the MVC (Model View Controller) design pattern to layout the different components of my code. The main file of the project is `app.mjs`, which is responsible for starting the server and listening to the port `3100`. The `app.mjs` listens for request from players or the admin and then calls the function in the appropriate controller module, located in the `controllers/` folder, to handle the requests and provide the appropriate response (if necessary). Each controller module is responsible for handling a specific type of request and then calling the appropriate model module to handle the data-related tasks. The model modules are responsible for handling the data-related tasks with help from appropriate utility module to handle the tasks. The utility modules are responsible for handling functionality that are frequently used by other modules.

<!-- ---------------------------------------------------------------------------- -->
## HTTP/API Services

**Request Syntax**: `POST /login`

- **Description**: This is the POST request for a user login

- **Supported Features**: Logging in a user

- **Relevant TestCase**: `tests/test-controllers/test-auth.mjs`


**Request Syntax**: `POST /register`

- **Description**: This is the POST request for a user registration

- **Supported Features**: Registering a new user

- **Relevant TestCase**: `tests/test-controllers/test-auth.mjs`

**Request Syntax**: `POST /<admin>/creategame`

- **Description**: This is the POST request for creating a game by an admin

- **Supported Features**: Creating a new game

- **Relevant TestCase**: `tests/test-controllers/test-auth.mjs`

**Request Syntax**: `POST /<admin>/addplayer/<gameid>/<username>`

- **Description**: This is the POST request for adding/registering a player to a game by an admin

- **Supported Features**: Registering/Adding a player to a game, adding starting cash to the players

- **Relevant TestCase**: `tests/test-controllers/test-admin.mjs`

**Request Syntax**: `POST /<admin>/startgame/<gameid>`

- **Description**: This is the POST request for starting a created game by an admin

- **Supported Features**: Starting a created game using its gameID

- **Relevant TestCase**: `tests/test-controllers/test-admin.mjs`

**Request Syntax**: `GET /<admin>/getwinner/<gameid>`

- **Description**: This is the GET request for getting the winner of a game by an admin

- **Supported Features**: Ending a game and getting the winner of that game

- **Relevant TestCase**: `tests/test-controllers/test-admin.mjs`

**Request Syntax**: `GET /portfolio/<username>`

- **Description**: This is the GET request for getting the stock portfolio of a player

- **Supported Features**: Getting the stock portfolio of a player

- **Relevant TestCase**: `tests/test-controllers/test-info.mjs`

**Request Syntax**: `POST /buy/<username>/<stockticker>/<quantity>`

- **Description**: This is the POST request for buying stocks by a player

- **Supported Features**: Buying player-specified quantity of a stock listed in New York Stock Exchange (NYSE) by a player

- **Relevant TestCase**: `npx mocha tests/test-controllers/test-player.mjs`

**Request Syntax**: `POST /sell/<username>/<stockticker>/<quantity>`

- **Description**: This is the POST request for selling stocks by a player

- **Supported Features**: Selling player-specified quantity of a stock already owned by a player

- **Relevant TestCase**: `npx mocha tests/test-controllers/test-player.mjs`

**Request Syntax**: `POST /<username>/addfriend/<friend>`

- **Description**: This is the POST request for adding/sending request to another player to add them as a friend

- **Supported Features**: Sending request/adding another player as a friend

- **Relevant TestCase**: `npx mocha tests/test-controllers/test-player.mjs`

**Request Syntax**: `POST /<username>/acceptfriend/<friend>`

- **Description**: This is the POST request for accepting a friend request from another player

- **Supported Features**: Accepting another player's friend request

- **Relevant TestCase**: `npx mocha tests/test-controllers/test-player.mjs`
  
<!-- ---------------------------------------------------------------------------- -->
## How To Run And Use The Server

**Importing Database File Into MongoDB**

The following are the mongoimport command to load my datasets into your local MongoDB instance:

`mongoimport -d="mohdalibn-project-db" -c="players" --file players.json --jsonArray`

`mongoimport -d="mohdalibn-project-db" -c="games" --file games.json --jsonArray`

NOTE: The datasets `players.json` and `games.json` are located in the root directory. Make sure you are in the root directory, where the datasets are, when you're using `mongoimport`

**About External Stock API**

For this project, I'm using the external stock API from Financial Modelling Prep (https://financialmodelingprep.com/developer/docs/) to get the stock information including the price of each stock listed in New York Stock Exchange (NYSE).

Due to the frequent API calls to the external API and request limit for free accounts, I'm storing all the stock information in a text file called `stocks.txt` located in the root directory. Due to the limited 250 api calls a day imposed on the free account, the plan is to update the `stocks.txt` file every 10 minutes when the server is running to keep the current prices of stocks updated. So hypothetically, in order for a player to sell the stock at the current price, they have to wait about 10 mins after buying a stock before they can sell it at the current price to see a gain or loss. Otherwise, the stock will be sold at the price when the `stocks.txt` file was last updated which may be the same price as the one when the stock was bought.

The functionality of using the API calls and retrieving information are all done in a utility module called `stockapi.mjs` located in the `utils/` directory.

**Running the Server**

- Clone the repository
- Make sure the node.js is installed on your computer and the package.json file is located in the root directory of the repository.
- **Make sure you're in the root directory of the repository while using an IDE or Terminal.**
- Run `npm install` to install all the dependencies.
- Run `node app.mjs` to start the server.

ADMIN CREDENTIALS
- username: adminUsr
- password: adminPass

**Trying the API Calls**

- Download Postman from https://www.postman.com/downloads/ . 
- Run the server as mentioned above.
- Use the following API calls to test the server.
- **Login (POST)**
  - ``` http://localhost:3100/login ``` , add `{"username": "username", "password": "password"}` in the body of the request.
  
- **Registration (POST)**
  - ``` http://localhost:3100/register ``` , add `{"username": "your_username", "password": "your_password"}` in the body of the request.
  
- **Viewing Portfolio (GET)**
  - ``` http://localhost:3100/portfolio/<username> ``` , add `username` in the param of the url request.

- **Getting A Game Winner (GET)**
  - ``` http://localhost:3100//<admin>/getwinner/<gameid> ``` , add `admin username, gameid` in the params of the url request.

<!-- ---------------------------------------------------------------------------- -->
## How To Use And Run The Unittests

**Locating the Unittests**
All of the Unittests of this project is located in the `tests/` folder of the repository.

**Running the Unittests**

- Before you run any unittest, make sure you run the server following the steps mentioned above. 
- **REMINDER**: MAKE SURE YOU ARE IN THE ROOT DIRECTORY OF THE PROJECT

**Login and Registration Unittests**

- `npx mocha tests/test-controllers/test-auth.mjs` (All Tests Working)

**Portfolio Viewing Unittest**

- `npx mocha tests/test-controllers/test-info.mjs` (All Tests Working)

**Admin Operations Unittest**

- `npx mocha tests/test-controllers/test-admin.mjs` (Not currently functional)

**User/Player Operations Unittest**

- `npx mocha tests/test-controllers/test-player.mjs` (All Tests Working)