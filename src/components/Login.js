import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Login = (props) => {        // ye alert ka props hai ya destructuring karke bhi nikal sakte hai 

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    let navigate = useNavigate();
    // console.log(usenavigate);


    const handleSubmit = async (e) => {
        e.preventDefault();  // taki page reload na ho 
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {      // mtlb json.success = true hai to redirect kar do
            // save the auth token and redirect
            // yha ham auth token ko save kar rhe hai and use home page par redirect kar rhe hai
            localStorage.setItem('token', json.authtoken);  // to yha mene localstorage me apne token ko save kar liya hai
            // redirect karne ke liye useHistory hook ka use karunga
            props.showAlert("Logged in successfully", "success");
            navigate('/');
        } else {
            // alert("Invalid credentials"); // ye js ka native alert hai but ham baad me change karenge hamare bootstrap vale alert me  
            props.showAlert("Invalid credentials", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    return (
        <div className='mt-2'>
            <h2 className='my-3'>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}> {/*<button> onClick={handleClick}>Add Note</button> ka use bhi kar sakte hai  */}
                <div className="my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={credentials.email} name='email' onChange={onChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} name='password' onChange={onChange} id="password" />
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login
