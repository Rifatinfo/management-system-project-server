const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());

// user-management-system
// mHQiMeTDpHZrMyMB



const uri = "mongodb+srv://crud:ivSqEEul4nlc3kp7@cluster0.ejjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db('User_Management');
    const userCollection = database.collection('Users');

    app.post('/users', async (req,res) => {
      const user = req.body;
      console.log("user", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user);
    
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true }; // Create the document if it doesn't exist
    
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
          male: user.male,
          female: user.female,
          active: user.active,
          inactive: user.inactive
        }
      };
    
      const result = await userCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });
    

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Please delete from database', id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query); 
      res.send(result);  
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('User Management System Project')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})