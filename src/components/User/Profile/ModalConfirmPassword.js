import { useState } from "react"
import { Button, Modal } from "react-bootstrap"
import "./Profile.scss"
import { toast } from "react-toastify"
import {postCodeChangePassword} from "../../../service/apiService"
import { useNavigate } from "react-router-dom"

const ModalChangePassword =(props) =>{

    const {show , setShow ,email} =props
    const [password ,setPassword]=useState("")

    const navigate =useNavigate()

    const handleClose =() =>{
        setShow(false)
    }

    const handleSubmitChangePassword =async() =>{
          let res = await postCodeChangePassword(email,password)
          if(res && res.EC===1){
            toast.error(res.message)
            return
          }else{
            toast.success(res.message)
            navigate("/new-password-profile")
            localStorage.setItem("passwordConfirm" ,"true")
          }
    }

    return(
        <>
        <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        className="modal-change-password"
        >
            <Modal.Header closeButton>
                <Modal.Title>Change Your Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form className="row g-10">
                    <div className="col-md-8">
                        <label  className="form-label">Enter your current password</label>
                        <input type="password" className="form-control" value={password} onChange={(event) =>setPassword(event.target.value)} />
                    </div>
               </form>
            </Modal.Body>
            <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>handleSubmitChangePassword()} >
            Save
          </Button>
        </Modal.Footer>
        </Modal>
        </>
    )
}
export default ModalChangePassword