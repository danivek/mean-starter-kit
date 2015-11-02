var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on things ressources', function() {

  before(function(donePreparing) {
    // Clean DB
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return donePreparing();
  });

  after(function(donePreparing) {
    // Clean DB
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return donePreparing();
  });

  it('should POST a thing', function(done) {
    var postData = {
      name: 'TEST',
      description: 'Test thing'
    };

    request(app)
      .post('/api/things')
      .send(postData)
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.name.should.equal('TEST');
        res.body.description.should.equal('Test thing');
        done();
      });
  });

  it('should GET a list of things', function(done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a thing', function(done) {
    request(app)
      .get('/api/things')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/things/' + res.body[0]._id)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('TEST');
            res.body.description.should.equal('Test thing');
            done();
          });
      });
  });

  it('should PUT a thing', function(done) {
    var putData = {
      name: 'TEST-UPDATE',
      description: 'Test updated thing'
    };
    request(app)
      .get('/api/things')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/things/' + res.body[0]._id)
          .send(putData)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('TEST-UPDATE');
            res.body.description.should.equal('Test updated thing');
            done();
          });
      });
  });

  it('should GET a 404 error on unknow id', function(done) {
    request(app)
      .get('/api/things/fakeid')
      .expect(404, done());
  });
});
