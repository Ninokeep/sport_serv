var should = require('should')
var assert = require('assert')
var request = require('supertest')
var app = require('../app')

describe('Kine', function(){
    describe("POST inscription d'un kine", function(){
        it('doit créer un kine object', function(done){
            var kine = {
                'id': 1,
                'nom':"lemance",
                'prenom': 'yvik',
                'email': 'yvik@gmail.com',
                'password': '12345678'
                
            }

            request(app)
            .post('/kine/register')
            .send(kine)
            .expect(201,done)
        })
    });
    describe("GET tous les users d'un kiné", function(){
        it('doit créer un objet kine avec l id du kiné', function(done){
            var kine = {
                'id_kine' : 1
            }
            request(app)
            .post('/kine/users')
            .send(kine)
            .expect(201)
            .end(function(err,res){
                print(err)
                print(res)
                done();
            })
        })
    })


})