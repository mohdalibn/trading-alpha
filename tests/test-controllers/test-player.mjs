
import assert from 'assert'
import supertest from 'supertest'
import { DBCloseConn, DBConnect, removeFriend } from '../../utils/database.mjs'
import { deletePlayer, deletePortfolioItem } from '../../utils/database.mjs'

var request = supertest("http://localhost:3100")

// Initializing the database connection before running the tests
before(async () => {   
    await DBConnect();
})

// Closing the database connection after all the test cases have been executed
after(async () => {  

    // Deleting portfolio items added/used for testing
    deletePortfolioItem("bstest2", "UBER");

    // Removing the friends made for testing
    await removeFriend("aftest3", "aftest4");
    await removeFriend("aftest4", "aftest3");

    await DBCloseConn();
})


// Tests the POST /buy/:username/:stockticker/:quantity endpoint
describe('POST /buy/:username/:stockticker/:quantity - Tests the Stock Buying Functionality', () => {

    var tests = [{ name: 'Attempt1 - The user does not have enough balance to buy the stocks', args: ["bstest1", "JNJ", 100], expected: 401},
    { name: 'Attempt2 - The user has enough balance to buy the stocks', args: ["bstest2", "UBER", 100], expected: 200},
    { name: 'Attempt3 - The user does not exist', args: ["non_exist", "PFE", 22], expected: 404},
    { name: 'Attempt4 - The stock does not exist', args: ["testUser4", "COMP3100", 50], expected: 404}
    ];

    tests.forEach( test => {
        it( test.name, async () => {
            const response = await request.post('/buy/' + test.args[0] + '/' + test.args[1] + '/' + test.args[2]);
            assert.equal(response.status, test.expected);
        })
    })
})


// Tests the POST /:username/sell/:stockticker/:quantity endpoint
describe('POST /:username/sell/:stockticker/:quantity - Tests the Stock Selling Functionality', () => {

    var tests = [{ name: 'Attempt1 - The user does not have enough stocks to sell', args: ["SomeStocks", "UBER", 40], expected: 401},
    { name: 'Attempt2 - The user has enough stocks to sell', args: ["bstest2", "UBER", 100], expected: 200},
    { name: 'Attempt3 - The user does not exist', args: ["non_exist", "PFE", 100], expected: 404},
    { name: 'Attempt4 - The stock does not exist in the player portfolio', args: ["COMP3100", "JNJ", 100], expected: 404}
    ];

    tests.forEach( test => {
        it( test.name, async () => {
            const response = await request.post('/sell/' + test.args[0] + '/' + test.args[1] + '/' + test.args[2]);
            assert.equal(response.status, test.expected);
        })
    })
})


// Tests the POST /:username/addfriend/:friend endpoint 
describe('POST /:username/addfriend/:friend - Tests the Friend Adding Functionality', () => {

    var tests = [{ name: 'Attempt1 - The friend is already added to the friends list', args: ["aftest1", "aftest2"], expected: 409},
    { name: 'Attempt2 - The friend is not already added to the friends list', args: ["aftest3","aftest4"], expected: 200},
    { name: 'Attempt3: The friend does not exist', args: ["aftest5", "non_exist_user"], expected: 404},
    ];

    tests.forEach( test => {
        it( test.name, async () => {
            const response = await request.post('/' + test.args[0] + '/addfriend/' + test.args[1]);
            assert.equal(response.status, test.expected);
        })
    })
})


// Tests the POST /:username/acceptfriend/:friend endpoint
describe('POST /:username/acceptfriend/:friend - Tests the Friend Accepting Functionality', () => {

    var tests = [{name: 'Attempt1 - The friend is already added to the friends list', args: ["aftest2", "aftest1"], expected: 409}, 
        {name: 'Attempt2 - The friend is not already added to the friends list', args: ["aftest4","aftest3"], expected: 200}, 
        {name: 'Attempt3: The friend does not exist', args: ["aftest5", "non_exist_user"], expected: 404}
    ];

    tests.forEach( test => {
        it( test.name, async () => {
            const response = await request.post('/' + test.args[0] + '/acceptfriend/' + test.args[1]);
            assert.equal(response.status, test.expected);
        })
    })
})


