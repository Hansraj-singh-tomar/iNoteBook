// ye mera entry point hai application ka
// ye hmara nodejs backend hai jiska hamare react application se koi lenadena nhi hai ha but ise react application se connect jarur karenge but ye ek independent entity hone vali hai
// vs code ki ek extension thunder client ka use karenge jo postman jaisi work karti hai
// node module ko git ignore se bahar bhi dalenge , iske liye me inotebook project ke git-ignore folder me jaunga jha  /node_modules dikhega jo mere backend folder ke node module file ko git me puch karne ka kam kar rha hai
// #dependencies me /node_modules me forward slash (/) hta dunga

// index.js jo hai ye actual me express server rhega

// "scripts": {
//     "test": "echo \"Error: no test specified\" && exit 1",
//         "start": "node backend/index.js",
//             "dev": "nodemon backend/index.js",
//                "index": "nodemon index.js"
// },

const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

connectToMongo();

const app = express();
app.use(cors());

const port = 5000;  // port 3000 hamara react ke liye hone vala hai isliye ham yha 5000 use kar rhe hai port

app.use(express.json()); // console.log(req.body); se jo undefined aa rha tha uska solution ye line hai jise middleware bolte hai 

// .get ek end point banaya hai jo hame return kar rha hai simple hello world!, hame or kuch end point chahiye jisse ham write kar sake hamari mongodb me
// user ko authenticate karne ke liye bhi hame end point chahiye or usi ke sath or endpoint chahiye ye dekhne ke liye ki kon sa userr kab connected hai or kon se user ke kitne note kha se fetch karne hai
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`)
})

// output-
// Example app listening at http://localhost:3000
// connected to mongo successfully, ye isliye baad me run hua kyonki mongodb time leta hai load honeme jab mongo load hogi tab ye callback fire ho
// jayegi tab tak baki ka code run ho jayega.

// ab me is http://localhost:3000 ko thunder par new request par jakar get  me ye url pass kar  karu to ye mujhe hello world! dega as a response
// browser par bhi hame http://localhost:3000 likhne par hello world mil jayega dekhne ko

//app.get('/api/v1/login', (req, res) => {
// res.send('Hello login page is here!')
// }) ye karne ke baad browser par uri me  http://localhost:3000/api/v1/login likhne par mujhe hello login page is here likha hua show karega
// but isse ham alag file me likhenge it's bad habbite

// models nam ka ek folder create karenge jisme mongoose ke sare models aane vale hai
// ise prakar routes ka ek folder bna lenge jisme hamare sare routes aane vale hai

// package.json me script ke andar ye add karna hai   "index": "nodemon index.js" or ise run npm run index ka use karna hai 