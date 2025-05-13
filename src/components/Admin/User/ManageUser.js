
import ModalCreateUser from './ModalCreateUse';
import './ManageUser.scss';
import { FiPlus } from "react-icons/fi";
import TableUser from './TableUser';
import { use, useEffect, useState } from "react"
import {getUserWithPaginate} from '../../../service/apiService'
import ModalUpdateUser from './ModalUpdateUser';
import ModalViewUser from './ModalViewUser';
import ModalDeleteUser from './ModalDeleteUser';
import TableUserPaginate from './TableUserPaginate';

const ManageUser =(props) =>{
    const LIMIT_USER=3;
    const [pageCount ,setPageCount] = useState(0); 
    const [currentPage , setCurrentPage] =useState(1)

    const [showModalCreateUser ,setShowModalCreateUser] = useState(false);

    const [dataUpdate , setDataUpdate] = useState()  //state này dùng để lưu thông tin user được chọn
    const [showModalUpdateUser , setShowModalUpdateUser] = useState(false);

    const [showModalViewUser , setShowModalViewUser] = useState(false);
    
    const [listUsers ,setListUsers] = useState([])

    const [showModalDeleteUser , setShowModalDeleteUser] = useState(false);
    const [dataDelete , setDataDelete] = useState()

    useEffect(() =>{
        // fetchListUsers();
        fetchListUsersWithPaginate(1); // xem trang thu 1
   }, []);

//    const fetchListUsers = async () =>{
//        let res =await getAllUser();
       
//        if(res.EC === 0 ){
//            setListUsers(res.DT)
//        }
//    }

   const fetchListUsersWithPaginate = async (page) =>{
    let res =await getUserWithPaginate(page , LIMIT_USER);
    if(res.EC === 0 ){
        console.log('res.dt =',res.DT)
        setListUsers(res.DT.user) // cập nhật lại khi có thêm người dùng mới
        console.log("user from data",res.DT.user)
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
        setShowModalDeleteUser(true); //khi set thành true sẽ hiện thị lên
        setDataDelete(user)
   }
    return(
        <div className="manage-container">
            <div className="title">
                    manage user
            </div>
            <div className="content">
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
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                />
                </div>
            <ModalCreateUser show={showModalCreateUser}
            setShow ={setShowModalCreateUser}
            // fetchListUsers={fetchListUsers }
            fetchListUsersWithPaginate ={fetchListUsersWithPaginate}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            />
            <ModalUpdateUser 
            show = {showModalUpdateUser}
            setShow ={setShowModalUpdateUser}
            dataUpdate = {dataUpdate}
            // fetchListUsers={fetchListUsers }
            resertUpdateData ={resertUpdateData}
            fetchListUsersWithPaginate ={fetchListUsersWithPaginate}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
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
                setShow={setShowModalDeleteUser} 
                dataDelete ={dataDelete}
                // fetchListUsers={fetchListUsers } // tải lại danh sách người dùng
                fetchListUsersWithPaginate ={fetchListUsersWithPaginate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
export default ManageUser;