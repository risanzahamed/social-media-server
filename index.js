const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 8000
require("dotenv").config()

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Social Media server is running')
})


const uri = `mongodb+srv://social-media:q5F1gQoTMTci4Y5j@cluster0.h3zxwhp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {

        const usersCollection = client.db('socialMedia').collection('users')
        const postsCollection = client.db('socialMedia').collection('posts')
        const likeCollection = client.db('socialMedia').collection('like')
        const commentCollection = client.db('socialMedia').collection('comment')
        const addProductCollection = client.db('usedCar').collection('addProduct')

        app.get('/users', async (req, res) => {
            const query = {}
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/posts', async (req, res) => {
            const query = {}
            const result = await postsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/home/posts', async (req, res) => {
            const query = {}
            const result =  (await postsCollection.find(query).toArray()).slice(3,6)
            res.send(result)
        })

        app.get('/like', async (req, res) => {
            const query = {}
            const result = await likeCollection.find(query).toArray()
            res.send(result)
        })
        

        app.get('/comment', async (req, res) => {
            const query = {}
            const result = await commentCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/post/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await postsCollection.findOne(query)
            res.send(result)
        })


        app.get('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filterUser = { _id: ObjectId(id) };
            const user = req.body
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    university: user.university,
                    address: user.address
                }
            }
            const result = await usersCollection.updateOne(filterUser, updatedUser, option)
            res.send(result)

        })

        app.get('/user', async (req, res) => {
            let query = {}

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = usersCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })


        app.put('/user/:id', async (req, res) => {
            const id = req.params.id
            const filterUser = { _id: ObjectId(id) };
            const user = req.body

            console.log(user);
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    user: user.user
                }
            }
            const result = await usersCollection.updateOne(filterUser, updatedUser, option)
            res.send(result)

        })


        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.post('/posts', async (req, res) => {
            const posts = req.body
            const result = await postsCollection.insertOne(posts)
            res.send(result)
        })

        app.post('/like', async (req, res) => {
            const like = req.body
            const result = await likeCollection.insertOne(like)
            res.send(result)
        })

        app.post('/comment', async (req, res) => {
            const comment = req.body
            const result = await commentCollection.insertOne(comment)
            res.send(result)
        })



        app.post('/add-product', async (req, res) => {
            const product = req.body
            const result = await addProductCollection.insertOne(product)
            res.send(result)
        })




    }

    finally {

    }

}

run()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})