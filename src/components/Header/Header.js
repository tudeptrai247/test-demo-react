import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from "react-router-dom";

const  Header = () => {
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
            <button className='btn-login'>Login</button>
            <button className='btn-signup'>Sign Up</button>
          {/* <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item >Log in</NavDropdown.Item>
                <NavDropdown.Item >Log out 
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;