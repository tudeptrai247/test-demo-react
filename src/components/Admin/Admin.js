import Sidebar from "./Sidebar.js"
import './Admin.scss'
import { FaBars } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { Outlet, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";


const Admin = (props) =>{

    const navigate =useNavigate()
    useEffect(()=>{
        const accountAdmin =JSON.parse(localStorage.getItem("account"))
        const role = accountAdmin?.role
        console.log("account",accountAdmin, "role",role)
        if(!accountAdmin || role === "USER"){
            toast.warning("Access Denied")
            navigate('/')
        }
    },[])
    
const [collapsed ,setCollapsed] =useState(false);
    return(
        <div className="admin-container">
                <div className="admin-sidebar">
                    <Sidebar collapsed = {collapsed}/>
                </div>
                <div className="admin-content">
                    <div className="admin-header">
                    <FaBars onClick={() =>setCollapsed(!collapsed)}/>
                    </div>
                    <div className="admin-main">
                        <Outlet />
                    </div> 

                    
                </div>
               
        </div>
    )
}
export default Admin
