var should = require('should');
var request = require('supertest');
var config = require('./config');

describe('Smoke', function () {
    var url = config.serverUrl;

    before(function (done) {
        done();
    });

    describe('Health', function () {
        it('should get / 200', function (done) {
            request(url)
                .get('/')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    should(res).have.property('status', 200);
                    done();
                });
        });
        it('should get health ok', function (done) {
            request(url)
                .get('/health')
                .send()
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    should(res).have.property('status', 200);
                    should(res.body).have.property('ok', true);
                    done();
                });
        });
    });
});