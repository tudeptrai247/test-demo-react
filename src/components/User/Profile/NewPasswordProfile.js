import { useEffect, useState } from "react"
import "../../Admin/Auth/ForgotPassword/ForgotPassword.scss"
import { Button } from "react-bootstrap"
import { toast } from "react-toastify"
import {putUpdateNewPassword} from "../../../service/apiService"
import { useNavigate } from "react-router-dom"

const NewPasswordProfile =() =>{

        const navigate =useNavigate()
        const [password ,setPassword]=useState("")

        const storedAccount =localStorage.getItem("account");
        const user =JSON.parse(storedAccount)
        const email =user?.email;

        const passwordConfirm = localStorage.getItem("passwordConfirm")==="true"

        useEffect(()=>{
            if(!passwordConfirm){
                toast.error("Unauthorized Access")
                navigate("/profile")
            }
        })

        const handleSubmitNewPassword =async()=>{
             let res = await putUpdateNewPassword(password,email)
             if(res && res.EC===0){
            toast.success(res.message)
            navigate("/profile")
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
export default NewPasswordProfile