const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
// React-tour-Manager
// SePITwxureyRnBkn
// database colle: React-Tour-Manager
// tourdestinations
// connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goxkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("React-Tour-Manager");
      const destinations = database.collection("tourdestinations");
      const userDatacollection = client.db("UserInputedInfo").collection("userConfirmInfo");
      const userSelectedSpots = client.db("UserSelected_spots").collection("User_Spots");
      // post service
      app.post("/destinations", async(req,res)=>{
        const spot= req.body;
        const result = await destinations.insertOne(spot)
        res.json(result)

      })
    //   get api
    app.get('/destinations', async(req,res)=>{
        const cursor = destinations.find({});
      
     const places= await cursor.toArray();
     res.send(places)
     



    })
      
    // get single destination
    app.get('/packeges/:id', async(req,res)=>{
      const spotid= req.params.id;
      const query = {_id:ObjectId(spotid)};
      const spot = await destinations.findOne(query);
      res.json(spot)
      
    })
    // set  user data
    app.post('/userdata', async(req,res)=>{
      const newaddress = req.body;
      const result = await  userDatacollection.insertOne(newaddress);
      res.send(result)

      

    })
    // get user data
    app.get('/userdata', async(req,res)=>{
      
      const result = await userDatacollection.findOne({});
      res.send(result)
    })
    // added to db
    app.post('/Spots/userAdded', async(req,res)=>{
      const Userspot = await userSelectedSpots.insertOne(req.body)
      res.json(Userspot)
    })
    // get user selected spots
    app.get('/userSpot/:uid', async(req,res)=>{
      const uid = req.params.uid;
      const query = {uid:uid};
      const result = await userSelectedSpots.find(query).toArray();
      res.json(result)
    })
    // DELETE USER SPOTS
    app.delete('/userdata/remove/:id', async(req,res)=>{
      const id = req.params.id;
      const query= {_id:ObjectId(id)}
      const result = await userSelectedSpots.deleteOne(query);
      res.json(result)
    })
    // manageAll booked spot
    app.get('/allconfirmedspot',async (req,res)=>{
      const curson = userSelectedSpots.find({})
      const result = await curson.toArray();
      
      res.send(result)

    })
    // update user spot status
    app.put('/userdata/remove/:id', async(req,res)=>{
      const spotid= req.params.id;
      const query= {_id:ObjectId(spotid)}
      const spot = {

        $set:{
          status:"confirm",
        },
      };
      const result= await userSelectedSpots.updateOne(query,spot);
      res.json(result);

    })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("tourist server is runnig")
})
app.listen(port,()=>{
    console.log("server is running on the port",port)
})