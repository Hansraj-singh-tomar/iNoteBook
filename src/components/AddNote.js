import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({
        title: "",
        description: "",
        tag: ""
    })
    const handleClick = (e) => {
        e.preventDefault(); // taki page reload na ho  
        addNote(note.title, note.description, note.tag);
        setNote({ title: "", description: "", tag: "default" }); // jab me ek baar input me jo type kar dunga vo mujhe agli bar type karte time nhi dikhega iss line se // niche input me mujhe value={note.title}, value={note.description} and value={note.tag} dena hai 
        props.showAlert("Added Successfully", "success");
    }
    const onChange = (e) => {
        // console.log([e.target.name]);  // [title] 
        // console.log(e.target.value); // h ha han hans hansr hansra hansraj
        setNote({ ...note, [e.target.name]: e.target.value });  // jo bhi value note ke andar hai vo rhe lekin jo properties aage likhi ja rhi hai unko add ya overRide kar dena  
    }                                                          // [e.target.value]:e.target.value jo bhi change ho rha hai name vo uski value ke brabar ho jaye
    return (
        <div>
            <div className="container my-3">
                <h2>Add a Note</h2>

                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required />
                    </div>
                    <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form> {/* disabled feature se add note button ka color fade rhega jab tak inke andar ke text length ki length 5 se jyada nhi ho jati  */}
            </div>
        </div>
    )
}

export default AddNote
