import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom'
import { useNavigate } from "react-router-dom"; // redirect karunga jab use ne sign up kar diya tab

// sign up karne par mujhe auth token milega
const Signup = (props) => {       // ye alert ke liye props hai 

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });
    let navigate = useNavigate();
    // console.log(usenavigate);

    const handleSubmit = async (e) => {
        e.preventDefault();  // taki page reload na ho 
        const { name, email, password } = credentials;  // name,email,password ko credentials se bahar nikalunga
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log(json);

        if (json.success) {      // mtlb json.success = true hai to redirect kar do
            // save the auth token and redirect 
            localStorage.setItem('token', json.authtoken);  // to yha mene localstorage me apne token ko save kar liya hai
            // redirect karne ke liye useHistory hook ka use karunga
            navigate('/');
            props.showAlert("Account Created Successfully", "success");
        } else {
            // alert("Invalid credentials"); // ye js ka native alert hai but ham baad me change karenge hamare bootstrap vale alert me  
            props.showAlert("Invalid Details", "danger");
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    return (
        <div className='container mt-2'>
            <h2 className='my-3'>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name='name' onChange={onChange} id="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' onChange={onChange} id="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name='cpassword' onChange={onChange} id="cpassword" minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}

export default Signup

// onSubmit likhne ka sabse bda fayada ye hai ki me required and minLength={5} likh sakta hu