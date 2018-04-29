const express = require('express');
const path = require('path');
const app = express();
const mongo = require('mongodb').MongoClient;
const shortid = require('shortid');
const secrets = process.env.DB_USER;
const isUrl = require('is-url');
const dotenv = require('dotenv').config();
let dbUrl = process.env.DB_URL;
const ObjectId = mongo.ObjectID;

app.use('/public',express.static(__dirname + '/public'));

app.get('/',function(request,response){
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/favicon.ico', (req, res) => res.status(204));

mongo.connect(dbUrl,function(err,database){
    const urlDatabase = database.db('url-database');
    const collection = urlDatabase.collection('urlcollection');
    if(err){
        console.log('cant connect to db');
    }
    console.log('connected to db');
    app.get('/new/:urlvalue(*)',function(request,response){
        let longUrl = request.params.urlvalue;
        let urlId = shortid.generate();
        let shortUrl = request.get('host') + '/' + urlId;
        console.log(urlId);
        if(!isUrl(longUrl)){
          response.send('Please enter a valid url');
        }
        else{
          collection.find({"long_url":longUrl}).toArray(function(err,data){
            if(err){
              response.send("cant lookup db");
            }
            if(!data.length){
              collection.insert({
              'long_url':longUrl,
              'short_url': shortUrl,
              'id': urlId
              },function(err,data){
                if(err){
                  console.log('cant insert to db');
                }
                response.json({"long_url": data.ops[0].long_url, "short_url":data.ops[0].short_url});
              })
            }
            else{
              response.json({"long_url":data[0].long_url,"short_url":data[0].short_url});
            }  
        })
      }
    })
  
    app.get('/:urlId',function(request,response){
        let id = request.params.urlId;
        console.log('got the urlid');
        collection.find({'id':id}).toArray(function(err,data){
            if(err){
                response.send("we couldn't find the links ID")
            }
            else {
                let link = data[0].long_url;
                response.redirect(link);
            }
        })
    })
})


app.listen(3000,function(){
  console.log('server working');
})