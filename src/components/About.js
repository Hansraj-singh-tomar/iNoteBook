import React from 'react';
// import noteContext from '../context/notes/noteContext';


const About = () => {

    // const a = useContext(noteContext)

    // // React useEffect एक ऐसा फंक्शन है जो 3 अलग-अलग react component lifeCycle के लिए निष्पादित होता है।
    // // Those lifecycles are componentDidMount, componentDidUpdate, and componentWillUnmount lifecycles.
    // // abhi ham as a component DidMount ki tarah use kar rhe hai useEffect ko  
    // useEffect(() => {
    //     a.update();
    //     // eslint-disable-next-line
    // }, []) // ek bar run karvana chahta hu isliye empty array de rha hu 

    return (
        <div>
            This is About page
            {/* This is About {a.state.name} and he is in class {a.state.class}. */}
        </div> // pehle me {a.name} use kar rha tha knonki me directly puri state ko hi export kar rha tha but now me {a.state.name} use kar rha hu kyonki mera jo object export ho rha hai uske andar ek state hai uske undar sari  value hai isliye me .state use kar rha hu    
    )
}

export default About;

