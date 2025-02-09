var express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
var app = express()
const uri = 'mongodb+srv://thari123:thari123@cluster0.01zhtfo.mongodb.net/'
var port = process.env.port || 3000
let collection

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function runDBConnection () {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect((err, db) => {
      collection = client.db('card').collection('card')
      if (!err) {
        console.log('MongoDB connection connected successfully')
      } else {
        console.log('MongoDB connection error: ', err)
        process.exit(1)
      }
    })
  } catch (ex) {
    console.error(ex)
  }
}

function getAllCards (callback) {
  try {
    collection.find({}).toArray(callback)
  } catch (ex) {
    console.error(ex)
  }
}

function addCard (card, callback) {
  try {
    collection.insertOne(card, callback)
  } catch (ex) {
    console.error(ex)
  }
}

app.get('/', (req, res) => {
  res.render(index.html)
})

app.get('/api/cards', (req, res) => {
  getAllCards((err, result) => {
    if (!err) {
      return res.json({
        statusCode: 200,
        data: result,
        message: 'Get all cards success'
      })
    }
  })
})

app.post('/api/card', (req, res) => {
  var newCard = req.body
  var newCard = {
    path: req.body.path,
    title: req.body.title,
    subTitle: req.body.subTitle,
    description: req.body.description
  }
  addCard(newCard, (err, result) => {
    if (err) {
      res.json({ statusCode: 400, message: err })
    } else {
      res.json({
        statusCode: 200,
        message: 'Card successfully added',
        data: result
      })
    }
  })
})

var port = process.env.port || 3000

app.listen(3000, () => {
  console.log('express server started ' + port)
  runDBConnection()
})
