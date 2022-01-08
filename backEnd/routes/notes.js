const express = require('express');
const router = express.Router();
const Note = require('../models/Note'); // ye hamra mongoose ka User model hai
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator'); // ye hamara express validator npm package hai




// ROUTE 1: Get all the Notes using: GET "/api/notes/getusere". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }
})




// ROUTES 2: Add a new Note using: POST "/api/notes/addnote", login required
router.post('/addnote', fetchuser, [              // yha par ham array create karenge usme ham saare ke saare validator dalenge
    // iissse jo error aayegi vo array ke form me milegi name ,email,password sabi ki apni alag error aayegi
    body('title', 'Enter a valid title').isLength({ min: 3 }),  // yha ham hamara kud ka message bhi daal sakte hai mtlb custom message
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;

        // If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }
})



// ROUTES 3: Update an existing Note using: PUT "/api/notes/updatenote", login required
// updation ke liye ham put requist ka use karenge

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a newnote object
        const newNote = {};  // isme jo jo fields mujhe mil rhi hai vo add karunga
        if (title) { newNote.title = title }; // newNote ka jo title hai vo title ke brabar kar do 
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it 
        let note = await Note.findById(req.params.id);   // /updatenote/:id  req.params.id   iss url se id ko le rha hai jo ham update karna chahte hai, so ab mene note nikal liye jo me uodate karna chahta hu

        // ab maan lo ye note exist hi na karta ho iss id ka 
        if (!note) { return res.status(404).send("Not Found") }

        // ab me ye dekhunga ki ye jo note hai kya jo iska user hai vo vhi hai kya 
        if (note.user.toString() !== req.user.id) {   // note.user.toString() ye mujhe iss note ki id dega or req.user.id ye mujhe jo mere pass exist hai user uski id dega or compare karega dono ko
            return res.status(401).send("Not Allowed");
        }

        // isme ham kya karenge ki jab hamara note exist karta hai mtlb ab ye note hamare pass hai 
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });  // { new: true } ye karne ka mtlb ye hai ki agar koi nya contact aata hai to vo create ho jayega basically
        //itna karne ke baad ye hoga ki mera jo note hai vo update ho jayega 

        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }

})



// ROUTES 4: Delete an existing Note using: DELETE "/api/notes/deletenote", login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it 
        let note = await Note.findById(req.params.id);   // /updatenote/:id  req.params.id   iss url se id ko le rha hai jo ham update karna chahte hai, so ab mene note nikal liye jo me uodate karna chahta hu

        // ab maan lo ye note exist hi na karta ho iss id ka 
        if (!note) { return res.status(404).send("Not Found") }

        // Find the deletion only if user ownes this Note
        // ab me ye dekhunga ki ye jo note hai kya jo iska user hai vo vhi hai kya 
        if (note.user.toString() !== req.user.id) {   // note.user.toString() ye mujhe iss note ki id dega or req.user.id ye mujhe jo mere pass exist hai user uski id dega or compare karega dono ko
            return res.status(401).send("Not Allowed");
        }

        // isme ham kya karenge ki jab hamara note exist karta hai mtlb ab ye note hamare pass hai 
        note = await Note.findByIdAndDelete(req.params.id);  // { new: true } ye karne ka mtlb ye hai ki agar koi nya contact aata hai to vo create ho jayega basically
        //itna karne ke baad ye hoga ki mera jo note hai vo update ho jayega 

        res.json({ "success": "Note has been dleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error"); // ye me user ko bhej rha hu
    }

})



module.exports = router