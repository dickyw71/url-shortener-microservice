/**
 * Tests for the Url Shortener microservice app
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the /GET shortened URL route
 */
describe('/GET shortened url, ', () => {
    it('it should redirect me to my original link.', (done) => {
        chai.request(server)
            .get('/1691')
            .end((err, res) => {
                res.should.have.status(200); 
            done();         
            })
    })
})

/**
 * Test the /GET new shortened URL for original URL route
 */

describe('/GET new shortened URL', () => {
    it('it should return a shortened URL in the JSON response.', (done) => {
        chai.request(server)
            .get('/new/https://www.freecodecamp.com')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('original_url').eql('https://www.freecodecamp.com');
                res.body.should.have.property('short_url');
            done();
            })
    })

    /**
     * Test the /GET new shortened URL for invalid original URL
     */
    it('it should return an error in the JSON response when URL is invalid', (done) => {
        chai.request(server)
            .get('/new/dfgt://ww.dd')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('original_url').eql('dfgt://ww.dd');
                res.body.should.have.property('error').eql('400 Bad Request');   
            done();                
            })
    })
})

