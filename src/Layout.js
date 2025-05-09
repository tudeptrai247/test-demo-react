import App from './App.js';

import Admin from './components/Admin/Admin.js';
import Homepage from './components/Home/Homepage.js';
import ManageUser from './components/Admin/User/ManageUser.js';
import Dashboard from './components/Admin/User/DashBoard.js';
import Login from './components/Admin/Auth/Login.js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast , Bounce } from 'react-toastify';
import { BrowserRouter,
    Routes,
    Route
   } from "react-router-dom";
import Register from './components/Admin/Auth/Register.js';
import ManageSupplier from './components/Admin/SupplierManage/Suplier/ManageSupplier.js';
import ManageSize from './components/Admin/ProductManage/Size/ManageSize.js';
import ManageBrand from './components/Admin/ProductManage/Brand/ManageBrand.js';
import ManageCategory from './components/Admin/ProductManage/Category/ManageCategory.js';
const Layout =(props) =>{
    return(
        <div>
              <Routes>
                  <Route path="/" element={<App />}>
                  <Route index element={<Homepage />} />
                  
                  </Route>
      
                  <Route path="/admins" element={<Admin />} >
                      <Route index element={<Dashboard />} />
                      <Route path="manage-user" element={<ManageUser />}/>
                      <Route path="manage-supplier" element={<ManageSupplier />} />
                      <Route path="manage-size" element={<ManageSize />} />
                      <Route path="manage-brand" element={<ManageBrand />} />
                      <Route path="manage-category" element={<ManageCategory />} />

                  </Route>
                  
                  <Route path="login" element={<Login />}/>
                  <Route path="register" element={<Register />}/>
              </Routes>
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
export default Layout