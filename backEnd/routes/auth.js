const express = require('express');
const User = require('../models/User'); // ye hamra mongoose ka User model hai 
const router = express.Router();
const { body, validationResult } = require('express-validator'); // ye hamara express validator npm package hai
const bcrypt = require('bcryptjs');  // it's a npm package for password hashing, salt & papper, for secure password
const jwt = require('jsonwebtoken');  // it's a npm package who will generate a token for user is he real or not more detail is in end of code
const fetchuser = require('../middleware/fetchuser'); // ye hamara middleware hai 
const { success } = require('concurrently/src/defaults');

const JWT_SECRET = 'Harryisagood$boy';   // ye meri ek string hai jo mujhe kisi ko dikhani nhi hai, isse me apne webtoken ko sign karunga

// router.get('/', (req, res) => {
//     // example- // obj = {
//     //     a: 'hansraj',
//     //     number: 24
//     // }
//     // res.json(obj)

//     // request ki body me ham kaise ab kuch bhejenge
//     console.log(req.body);  // to me req ki body me se kuch bhi bheja gya hai vo nikal sakta hu
//     // console se mujhe undefined aayega to ham thundar me request ki body me kuch bheja nhi hai
//     res.send('heello');
// })



// // create a User using: POST "/api/auth/" doesn't need require auth
// // is par hame post request marni hai data bhejna hai
// // ab me ek user create karne ke liye me ek user ka data bhejunga, jo me thundar me jakar body ke andar user ki detail likhunga json form me
// // router.get('/', (req, res) => {
// router.post('/', (req, res) => {  // get ki jagah post use karna hai
//     console.log(req.body);
//     const user = User(req.body);
//     user.save();
//     res.send(req.body);
// })


// owr first Endpoint
// ROUTE 1: create a user using: POST "/api/auth/createuser". No login required
// express validator ka use dekhenge yha par
router.post('/createuser', [              // yha par ham array create karenge usme ham saare ke saare validator dalenge
    // body('name').isLength({ min: 3 }),  // iissse jo error aayegi vo array ke form me milegi name ,email,password sabi ki apni alag error aayegi
    body('name', 'Enter a valid name').isLength({ min: 3 }),  // yha ham hamara kud ka message bhi daal sakte hai mtlb custom message
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    // mongoose model ka user banaunga to ham ye code likhenge user.create ka use karenge
    // here we will check whether the user with this email exists already 
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }

        // this next two line for hash password 
        const salt = await bcrypt.genSalt(10);  // ye hame promise retrun karega ,genSalt bycrypt ka predefined function hai jiski help se ham salt create kar rhe hai 
        secPass = await bcrypt.hash(req.body.password, salt);  // ye hash method bhi bcrypt ka predefined function hai ye hame promise return karta hai 
        // create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            // password: req.body.password,
            password: secPass, // secPass ek variable banaya hai password ka 
        }); // aync await use kar rhe hai to .then use karne ki koi jarurat nhi 

        //    .then(user => res.json(user))
        //     .catch(err => {
        //         console.log(err)
        //         res.json({ error: 'pleaase enter a unique value for email', message: err.message })
        //     })

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET); // ye sync method hai to await use karne ki jarurat nhi hai mujhe directally ye data mil jayega
        // console.log(authtoken);

        // res.json(user); // user ki jagah me ek token bhejunga or us token me user ki id bhejunga
        // res.json({ authtoken: authtoken }); // yha es6 use karenge to isse direct res.json({ authtoken }); likh lenge 
        success = true; // agar yha tak aa gya to ham success= true kar denge
        res.json({ success, authtoken }); // ab jab bhi koi mujhe ye authtoken dega to me usse again data me change kar dunga or JWT_SECRET se ye bhi pta lenge ki koi iske sath temper to nhi kar rha hai

        // catch errors
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// owr second Endpoint 
// ROUTE 2: Authenticate a user using : POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(), // yha koi bhi agar galat email or password ko khali rakhega to usse niche ke code se error milegi tab mujhe database ko touch karne ki jarurat bhi nhi   
], async (req, res) => {
    let success = false;  // ye karne par ham react ke login component me validation ka use kar sakte hai ki agar success=true hai to me use ko login karne dunga

    // actual use of success in react ke Login.js component me
    // if (json.success) {      // mtlb json.success = true hai to redirect kar do
    //     // save the auth token and redirect 
    //     localStorage.setItem('token', json.authtoken);  // to yha mene localstorage me apne token ko save kar liya hai
    //     // redirect karne ke liye useHistory hook ka use karunga
    //     navigate('/');
    // } else {
    //     alert("Invalid credentials"); // ye js ka native alert hai but ham baad me change karenge hamare bootstrap vale alert me  
    // }

    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // ideal senario me mujhe email or password milenge instead of error 
    const { email, password } = req.body;  // destructuring ka use karke me email or password ko bahar nikalunga req.body se   
    try {
        let user = await User.findOne({ email: email }); // User model me findOne method ka use karke we check user exist or not
        // agar user exist hi na karta ho tab me kya karunga
        if (!user) {
            success = false;
            return res.status(400).json({ error: "Please try to login with correct credentials" }); // me yha par user ko ye error nhi dunga ki user exist nhi karta hai ya password galat hai ya password chota hai 
        }

        // ab ham paassword ko campare karenge bycrypt.compare() method se
        const passwordcompare = await bcrypt.compare(password, user.password); // ek password user dwara dala gya hai or ek hamare db me hai jo hamne User.findOne() method ka use karke nikala hai db se, compare method() 2 argument leta hai pehla password strin and dusra hash leta hai jo already exist hai ye internally sare hash ko match kar lega, ye true/false return karega
        // compare() method asynchrones function hai to hame await ka use karna padega 

        // agar ye password match nhi karte hai to
        if (!passwordcompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        // agar mera password correct hoga tab me payload daal dunga, payload vo data hai user ka jo ki ham bhejenge through id
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        const success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }
})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
// isme hame JWT token bhejna padegaa 
router.post('/getuser', fetchuser, async (req, res) => {
    // agar mene jo hamara user hai uski id lene ka code mene yha par likh diya to vo code mujhe har EndPoints par copy karna padega jha jha authentication ki jarurat hai
    // agar me chahu me iss application ko scalable application bnana chahu jaise blog,shop video calling ki functionality add kar du to me kya karunga ki ek middleware likh dunga middleware nodejs ka ek function hota hai jo ki call kiya jayega jab bhi aapke jo bhi login required vale routes hai un par koi bhi request aayegi to   
    try {
        userId = req.user.id;
        // console.log(userId);
        const user = await User.findById(userId).select("-password");  // jaise hi mere pass iss method se -> User.findById(userId) , user aa jayega me uske baad me .select() method se sari ki sari field select kar sakta hu except password ke    
        res.send(user);  // .select(".paassword") karne par mujhe error aa rhi thi  
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }
})
module.exports = router;






// ye jo auth.js hai ye mujhe kab milega jab me /api/auth par jaunga tab

// thundar me body me { "name":"hansraj likhna hai"}

// thundar me hearder ke andar ek header add karenge Content-Type - application/json

// agar ham request.body ko use karna chahte hai to hame ek middleware use karna padega
// middleware use karne ke liye ham app.use(express.json()) ka use karenge jiske baad hame undefined error nhi dekhne ko milegi
// but ye line hame index.js file me likhna padega
// so req.body ko agar mujhe use karna hai to mujhe app.use(express.json()); middleware ka use karna padega ab me json me deal kar sakta hu ab me json me request bhej sakta hu content-type application/json bhej kar

// agar ham post ki jagah get method use karenge to hamari logs files hai computer ki usme hamara password dikh sakta hai
// agar get request use kar rhe hai to hamari sari detail us URL ke sath jayegi
// or data bhut jyada hai to hame post request hi use karna hai

// search on google Logger and SQS

// hash, salt, papper password ke liye ham npm package bcryptjs ka use karenge
// npm i bcryptjs

// jab bhi koi login karega to usse ham token denge na ki usi ka user_name or password
// types of token - session Token, Json Web Token. alag alag tarah ke macanisam hai authentication ke
// iss project me ham JWT(json web token) authentication ka use karenge ye ek npm package hai jise ham hamare code me use karenge
// jwt ek tarika hai varify karne ka ek user ko, kyonki bar bar user apna userid or password to bhejega nhi mujhe
// ek bar user ko authenticate karne baad me user ko token dunga or agli bar jab bhi koi protected route mere site or mere iss express server par user ko access karna pad gya to vo kya karega vo mujhe token bhi bhejega taki me varify kar saku ki ye vhi user hai jise mene authenticate kiya tha
// JWT.io website hai
//  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxY2FhMTFlZDhlNzYxMjMzYzVkNzI2MSIsImlhdCI6MTY0MDY2OTQ3MH0.tBIeV3HZRDvPntMTmnnqDnxDpm-jP7kF_S9n_7bVTMg"
// ye uppar jo hai token id hai

// jwt me 3 part hote hai
// 1st part me algorithm and token part hota hai
// 2nd part me data jo ham web token me bhejna chahte hai vo hota hai
// 3rd signature hota hai jo important hai, me jab bhi ek json web token apne server se dispatch karunga tab me usko sign karunga apne secret se jo hai -  const JWT_SECRET = 'Harryisagood$boy'; isse me apne web token ko sign karunga like that const authtoken = jwt.sign(data, JWT_SECRET);
// client or server ke between ek bhot secure communication karna faciliated karvata hai JWT authentication

// authtoken ko decode karna padega jissse me userId ko fetch kar lunga
// authtoken me, me kya data bhej rha hu user or id mtlb authtoken me id mojud hai ab me nikalu kaise
// id nikalne ke liye - jo jo request ye mangte hai ki user authenticate hona chahiye me unme ek header bhej dunga authentication token ke naam ka o us header me kya karunga ki us header me jo bhi data hoga use nikal kar yha fetch kar lunga  