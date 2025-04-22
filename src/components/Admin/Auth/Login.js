import { useState } from 'react'
import './Login.scss'
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { doLogin } from '../../../redux/action/userAction';
import { FaSpinner } from "react-icons/fa";

const Login =(props) =>{

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const handleLogin = async() =>{
        setIsLoading(true);
        //goi api , dùng api cần phải tốn tgian , nên phải xài await và async cho đồng bộ
        let data = await postLogin(email,password)
            console.log(">>check data" ,data , +data.EC != 0 ,data.EC)
        if(data && data.EC === 0){ // EC là error code , nếu ko có lỗi thì success  
            // sử dụng dispatch để đưa yêu cầu cho redux
            dispatch(doLogin(data))
            toast.success(data.EM);
            setIsLoading(false);
            navigate('/')
           }
        
           if(data && +data.EC != 0){ //+ để convert sang number
            toast.error(data.EM);
            setIsLoading(false);
           }
    }

    const handleKeyDown =(event) =>{
        if(event.key === "Enter"){
            handleLogin();
        }
    }

    return(
        <div className="login-container">
            <div className="header">
               <span>Dont have account yet ?</span> 
               <button onClick={() =>navigate('/register')}>SignUp</button>
            </div>
            <div className="title col-4 mx-auto">
                Anh Tú
            </div>
            <div className="welcome col-4 mx-auto">
                Hello , Who is this
            </div>
            <div className="content-form col-4 mx-auto">
                <div className='form-group'>
                        <lable>Email</lable>
                        <input 
                        type={"email"} 
                        className="form-control"
                        value={email}
                        onChange={(event) =>setEmail(event.target.value)}
                        />
                </div>
                <div className='form-group'>
                        <lable>Password</lable>
                        <input 
                        type={"password"} 
                        className="form-control"
                        onChange={(event) =>setPassword(event.target.value)}
                        // ấn enter sử dụng onkeydown , event đầu là để truyền tham số , event sau để truyền vào hàm handle
                        onKeyDown={(event) =>{handleKeyDown(event)}}
                        />
                </div>
                <span className='forgot-password'>Forgot Password ?</span>
                <div>
                    <button 
                    className='btn-submit'
                    onClick={() =>handleLogin()}
                    disabled={isLoading}
                    >
                    {isLoading === true && <FaSpinner className="loader-icon"/> }  
                    <span> Login to AnhTU</span></button>
                </div>
                <div className='text-center'>
                    <span className='back' onClick={() =>{navigate('/')}}> 	&#60;&#60; Go to Homepage</span>
                </div>
            </div>
        </div>
    )
}
export default Login