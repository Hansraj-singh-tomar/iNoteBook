// iske andar hamare notes ki sari ki states aane vali hai
// ab isme ham state ko banane vale hai jo sab ko accesable ho
import { useState } from "react";
import noteContext from "./noteContext"; // noteContext component ke through ham createContext ko import kar ke ham use kar rhe hai direct bhi kar sakte the  

const NoteState = (props) => {  // isko ham app.js me import kar rhe hai or sare component or code ko iss compoenent ke andar grab kar denge jisse ham khi bhi iske dvara bheji gyi props ya item ko use kar sake kisi bhi level par 
    const host = 'http://localhost:5000';
    // const s1 = {
    //     "name": "Harry",
    //     "class": "5b"
    // }

    // const [state, setState] = useState(s1);

    // const update = () => {
    //     setTimeout(() => {
    //         setState({
    //             "name": "larry",
    //             "class": "10b"
    //         })
    //     }, 2000);
    // }


    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);



    // Get all Notes
    const getNotes = async () => {
        // API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFjYWExMWVkOGU3NjEyMzNjNWQ3MjYxIn0sImlhdCI6MTY0MDcxODQ2Mn0.QWNkNJLLSHKEQonPNKHLbGJGl1TkqVh8P7MAZsil7dA'
                'auth-token': localStorage.getItem('token')  // yha par mera jo token hai vo localStorage se aane vala hai 
            },
        });
        const json = await response.json();
        // console.log(json);
        setNotes(json);
    }




    // Function of Add a Note
    const addNote = async (title, description, tag) => {
        // TODO: API Call

        const response = await fetch(`${host}/api/notes/addnote`, {

            method: 'POST', // *GET, POST, PUT, DELETE, etc.

            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFjYWExMWVkOGU3NjEyMzNjNWQ3MjYxIn0sImlhdCI6MTY0MDcxODQ2Mn0.QWNkNJLLSHKEQonPNKHLbGJGl1TkqVh8P7MAZsil7dA'
                'auth-token': localStorage.getItem('token')
            },

            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });  // { title, description, tag } curly brackes use na karne par mujhe error aa rhi thi
        const json = await response.json();
        // console.log(json);


        // Adding a new Note
        // console.log("adding a new note");
        const note = json;
        setNotes(notes.concat(note));  // concat hame nya array return karega isliye ham push use nhi kar rhe hai 
    }




    // Function of Delete a Note
    const deleteNote = async (id) => {
        // TODO: API Call

        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFjYWExMWVkOGU3NjEyMzNjNWQ3MjYxIn0sImlhdCI6MTY0MDcxODQ2Mn0.QWNkNJLLSHKEQonPNKHLbGJGl1TkqVh8P7MAZsil7dA'
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = response.json();
        console.log(json);

        // console.log("Deleting the note with id" + id);
        const newNotes = notes.filter((note) => { return note._id !== id }); // that's a exact use of filter method 
        setNotes(newNotes);
    }




    // Function of Edit a Note
    const editNote = async (id, title, description, tag) => {
        // TODO: API Call

        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFjYWExMWVkOGU3NjEyMzNjNWQ3MjYxIn0sImlhdCI6MTY0MDcxODQ2Mn0.QWNkNJLLSHKEQonPNKHLbGJGl1TkqVh8P7MAZsil7dA'
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log(json);

        // Logic to edit in client
        // react me ham states ko directly change nhi kar sakte to ham newNotes create kar rhe hai, json.stringify kar denge hamare array ko jo notes hai hamara
        let newNotes = JSON.parse(JSON.stringify(notes)) // ye karne ke baad me onscreen notes ko update kar pa rha hu
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break; // ek baar change karne ke baad break karunga iss loop se 
            }
        }
        // console.log(id, notes);
        setNotes(newNotes);
    }

    return (
        // <noteContext.Provider value={{ state:state, update:update }}> value me hamne object ko pass kiya hai
        // <noteContext.Provider value={{ state, update }}>
        <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </noteContext.Provider> // notes, addNote, deleteNote, editNote, getNotes ye sari chije ham export kar rhe hai 
    )
}

export default NoteState;


// ab me jha bhi useContext ko use karunga vha me value={{notes}} se notes ke data ko add kar sakta hu

// fetch api ke liye google par fetch api with header ko search karenge
// const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//         'Content-Type': 'application/json'
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data) // body data type must match "Content-Type" header
// });
// return response.json(); // parses JSON response into native JavaScript objects 