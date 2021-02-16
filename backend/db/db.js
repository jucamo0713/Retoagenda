const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = "mongodb+srv://mongo:" + process.env.PASSWORD + "@cluster0.2fkmp.mongodb.net/<dbname>?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



/*
const url = `mongodb+srv://mongo:${process.env.PASSWORD}@cluster0.2fkmp.mongodb.net/agenda`;

const client = new mongo.MongoClient(url,{useUnifiedTopology: true, });
client.connect().then((res)=>{
    console.log('Succesfull connection with db agenda')
}).catch((err)=>{console.log(err)});
let db=client.db('agenda');*/

module.exports = (async () => {
    await client.connect();
    return client.db("agenda");
});