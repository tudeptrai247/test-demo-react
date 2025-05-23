import App from './App.js';

import Admin from './components/Admin/Admin.js';
import Homepage from './components/User/Home/Homepage.js';
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
import ManageProduct from './components/Admin/ProductManage/Product/ManageProduct.js';
import ManageReceipt from './components/Admin/SupplierManage/Receipt/ManageReceipt.js'
import ManageRestoreReceipt from './components/Admin/SupplierManage/DeleteReceiptRecord/ManageRestoreReceipt.js';
import Product from './components/User/Product/Product.js';

const Layout =(props) =>{
    return(
        <div>
              <Routes>
                  <Route path="/" element={<App />}>
                  <Route index element={<Homepage />} />
                  <Route path='/products' element={<Product />} />
                  
                  </Route>
      
                  <Route path="/admins" element={<Admin />} >
                      <Route index element={<Dashboard />} />
                      <Route path="manage-user" element={<ManageUser />}/>
                      <Route path="manage-supplier" element={<ManageSupplier />} />
                      <Route path="manage-size" element={<ManageSize />} />
                      <Route path="manage-brand" element={<ManageBrand />} />
                      <Route path="manage-category" element={<ManageCategory />} />
                      <Route path='manage-product' element={<ManageProduct />} />
                      <Route path='manage-receipt' element={<ManageReceipt />}/>
                      <Route path='manage-restore-receipt' element={<ManageRestoreReceipt />}/>
                      
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