const express = require('express');
const path = require('path');
const app = express();
const mongo = require('mongodb').MongoClient;
const shortid = require('shortid');
let dbUrl = 'mongodb://localhost:27017/';
const ObjectId = mongo.ObjectID;

app.get('/',function(request,response){
  response.send('what');  
})

mongo.connect(dbUrl,function(err,database){
    const urlDatabase = database.db('urlshortener');
    const collection = urlDatabase.collection('urlcollection');
    if(err){
        console.log('cant connect to db');
    }
    console.log('connected to db');
    app.get('/new/:urlvalue(*)',function(request,response){
        let longUrl = request.params.urlvalue;
        let shortUrl = 'lskdjf';
        let urlId = shortid.generate();
        console.log(urlId);
        collection.insert({
            'long_url':longUrl,
            'short_url': shortUrl,
            'id': urlId
        },function(err,data){
            if(err){
                console.log('cant insert to db');
            }
            response.send(data);
        })
    })
})


app.listen(3000,function(){
  console.log('server working');
})