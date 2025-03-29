
import ModalCreateUser from './ModalCreateUse';
import './ManageUser.scss';
import { FiPlus } from "react-icons/fi";
import TableUser from './TableUser';
import { use, useEffect, useState } from "react"
import {getAllUser , getUserWithPaginate} from '../../../service/apiService'
import ModalUpdateUser from './ModalUpdateUser';
import ModalViewUser from './ModalViewUser';
import ModalDeleteUser from './ModalDeleteUser';
import TableUserPaginate from './TableUserPaginate';

const ManageUser =(props) =>{
    const LIMIT_USER=6;
    const [pageCount ,setPageCount] = useState(0); 

    const [showModalCreateUser ,setShowModalCreateUser] = useState(false);

    const [dataUpdate , setDataUpdate] = useState()
    const [showModalUpdateUser , setShowModalUpdateUser] = useState(false);

    const [showModalViewUser , setShowModalViewUser] = useState(false);
    
    const [listUsers ,setListUsers] = useState({})

    const [showModalDeleteUser , setShowModalDeleteUser] = useState(false);
    const [dataDelete , setDataDelete] = useState()

    useEffect(() =>{
        // fetchListUsers();
        fetchListUsersWithPaginate(1); // xem trang thu 1
   }, []);

   const fetchListUsers = async () =>{
       let res =await getAllUser();
       
       if(res.EC === 0 ){
           setListUsers(res.DT)
       }
   }

   const fetchListUsersWithPaginate = async (page) =>{
    let res =await getUserWithPaginate(page , LIMIT_USER);
    
    if(res.EC === 0 ){
        console.log('res.dt =',res.DT)
        setListUsers(res.DT.users)
        setPageCount(res.DT.totalPages)
    }
}

   const handleClickBtnUpdate =(user) =>{ //user là người dùng ấn vào sau đó state dataUpdate render lại giá trị mới
    setShowModalUpdateUser(true);
    setDataUpdate(user);
   }

   const handleClickBtnView =(user) =>{
    setShowModalViewUser(true);
    setDataUpdate(user);
   }
    
   const resertUpdateData =() =>{
    setDataUpdate("");
   }

   const handleBtnDelete =(user) =>{
        setShowModalDeleteUser(true);
        setDataDelete(user)
   }
    return(
        <div className="manage-user-container">
            <div className="title">
                    manage user
            </div>
            <div className="user-content">
            <div className='btn-add-new'>
                <button className="btn btn-primary" onClick={() =>{setShowModalCreateUser(true)}}><FiPlus />Add New User</button>
            </div>
            <div className='table-users-container'>
                {/* <TableUser 
                listUsers={listUsers}
                handleClickBtnUpdate ={handleClickBtnUpdate}
                handleClickBtnView ={handleClickBtnView}
                handleBtnDelete={handleBtnDelete}
                /> */}
                <TableUserPaginate 
                listUsers={listUsers}
                handleClickBtnUpdate ={handleClickBtnUpdate}
                handleClickBtnView ={handleClickBtnView}
                handleBtnDelete={handleBtnDelete}
                fetchListUsersWithPaginate ={fetchListUsersWithPaginate}
                pageCount={pageCount}
                />
                </div>
            <ModalCreateUser show={showModalCreateUser}
            setShow ={setShowModalCreateUser}
            fetchListUsers={fetchListUsers }
            />
            <ModalUpdateUser 
            show = {showModalUpdateUser}
            setShow ={setShowModalUpdateUser}
            dataUpdate = {dataUpdate}
            fetchListUsers={fetchListUsers }
            resertUpdateData ={resertUpdateData}
            />
            <ModalViewUser
            show = {showModalViewUser}
            setShow ={setShowModalViewUser}
            dataUpdate = {dataUpdate}
            resertUpdateData ={resertUpdateData}
            />
            </div>
            <ModalDeleteUser 
                show={showModalDeleteUser} // mở modal
                setShow={setShowModalDeleteUser} // đóng modal
                dataDelete ={dataDelete}
                fetchListUsers={fetchListUsers } // tải lại danh sách người dùng
            />
        </div>
    )
}
export default ManageUser;