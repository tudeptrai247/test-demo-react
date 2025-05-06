import { FiPlus } from "react-icons/fi";
import './ManageSupplier.scss';
import { useEffect, useState } from "react";
import ModalCreateSupplier from "./ModalCreateSupplier";
import ModalViewSupplier from "./ModalViewSupplier";
import { getSupplierWithPaginate } from "../../../../service/apiService";
import TableSupplierPaginate from "../../SupplierManage/Suplier/TableSupplierPaginate";
import ModalDeleteSupplier from "../Suplier/ModalDeleteSupplier"
import ModalUpdateSupplier from "../Suplier/ModalUpdateSupplier"

const ManageSupplier = (props) =>{

    const LIMIT_SUPPLIER =3;
    
    const [pageCount , setPageCount] = useState(0);
    const [currentPage , setCurrentPage] = useState(1);
    const [showModalCreateSupplier , setShowModalCreateSupplier] = useState(false)
    const [listSupplier,setListSupplier]=useState([]);
    const [showModalViewSupplier , setShowModalViewSupplier] =useState(false)
    const [dataUpdate , setDataUpdate] = useState() // state dùng để lưu thông tin data được chọn
    const [showModalDeleteSupplier, setShowModalDeleteSupplier]=useState(false)
    const [dataDelete , setDataDelete] = useState("")
    const [showModalUpdateSupplier , setShowModalUpdateSupplier] =useState(false)

    useEffect(() =>{
        fetchListSuppliersWithPaginate(1) //gọi trang đầu tiên khi component xuất hiện lần đầu
    }, []);

    const fetchListSuppliersWithPaginate = async(page) =>{
        let res = await getSupplierWithPaginate(page,LIMIT_SUPPLIER);
        if(res.EC==0){
            console.log('res.dt',res.DT)
            setListSupplier(res.DT.supplier)
            console.log("supplier from data" ,res.DT.supplier)
            setPageCount(res.DT.totalPages) // gán tổng trang vào pagecount , truyền props xuống con để đưa vào paginatetable
        }
    }

    const handleClickBtnView =(supplier) =>{
        setShowModalViewSupplier(true);
        setDataUpdate(supplier)
    }

    const handleClickBtnDelete =(supplier) =>{
        setShowModalDeleteSupplier(true);
        setDataDelete(supplier);
    }

    const handleClickBtnUpdate =(supplier) =>{
        setShowModalUpdateSupplier(true);
        setDataUpdate(supplier)
    }

    // dùng để xóa dữ liệu dataUpdate mỗi khi đóng lại , khi mở lại thì setData trợ lại
    const resertUpdateData =() =>{
        setDataUpdate("")
    }

    return(
        <div>
            <div className="manage-container">
                <div className="title">
                    Manage Supplier
                </div>
                <div className="content">
                    <div className="btn-add-new">
                        <button className="btn btn-primary" onClick={() =>{setShowModalCreateSupplier(true)}}><FiPlus />Add New Supplier</button>
                    </div>  
                    <div className="table-supplier-container">
                        <TableSupplierPaginate 
                        listSupplier={listSupplier}
                        fetchListSuppliersWithPaginate={fetchListSuppliersWithPaginate}
                        pageCount={pageCount}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        handleClickBtnView={handleClickBtnView}
                        handleClickBtnDelete={handleClickBtnDelete}
                        handleClickBtnUpdate={handleClickBtnUpdate}
                        />
                        <ModalCreateSupplier show ={showModalCreateSupplier}
                        setShow={setShowModalCreateSupplier}
                        fetchListSuppliersWithPaginate={fetchListSuppliersWithPaginate}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        />
                        <ModalViewSupplier 
                            show ={showModalViewSupplier}
                            setShow ={setShowModalViewSupplier}
                            dataUpdate = {dataUpdate}
                            resertUpdateData={resertUpdateData}
                        />
                        <ModalDeleteSupplier
                            show={showModalDeleteSupplier}
                            setShow={setShowModalDeleteSupplier}
                            dataDelete={dataDelete}
                            fetchListSuppliersWithPaginate={fetchListSuppliersWithPaginate}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                        <ModalUpdateSupplier 
                            show ={showModalUpdateSupplier}
                            setShow={setShowModalUpdateSupplier}
                            dataUpdate={dataUpdate}
                            fetchListSuppliersWithPaginate={fetchListSuppliersWithPaginate}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            resertUpdateData={resertUpdateData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageSupplier;