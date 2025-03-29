import Sidebar from "./Sidebar"
import './Admin.scss'
import { FaBars } from 'react-icons/fa';
import { useState } from "react";
import { Outlet} from "react-router-dom";
import { ToastContainer, toast , Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = (props) =>{
    
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
                <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
/>
        </div>
    )
}
export default Admin
