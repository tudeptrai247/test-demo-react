import 'react-pro-sidebar/dist/css/styles.css';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
  } from 'react-pro-sidebar';

  import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
  import { DiReact } from "react-icons/di";
  import { Mdashboard} from "react-icons";
  import sidebarBg from '../../assets/bg2.jpg';
  import './Sidebar.scss';
  import { Link } from 'react-router-dom';

const Sidebar =(props) =>{
 const   { image, collapsed, toggled, handleToggleSidebar } = props;
    return(
        <>
           <ProSidebar
      image={sidebarBg}
     
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <DiReact size={"1cm"} color={"00bfff"}/>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}
            // suffix={<span className="badge red">New</span>}
          >
            Dashboard
            <Link to="/admins" />
          </MenuItem>
          {/* <MenuItem icon={<FaGem />}>components</MenuItem> */}
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
          
            icon={<FaGem />}
            title="User Management"
          >
            <MenuItem> User
            <Link to="/admins/manage-user" />
            </MenuItem>
          </SubMenu>
          
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
          
            icon={<FaGem />}
            title="Supplier Management"
          >
            <MenuItem> Supplier 
            <Link to="/admins/manage-supplier" />
            </MenuItem>
             <MenuItem> Receipt 
            <Link to="/admins/manage-receipt" />
            </MenuItem>
             <MenuItem> Receipt Delete Record 
            <Link to="/admins/manage-restore-receipt" />
            </MenuItem>

          </SubMenu>
          
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
          
            icon={<FaGem />}
            title="Product Management"
          >
            <MenuItem> Product 
            <Link to="/admins/manage-product" />
            </MenuItem>
            <MenuItem> Size 
            <Link to="/admins/manage-size" />
            </MenuItem>
            <MenuItem> Brand 
            <Link to="/admins/manage-brand" />
            </MenuItem>
            <MenuItem> Category 
            <Link to="/admins/manage-category" />
            </MenuItem>
          </SubMenu>
          
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
          
            icon={<FaGem />}
            title="Inventory Management"
          >
            <MenuItem> Inventory 
            <Link to="/admins/manage-inventory" />
            </MenuItem>
          </SubMenu>

          <SubMenu
          
            icon={<FaGem />}
            title="Manage Order"
          >
            <MenuItem> Manage Order 
            <Link to="/admins/manage-order" />
            </MenuItem>
          </SubMenu>
          
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Anh Tú
            </span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
        </>
    )
}

export default Sidebar