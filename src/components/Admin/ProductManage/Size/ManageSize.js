import { FiPlus } from "react-icons/fi";
import './ManageSize.scss'
import { useEffect, useState } from "react";
import ModalCreateSize from "./ModalCreateSize";
import TableSizePaginate from "./TableSizePaginate"
import { getSizeWithPaginate } from "../../../../service/apiService";
import ModalViewSize from "./ModalViewSize";
import ModalDeleteSize from "./ModalDeleteSize";
import ModalUpdateSize from "./ModalUpdateSize";

const ManageSize = (props) =>{

    const LIMIT_SIZE =3;
    
    const [dataUpdate , setDataUpdate] = useState("")
    const [pageCount ,setPageCount]=useState(0);
    const [listSize , setListSize]=useState([]);
    const [currentPage , setCurrentPage]=useState(1);
    const [showModalCreateSize ,setShowModalCreateSize] = useState(false)
    const [showModalViewSize , setShowModalViewSize] =useState(false)
    const [showModalDeleteSize , setShowModalDeleteSize] = useState(false)
    const [showModalUpdateSize , setShowModalUpdateSize] = useState(false)
    useEffect(() =>{
        fetchListSizeWithPaginate(1);
    },[]);
    
    const resertUpdateData =() =>{
        setDataUpdate("")
    }

    const fetchListSizeWithPaginate = async(page) =>{ //page ở đây sẽ được gọi từ component con
        let res = await getSizeWithPaginate(page,LIMIT_SIZE);
        if(res.EC==0){
            console.log('res.dt',res.DT)
            setListSize(res.DT.size) // gán danh sách fetch api vào listsize
            console.log("supplier from data" ,res.DT.supplier)
            setPageCount(res.DT.totalPages) // gán tổng trang vào pagecount , truyền props xuống con để đưa vào paginatetable
        }
    }

    const handleClickBtnView = (size) =>{
        setShowModalViewSize(true)
        setDataUpdate(size)
    }

    const handleClickBtnDelete = (size) =>{
        setShowModalDeleteSize(true)
        setDataUpdate(size)
    }

    const handleClickBtnUpdate =(size) =>{
        setShowModalUpdateSize(true)
        setDataUpdate(size)
    }

    return(
        <div className="manage-container">
            <div className="title">
            Manage Size
            </div>
            <div className="content">
                <div className="btn-add-new">
                    <button className="btn btn-primary" onClick={() =>{setShowModalCreateSize(true)}}><FiPlus />Add New Size</button>
                </div>
                <div className="table-supplier-container">
                    <TableSizePaginate
                        listSize={listSize}
                        pageCount={pageCount}
                        fetchListSizeWithPaginate={fetchListSizeWithPaginate}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        handleClickBtnView={handleClickBtnView}
                        handleClickBtnDelete ={handleClickBtnDelete}
                        handleClickBtnUpdate ={handleClickBtnUpdate}
                    />
                    <ModalCreateSize 
                        show= {showModalCreateSize}
                        setShow ={setShowModalCreateSize}
                        fetchListSizeWithPaginate={fetchListSizeWithPaginate}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalViewSize
                        show ={showModalViewSize}
                        setShow={setShowModalViewSize}
                        dataUpdate= {dataUpdate}
                        resertUpdateData ={resertUpdateData}
                    />
                    <ModalDeleteSize
                        show ={showModalDeleteSize}
                        setShow ={setShowModalDeleteSize}
                        dataUpdate={dataUpdate}
                        setCurrentPage={setCurrentPage}
                        fetchListSizeWithPaginate={fetchListSizeWithPaginate}
                    />
                    <ModalUpdateSize
                        show={showModalUpdateSize}
                        setShow={setShowModalUpdateSize}
                        dataUpdate ={dataUpdate}
                        resertUpdateData={resertUpdateData}
                        fetchListSizeWithPaginate={fetchListSizeWithPaginate}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    )
}
export default ManageSize