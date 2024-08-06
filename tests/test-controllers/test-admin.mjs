
import assert from 'assert'
import supertest from 'supertest'
import { DBCloseConn, deletePlayer, DBConnect, deleteGameFromCollection } from '../../utils/database.mjs'
import { Game } from '../../models/game.mjs'

var request = supertest("http://localhost:3100")

// Initializing the database connection before running the tests
before(async () => {   
    await DBConnect();
})

// Closing the database connection after all the test cases have been executed
after(async () => {  

    await deleteGameFromCollection("test_create_game");

    await Game.removePlayerFromGame("COMP3100", "game_player_add");

    await DBCloseConn();
})


// Tests the POST /:admin/creategame endpoint
describe('POST /:admin/creategame - Tests the Game Creation Functionality', () => {

    var tests = [{ name: 'Attempt1: Admin user tries to create a new game', args: ["adminUsr", "test_create_game"], expected: 200},
    { name: 'Attempt2: Normal user tries to create a game but fails', args: ["COMP3100", "test_create_game"], expected: 401}
    ];

    tests.forEach(test => {
        it("POST /:admin/creategame - ".concat(test.name), async () => {
            let response = await request.post('/' + test.args[0] + '/creategame/' + test.args[1]);
            assert.equal(response.status, test.expected)
        })
    })  
})


// // Tests the POST /:admin/startgame/:gameid endpoint
// describe('POST /:admin/startgame/:gameid - Tests the Game Start Functionality', () => {

//     var tests = [{ name: 'attempt1: Game is inactive and starts successfully', args: ["adminUsr", "1"], expected: 200},
//                  { name: 'attempt2: Game is already active', args: ["adminUsr","2"], expected: 409},
//                  { name: 'attempt3: Game is already finished', args: ["adminUsr", "adminPass", "3"], expected: 404},
//                  { name: 'attempt4: Game does not exist', args: ["adminUsr", "adminPass", "4"], expected: 404}, { name: 'attempt4: Regular tries to start a game but fails', args: ["adminUsr", "adminPass", "4"], expected: 401}
//                  ];

//     tests.forEach(test => {
//         it("POST /:admin/startgame - ".concat(test.name), async () => {
//             let response = await request.post('/' + test.args[0] + '/startgame/' + test.args[1])
//             assert.equal(response.status, test.expected)
//         })
//     })  
// })

// // Tests the GET /:admin/getwinner/:gameid endpoint
// describe('GET /:admin/getwinner/:gameid - Tests the Game Winner Functionality', () => {
//     var tests = [{ name: 'attempt1: Game is inactive and has no winner', args: ["adminUsr", "1"], expected: 404},
//                  { name: 'attempt2: Game has already finished so retreiving winner', args: ["adminUsr","2"], expected: 200},
//                  { name: 'attempt3: Game is active so ended and has a winner', args: ["adminUsr", "adminPass", "3"], expected: 200},
//                  { name: 'attempt4: Game does not exist', args: ["adminUsr", "adminPass", "4"], expected: 404}, { name: 'attempt4: Regular tries to get winner of a game but fails', args: ["adminUsr", "adminPass", "5"], expected: 401}
//                  ];
    
//     tests.forEach(test => {
//         it("POST /:admin/getwinner - ".concat(test.name), async () => {
//             let response = await request.post('/' + test.args[0] + '/getwinner/' + test.args[1])
//             assert.equal(response.status, test.expected)
//         })
//     })
// })


// Tests the POST /:admin/addplayer/:gameid/:username endpoint
describe('POST /:admin/addplayer/:gameid/:username - Tests the Player Addition Functionality', () => {
    var tests = [{ name: 'attempt1: Admin user tries to add a player to a game', args: ["adminUsr", "game_player_add", "COMP3100"], expected: 200},
                 { name: 'attempt2: Game is inactive and player is added successfully', args: ["adminUsr", "2", "COMP2005"], expected: 200},
                 { name: 'attempt3: Game is already finished', args: ["adminUsr", "adminPass", "3", "COMP3100"], expected: 404},
                 { name: 'attempt4: Game does not exist', args: ["adminUsr", "adminPass", "4", "COMP3100"], expected: 404},
                 { name: 'attempt5: Player already exists in the game', args: ["adminUsr", "adminPass", "5", "COMP3100"], expected: 409},
                 { name: 'attempt6: Player does not exist', args: ["adminUsr", "adminPass", "6", "COMP3100"], expected: 404},
                 { name: 'attempt7: Regular user tries to add a player to a game but fails', args: ["COMP2005", "game_player_add", "COMP3100"], expected: 401}
                ];
    tests.forEach(test => {
        it("POST /:admin/addplayer - ".concat(test.name), async () => {
            let response = await request.post('/' + test.args[0] + '/addplayer/' + test.args[1] + '/' + test.args[2])
            assert.equal(response.status, test.expected)
        })
    })
})