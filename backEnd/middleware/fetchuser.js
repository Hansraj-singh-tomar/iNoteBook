// iske andar ek function likhenge kyonki middleware ek function hi hota hai
// jin jin routes me mujhe ye chahiye hoga router.post('/getuser', async (req, res) => {, isme me as a second argument me ek dusra middleware pass kar dunga uske baad ye vala async (req, res) => { function run hoga like that router.post('/getuser', fetchuser ,async (req, res) => { u=ye jo fetch user hai ye user ko fetch kar lega

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisagood$boy';

const fetchuser = (req, res, next) => {    // req,res,next ek middleware leta hai middleware ek function hota hai at the and next ko call karenge taki next vala middleware call ho jaye
    // get the user from the jwt token and add id to req object 
    const token = req.header('auth-token');  // header se ham token lekar aayenge or jab me bhejunga apni request to iss header ka naam issi nam se bhejunga auth-token naam se bhejunga request ko

    // ab token mojud nhi hai tab me kya karunga access denied kar dunga
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        // ab iss token me se me nikalunga user or uske baad next() ko chalaa dena hai  
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }


}

module.exports = fetchuser;


// yhi next() function hai actual me
// async (req, res) => {
// try {
//     userId = "todo";
//     const user = await User.findById(userId).select(".password");  // jaise hi mere pass iss method se -> User.findById(userId) , user aa jayega me uske baad me .select() method se sari ki sari field select kar sakta hu except password ke
// } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
// }
// }

// jha jha mujhe ese routes milenge jha par mujhe login ki jarurat hai vha mujhe sirf itna karna hoga ki "/getuser" ke baad fetchuser dalna hoga

// jis user ka token denge us user ki detail hame milegi 