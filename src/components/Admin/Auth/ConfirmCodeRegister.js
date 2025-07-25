import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import "./Login.scss"
import { toast } from "react-toastify"
import {postResendCodeRegister,postConfirmCodeRegister} from "../../../service/apiService"
import { useLocation, useNavigate } from "react-router-dom"


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
            toast.error("unauthorized access")
            navigate("/",{state:{code}})
        }
    },[])   

const handleClickSendCodeAgain =async() =>{
    let res =await postResendCodeRegister(email)
    if(res && res.EC ===0){
        toast.success(res.message)
    }
    setCountDown(60)
    setCanSend(false)
}

const handleClickConfirmCode =async() =>{
    let res = await postConfirmCodeRegister(code,email)
    if(res && res.EC===0){
        toast.success(res.message)
        navigate("/login")
        localStorage.removeItem("emailGetCode")
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