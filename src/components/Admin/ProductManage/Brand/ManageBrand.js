import { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi";
import ModalCreateBrand from "./ModalCreateBrand";
import './ManageBrand.scss'
import TableBrandPaginate from "./TableBrandPaginate";
import { getBrandWithPaginate } from "../../../../service/apiService";
import ModalDeleteBrand from "./ModalDeleteBrand"
import ModalUpdateBrand from "./ModalUpdateBrand";

const ManageBrand =() =>{

    const LIMIT_BRAND =3;

    const [dataUpdate , setDataUpdate]=useState("")
    const [currentPage ,setCurrentPage]=useState(1)
    const [listBrand,setListBrand]=useState([]);
    const [pageCount,setPageCount]=useState(0)
    const [showModalCreateBrand , setShowModalCreateBrand] = useState(false)
    const [showModalDeleteBrand , setShowModalDeleteBrand] = useState(false)
    const [showModalUpdateBrand , setShowModalUpdateBrand] = useState(false)
    useEffect(()=>{
        fetchListBrandWithPaginate(1)
    }, [])

    const fetchListBrandWithPaginate =async(page) =>{
        let res = await getBrandWithPaginate(page,LIMIT_BRAND);
        if(res.EC==0){
            console.log('res.dt',res.DT)
            setListBrand(res.DT.brand) // gán danh sách fetch api vào listsize
            console.log("supplier from data" ,res.DT.supplier)
            setPageCount(res.DT.totalPages) // gán tổng trang vào pagecount , truyền props xuống con để đưa vào paginatetable
        }
    }

    const handleClickBtnDelete =(brand) =>{
        setShowModalDeleteBrand(true)
        setDataUpdate(brand)
    }

    const handleClickBtnUpdate =(brand) =>{
        setShowModalUpdateBrand(true);
        setDataUpdate(brand)
    }

    return(
        <div className="manage-container">
            <div className="title">
                 Manage Brand
            </div>
            <div className="content">
                <div className="btn-add-new">
                    <button className="btn btn-primary" onClick={() =>{setShowModalCreateBrand(true)}}><FiPlus />Add New Brand</button>
                </div>
                <div className="table-supplier-container">
                    <TableBrandPaginate
                        fetchListBrandWithPaginate={fetchListBrandWithPaginate}
                        handleClickBtnDelete={handleClickBtnDelete}
                        handleClickBtnUpdate={handleClickBtnUpdate}
                        listBrand={listBrand}
                        pageCount={pageCount}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalCreateBrand
                        show={showModalCreateBrand}
                        setShow={setShowModalCreateBrand}
                        setCurrentPage={setCurrentPage}
                        fetchListBrandWithPaginate={fetchListBrandWithPaginate}
                    />
                    <ModalDeleteBrand 
                    show={showModalDeleteBrand}
                    setShow={setShowModalDeleteBrand}
                    dataUpdate={dataUpdate}
                    setCurrentPage={setCurrentPage}
                    fetchListBrandWithPaginate={fetchListBrandWithPaginate}
                    />
                    <ModalUpdateBrand
                        show={showModalUpdateBrand}
                        setShow={setShowModalUpdateBrand}
                        dataUpdate={dataUpdate}
                        fetchListBrandWithPaginate={fetchListBrandWithPaginate}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    )
}
export default ManageBrand