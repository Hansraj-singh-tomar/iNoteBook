import Notes from './Notes';
// import noteContext from '../context/notes/noteContext';

export const Home = (props) => {
    // const context = useContext(noteContext);
    // const { notes, setNotes } = context;
    const { showAlert } = props;
    return (
        <div>
            {/* <h1>this is home </h1>   */}

            {/* <div className="container my-3">
                <h2>Your Notes</h2>
                {notes.map((note) => {
                    return note.title; // My Title My Title2 title dega from NoteState.js component se 
                })}
            </div> */}

            <Notes showAlert={showAlert} />
        </div>
    )
}


// App.js me div.container ke andar jo bhi wrap kiya hai uske karan hame this is home hame thoda center me dikhayi de rha hai