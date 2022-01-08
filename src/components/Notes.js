import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import Noteitem from './Noteitem';
import { useNavigate } from "react-router-dom";

const Notes = (props) => {

    const context = useContext(noteContext);
    let navigate = useNavigate();
    const { notes, getNotes, editNote } = context;

    useEffect(() => {  // isse me component DidMount ki tarah use karna chahta hu 
        if (localStorage.getItem('token')) {   // agar mera localStorage.getItem('token') = null nhi hai tab me getNotes karunnga varna me redirect kar dunga login vale page par
            getNotes();
        } else {
            navigate('/login');
        }
        //eslint-disable-next-line
    }, [])

    const ref = useRef(null); // initial value ek dam blank rhegi ya null kar sakte hai
    const refClose = useRef(null); // ye ham modal ko close karne ke liye kar rhe hai  

    const [note, setNote] = useState({   // ye edit note ke liye hai 
        id: "",
        etitle: "",
        edescription: "",
        etag: ""
    })

    const updateNote = (currentNote) => {
        // ref.toggle(); // show ho rha hai hide ho jaye or hide hai to show ho jaye 
        ref.current.click(); // kha par mera ye jo reference hai vo point kar rha hai
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.etag }); // jo title,discription,tag hai jo ki pehle khali the vo ab change ho jayenge or currentNote ke equal ho jayenge 
    } // .current karne ke baad hi hame useref use karna padta hai 

    const handleClick = (e) => {  // ye bhi edit note ke liye hai 
        // console.log("Updating the note...", note);
        // e.preventDefault(); // taki page reload na ho  // e.preventDefault form ka part nhi hai 
        editNote(note.id, note.etitle, note.edescription, note.etag); // modal ko close karne se pehle ham edit note kar denge uske baad modal ko close karne ka code likhenge
        refClose.current.click(); // isse mera modal close ho jayega update button par click karne ke baad 
        props.showAlert("Updated Successfully", "success");
    }
    const onChange = (e) => {
        // console.log([e.target.name]);  // [title] 
        // console.log(e.target.value); // h ha han hans hansr hansra hansraj
        setNote({ ...note, [e.target.name]: e.target.value });  // jo bhi value note ke andar hai vo rhe lekin jo properties aage likhi ja rhi hai unko add ya overRide kar dena  
    }                                                          // [e.target.value]:e.target.value jo bhi change ho rha hai name vo uski value ke brabar ho jaye


    return (
        <>
            <AddNote showAlert={props.showAlert} />

            {/* Button trigger modal, e.preventDefault form ka part nhi hai  */}
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal // class me d-none dene par mujhe ye nhi dikhega
            </button>

            {/* Modal  */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* form for update notes */}
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required />
                                </div>

                            </form>
                        </div>

                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> {/* modal (jha ham note ko edit karte hai) ko close karne ke liye mujhe iss button par click karna padega, e.preventDefault form ka part nhi hai , yha ham ref ka use karenge */}
                            <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Notes</button> {/*ye hare form ka part nhi hai to mujhe e.preventDefault karne ki jarurat hi nhi hai*/}
                        </div>
                    </div>
                </div>
            </div>

            <div className='row my-3'>
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes.length === 0 && 'No notes to display'} {/* hamare pass else me kuch nhi hai to ham ? and : ki jagah && ka use karenge mtlb condition sach hone par hi message return hoga */}
                </div>
                {notes.map((note) => {
                    {/* return note.title; // My Title My Title2 title dega from NoteState.js component se  */ }
                    return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} /> // isme hamne note nam ki props pass ki hai 
                })}
            </div>
        </>

    )
}

export default Notes



// useRef hook se ham kisi bhi ek element ko reference de sakte hai 