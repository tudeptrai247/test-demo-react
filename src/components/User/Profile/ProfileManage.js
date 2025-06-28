import { useState } from "react";
import "./Profile.scss"
import ModalConfirmPassword from "./ModalConfirmPassword";
import { useDispatch } from "react-redux";
import { doLogout } from "../../../redux/action/userAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileManage =() =>{

    const storedAccount =localStorage.getItem("account");
    const user =JSON.parse(storedAccount)
    const user_name =user?.username;
    const user_email =user?.email;
    const user_logintype =user?.login_type;

    const dispatch = useDispatch();

    const navigate = useNavigate();
    
    const [showModalChangePassword , setShowModalChangePassword] =useState(false)

    const handleClickChangePassword =()=>{
        setShowModalChangePassword(true)
    }

    const handleLogoutButton =() =>{
        localStorage.clear();
        dispatch(doLogout());
        toast.success("Logout success")
        navigate("/login")
    }

    return(
        <div className="profile-container">
            <div className="title-profile">
                <h3>User Information</h3>
            </div>
            <div className="content-form-profile">
                <div className="form-group">
                    <label>Email :</label>
                    <p>{user_email}</p>
                </div>
                <div className="form-group">
                    <label>User Name :</label>
                    <p>{user_name}</p>
                </div>

                {user_logintype ==="local"?
                <div className="form-group">
                    <label>Password:</label>
                    <h3>*********</h3>
                </div>
                :""
                }
                
                {user_logintype==="local" ?
               <div className="user-action" onClick={()=>handleClickChangePassword()}>Change Your Password</div>
                    :""
               }
                <div className="user-action" onClick={()=>handleLogoutButton()}>Log Out</div>
            </div>
                <ModalConfirmPassword 
                    show ={showModalChangePassword}
                    setShow={setShowModalChangePassword}
                    email={user_email}
                />
        </div>
       
    )
}
export default ProfileManage