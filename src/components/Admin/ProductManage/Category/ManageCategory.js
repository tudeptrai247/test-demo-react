import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ModalCreateCategory from "./ModalCreateCategory";
import TableCategoryPaginate from "./TableCategoryPaginate";
import {getCategoryWithPaginate} from "../../../../service/apiService"
import './ManageCategory.scss'
import ModalDeleteCategory from "./ModalDeteCategory";
import ModalUpdateCategory from "./ModalUpdateCategory";

const ManageCategory =() =>{

    const LIMIT_CATEGORY=3;

    const [dataUpdate, setDataUpdate]=useState("")
    const [listCategory , setListCategory] = useState([])
    const [showModalCreateCategory , setShowModalCreateCategory] = useState(false);
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalDeleteCategory , setShowModalDeleteCategory]=useState(false)
    const [showModalUpdateCategory , setShowModalUpdateCategory] =useState(false)

    useEffect(()=>{
        fetchListCategoryWithPaginate(1)
    },[])

    const fetchListCategoryWithPaginate =async(page) =>{
        let res = await getCategoryWithPaginate(page,LIMIT_CATEGORY);
        if(res.EC==0){
            console.log('res.dt',res.DT)
            setListCategory(res.DT.category) // gán danh sách fetch api vào listsize
            setPageCount(res.DT.totalPages) // gán tổng trang vào pagecount , truyền props xuống con để đưa vào paginatetable
        }
    }

    const handleClickBtnDelete =(category)=>{
        setShowModalDeleteCategory(true);
        setDataUpdate(category)
    }

    const handleClickBtnUpdate =(category) =>{
        setShowModalUpdateCategory(true);
        setDataUpdate(category)
    }

    return(
        <div className="manage-container">
               <div className="title">
                 Manage Category
            </div>
            <div className="content">
                <div className="btn-add-new">
                    <button className="btn btn-primary" onClick={()=>setShowModalCreateCategory(true)}><FiPlus />Add New Category</button>
                </div>
                <div className="table-supplier-container">
                    <TableCategoryPaginate
                    fetchListCategoryWithPaginate={fetchListCategoryWithPaginate}
                    listCategory={listCategory}
                    pageCount={pageCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleClickBtnDelete={handleClickBtnDelete}
                    handleClickBtnUpdate={handleClickBtnUpdate}
                    />      
                    <ModalCreateCategory
                        show={showModalCreateCategory}
                        setShow={setShowModalCreateCategory }
                        fetchListCategoryWithPaginate={fetchListCategoryWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalDeleteCategory
                        dataUpdate={dataUpdate}
                        show ={showModalDeleteCategory}
                        setShow={setShowModalDeleteCategory}
                        fetchListCategoryWithPaginate={fetchListCategoryWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalUpdateCategory
                        show={showModalUpdateCategory}
                        setShow={setShowModalUpdateCategory}
                        dataUpdate={dataUpdate}
                        fetchListCategoryWithPaginate={fetchListCategoryWithPaginate}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </div>
    )
}
export default ManageCategory