import "./App.scss"
import Header from './components/User/Header/Header.js';
import Footer from "./components/User/Footer/Footer.js";
import { Outlet, Link } from "react-router-dom";
import { FETCH_USER_LOGIN_SUCCESS } from "./redux/action/userAction.js";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ChatBotUser from "./components/User/ChatBoxUser/ChatBoxUser.js"

const App = () => {
 
  //đọc localstorage để set Redux lại để giữ lại đăng nhập , khôi phục session
  const dispatch =useDispatch();
  useEffect(() =>{
    const storedAccount =localStorage.getItem('account');
    if(storedAccount){
      const accountData =JSON.parse(storedAccount);
      dispatch({
        type:FETCH_USER_LOGIN_SUCCESS,
        payload:{DT:accountData}
      });
    }
  }, []);

  return (
   
    <div className="app-container">
      <div className="header-container">
        <Header/>
        </div>
        <div className="main-container">
        <div className="sidenav-container"> </div>
        <div className="app-content">
            <Outlet /> 
            {/* Outlet này dùng để hiện thị những trang con của index.js */}
        </div>
      </div>
          <ChatBotUser />
      <div className="footer-container">
          <Footer />
      </div>
  
    </div>
  );
}

export default App;
