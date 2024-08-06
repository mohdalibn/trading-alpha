
import assert from 'assert'
import supertest from 'supertest'
import { DBCloseConn, deletePlayer, DBConnect } from '../../utils/database.mjs'

var request = supertest("http://localhost:3100")

// Initializing the database connection before running the tests
before(async () => {   
    await DBConnect();
})

// closing the database connection after all the test cases have been executed
after(async () => {  
    await DBCloseConn();
})

// Test cases for the GET /portfolio/:username endpoint - test success and failures
describe('GET /portfolio/:username - Tests the User Portfolio Functionality', () => {

    var tests = [{ name: 'attempt1: empty porfolio (no stocks owned)', args: ["EmptyPortfolio"], expected: 200},
                 { name: 'attempt2: Player with some stocks in their porfolio', args: ["SomeStocks"], expected: 200},
                 { name: 'attempt3: Admin does not have a portfolio ', args: ["adminUsr"], expected: 401},
                 { name: 'attempt4: The user does not exist in the database', args: ["non_exist_user"], expected: 404},
                ];

    tests.forEach(test => {
        it("GET /portfolio/:username - ".concat(test.name), async () => {
            let response = await request.get('/portfolio/' + test.args[0])
            assert.equal(response.status, test.expected)
        })
    })

})
