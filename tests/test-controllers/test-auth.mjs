

import assert from 'assert'
import supertest from 'supertest'
import { DBCloseConn, deletePlayer, DBConnect } from '../../utils/database.mjs'

var request = supertest("http://localhost:3100")

// Initializing the database connection before running the tests
before(async () => {   
    await DBConnect();
})

// Deleting test users and closing the database connection after all the test cases have been executed
after(async () => {  

    // Deleting the users created for testing /register from the database
    await deletePlayer("test_user3");
    await deletePlayer("test_user4");

    // Closing Database Connection
    await DBCloseConn();
})

// Test case for the POST /login endpoint
describe('POST /login - Tests the User Login Functionality', () => {

    var tests = [{ name: 'attempt1: No such user in the player collection of db 1', args: ["non_existent_user1","test_fail1"], expected: 401},
                 { name: 'attempt2: No such user in the player collection of db 2', args: ["non_existent_user2","test_fail2"], expected: 401},
                 { name: 'attempt3: Admin user successful login', args: ["adminUsr","adminPass"], expected: 200},
                 { name: 'attempt4: Existing user successful login 1', args: ["COMP3100","comp3100pass"], expected: 200},
                 { name: 'attempt5: Existing user succesful login 2', args: ["COMP2005","comp2005pass"], expected: 200},
                ];

    tests.forEach(test => {
        it("POST /login - ".concat(test.name), async () => {
            let response = await request.post('/login')
               .send({username: test.args[0], password: test.args[1]})
               .set('Content-Type', 'application/json'); 
            assert.equal(response.status, test.expected)
        })
    })

})


// Test case for the POST /register endpoint
describe('POST /register - Tests the User Registration Functionality', () => {

    var tests = [{ name: 'attempt1: New user succesful registration 1', args: ["test_user3","test_fail3"], expected: 200},
                 { name: 'attempt2: New user succesful registration 2', args: ["test_user4","test_fail4"], expected: 200},
                 { name: 'attempt3: Admin user already exists in the database', args: ["adminUsr","adminPass"], expected: 409},
                 { name: 'attempt4: Username already exist 1', args: ["COMP3100","test_pass1"], expected: 409},
                 { name: 'attempt5: Username already exist 2', args: ["COMP2005","test_pass2"], expected: 409},
                 ];

    tests.forEach(test => {
        it("POST /register - ".concat(test.name), async () => {
            let response = await request.post('/register')
               .send({username: test.args[0], password: test.args[1]})
            assert.equal(response.status, test.expected)
        })
    })
})

