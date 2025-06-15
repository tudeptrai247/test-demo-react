import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import "./ForgotPassword.scss"
import {postCodeResetPassword} from "../../../../service/apiService"
import { toast } from "react-toastify"
import { useLocation, useNavigate } from "react-router-dom"
import {postCodeConfirm} from "../../../../service/apiService"


const ConfirmCode =() =>{

    const [code ,setCode] =useState("")
    const [countDown ,setCountDown] =useState(60)
    const [canSend ,setCanSend]=useState(false)
    const navigate =useNavigate()

    const location = useLocation();
    const email = location.state?.email || localStorage.getItem("emailGetCode")
   


    useEffect(()=>{
        let timer;
        if(countDown>0){
            // trừ 1 giây
            timer =setTimeout(()=>setCountDown(countDown-1),1000)
        }else{
            setCanSend(true)
        }
        return () =>clearTimeout(timer)
    },[countDown])

    useEffect(()=>{
        if(!email){
            toast.error("Email is missing .Please input your email again")
            navigate("/send-code-password",{state:{code}})
        }
    },[])   

const handleClickSendCodeAgain =async() =>{
    let res =await postCodeResetPassword(email)
    if(res && res.EC ===0){
        toast.success(res.message)
    }
    setCountDown(60)
    setCanSend(false)
}

const handleClickConfirmCode =async() =>{
    let res = await postCodeConfirm(code,email)
    if(res && res.EC===0){
        toast.success(res.message)
        navigate("/new-password")
        localStorage.setItem("reset-verify","true")
    }else{
        toast.error(res.message)
        return
    }
}

    return(
        <div className="confirm-code-container">
            <h5>Please Enter The Code We Have Sent To Your Email To Confirm Account , Code just expired at 5 min</h5>
                <div className="input-container">
                    <input type="text" value={code} onChange={(event)=>setCode(event.target.value)} />
                    <Button onClick={()=>handleClickConfirmCode()}>Sumit Code</Button>
                </div>
                 <p>{canSend ?
                    <Button onClick={()=>handleClickSendCodeAgain()}>Send Code Again</Button>
                    :
                    `Code can send back in ${countDown} Second`
                    }</p>
        </div>
    )
}
export default ConfirmCode