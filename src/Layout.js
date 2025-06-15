import App from './App.js';

import Admin from './components/Admin/Admin.js';
import Homepage from './components/User/Home/Homepage.js';
import ManageUser from './components/Admin/User/ManageUser.js';
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
import ManageInventory from './components/Admin/InventoryManage/ManageInventory.js';
import Cart from './components/User/Cart/Cart.js';
import ReviewOrder from './components/User/ReviewOrder/ReviewOrder.js'
import MomoReturn from './components/User/ReviewOrder/MomoReturn.js';
import ProfileManage from './components/User/Profile/ProfileManage.js';
import Order from './components/User/OrderCustomer/Order.js'
import OrderManage from './components/Admin/OrderManage/OrderManage.js';
import TableCanceledOrder from './components/Admin/OrderManage/TableCanceledOrder.js';
import Dashboard from './components/Admin/DashBoard/DashBoard.js';
import ForgotPassword from './components/Admin/Auth/ForgotPassword/SendCodePassword.js';
import ConfirmCode from './components/Admin/Auth/ForgotPassword/ConfirmCode.js';
import NewPassword from './components/Admin/Auth/ForgotPassword/NewPassword.js';

const Layout =(props) =>{
    return(
        <div>
              <Routes>
                  <Route path="/" element={<App />}>
                  <Route index element={<Homepage />} />
                  <Route path='products' element={<Product />} />
                  <Route path="login" element={<Login />}/>
                  <Route path="register" element={<Register />}/>
                  {/* reset mật khẩu */}
                  <Route path="send-code-password" element={<ForgotPassword />}/>
                  <Route path="confirm-code" element={<ConfirmCode />}/>
                  <Route path="new-password" element={<NewPassword />}/>

                  <Route path="cart" element={<Cart />} />
                  <Route path="reviewOrder" element={<ReviewOrder />} />
                  <Route path="momo-return" element={<MomoReturn />} />
                  <Route path="profile" element={<ProfileManage />} />
                  <Route path='order' element={<Order />}/>
                  <Route path='dashboard' element={<Dashboard />}/>


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
                      <Route path='manage-inventory' element={<ManageInventory />}/>
                      <Route path='manage-order' element={<OrderManage />}/>
                      <Route path='order-canceled' element={<TableCanceledOrder />}/>
                  </Route>
                  
                 
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