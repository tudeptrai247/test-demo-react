import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import "./ForgotPassword.scss"
import {putUpdateNewPassword} from "../../../../service/apiService"
import { toast } from "react-toastify"
import { useLocation, useNavigate } from "react-router-dom"

const NewPassword =() =>{

    const navigate =useNavigate()
    const [password ,setPassword]=useState("")

    const email = localStorage.getItem("emailGetCode")
    
    const location = useLocation();
     const verifiCode = location.state?.verifyCode || localStorage.getItem("reset-verify") =="true"

    useEffect(()=>{
            if(!email || !verifiCode){
                toast.error("Unauthorized Access")
                navigate("/send-code-password")
            }
        },[])  

    const handleSubmitNewPassword =async() =>{
        let res = await putUpdateNewPassword(password,email)
        if(res && res.EC===0){
            toast.success(res.message)
            localStorage.removeItem("emailGetCode")
            localStorage.removeItem("reset-verify")
            navigate("/login")
        }
    } 

    return(
        <div className="new-password-input-container">
            <h5>Please Input Your New Password</h5>
            <div className="input-new-password-container">
                <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)}/>
                <Button onClick={()=>handleSubmitNewPassword()}>Submit</Button>
            </div>
        </div>
    )
}
export default NewPassword