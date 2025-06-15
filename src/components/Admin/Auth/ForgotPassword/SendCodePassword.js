import { useState } from "react"
import { Button } from "react-bootstrap"
import {postCodeResetPassword} from "../../../../service/apiService"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import "./ForgotPassword.scss"

const ForgotPassword =() =>{

    const navigate =useNavigate();
    const [email ,setEmail] =useState("")

    const handleOnClickGetCodeResetPassword =async()=>{
        let res = await postCodeResetPassword(email)
         if(res && res.EC === 1){
            toast.error(res.message)
            return
         }else{
            toast.success("Send Code Success")
            navigate('/confirm-code',{state:{email}} )
            localStorage.setItem("emailGetCode" ,email)
         }
        
    }

    return(
        <div className="forgot-password-container">
        <h4>Enter Your Register Email</h4>
        <input type="text" value={email} onChange={(event) =>setEmail(event.target.value)}/>
        <Button onClick={()=>handleOnClickGetCodeResetPassword()}>Submit</Button>
        </div>
    )
}
export default ForgotPassword