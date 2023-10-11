const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()

//middleware
app.use(cors()) //fetch data in local server
app.use(express.json()) //for req.body undefined

//mdmahfujhasan894
//1c1qiSGWrUxQzEVv


const uri = "mongodb+srv://mdmahfujhasan894:1c1qiSGWrUxQzEVv@cluster0.tgipjen.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");
    const userCollection = client.db("usersDB").collection("users")

    app.get('/users',async(req,res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/users/:id',async(req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query)
      res.send(result)
    })

    app.post('/users', async(req,res) => {
      console.log("New user",req.body);
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send(result)
      
    })
    app.put('/users/:id',async(req,res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const options = {upsert: false}
      const user = req.body
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
        }
      }
      const result = await userCollection.updateOne(query,updateUser,options)
      res.send(result)

    })
    app.delete('/users/:id',async(req,res) => {
      const id = req.params.id;
      console.log("user deleted",id);
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) => {
    res.send("simple crud server")
})

app.listen(port,() => {
    console.log(`server running in port ${port}`)
})