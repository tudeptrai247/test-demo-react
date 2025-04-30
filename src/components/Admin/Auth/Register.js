import { useState } from 'react';
import './Login.scss'
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";

const Register = (props) =>{
    const navigate = useNavigate();

    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const [password ,setPassword] =useState("");

    const [showpass , setShowpass] = useState(false);

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };

    const handleRegister =async() =>{
        if(username ==="" || email === "" || password ===""){
            toast.error("Please Fill All Information");
            return
        }

        const isValidEmail = validateEmail(email);
        if(!isValidEmail){
            toast.error("Invalid Email")
            return
        }

        let data = await postRegister(username,email,password)
        console.log("check data " , data)
        if (data && data.EC === 0 ){
            toast.success(data.message)
            navigate('/login')
        }

        if(data && +data.EC !=0){
            toast.error(data.EM)
        }
    }
    return(
        <div className="login-container">
             <div className="header">
               <span>Back To Login</span> 
               <button onClick={() =>navigate('/login')}>Login</button>
            </div>
           <div className="title col-4 mx-auto mt-5">
                Register
           </div>

            <div className="content-form col-4 mx-auto">
                <div className="form-group">
                    <label>UserName</label>
                    <input 
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                    type={"email"}
                    className="form-control"
                    value={email}
                    onChange={(event) =>setEmail(event.target.value)}
                    />
                </div>

                <div className="form-group ">
                    <label>Password</label>
                    <input 
                    type={showpass ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    />
                    <span className='eye-icon' onClick={() =>setShowpass(!showpass)}><FaEye/> </span>
                </div>
                <div>
                    <button 
                    className="btn-submit"
                    onClick={() =>handleRegister()}
                    >
                        Register
                    </button>                  
                </div>
            </div>
        </div>
    )
}
export default Register                 