import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../service/apiService';
import { toast } from 'react-toastify';
import { doLogout } from '../../redux/action/userAction';

const  Header = () => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector(state =>state.user.isAuthenticated);
  const account = useSelector(state => state.user.account)
  const dispatch = useDispatch();

  
  const handleLogin = () =>{
    navigate("/login")
  }

  const handleLogOut = async() =>{
    localStorage.clear();
    dispatch(doLogout());
    toast.success("Logout success")
    navigate("/login")
   
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink to ='/' className='navbar-brand'>Anh Tú</NavLink>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to ='/' className='nav-link'>Home</NavLink>
            <NavLink to ='users' className='nav-link'>User</NavLink>
            <NavLink to='admins' className='nav-link'>Admin</NavLink>
            
          </Nav>
          <Nav>
            {isAuthenticated === false ?
            <>
            <button className='btn-login'onClick={() => handleLogin()}>Login</button>
            <button className='btn-signup' onClick={() =>navigate('/register')}>Sign Up</button>
            </>
            :
          <NavDropdown title="Settings" id="basic-nav-dropdown">   
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() =>handleLogOut()} >Log out 
                </NavDropdown.Item>
            </NavDropdown>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;