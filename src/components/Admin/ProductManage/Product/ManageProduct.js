import { FiPlus } from "react-icons/fi";
import './ManageProduct.scss'
import { useEffect, useState } from "react";
import ModalCreateProduct from "./ModalCreateProduct";
import TableProductPaginate from "./TableProductPaginate";
import { getProductWithPaginate } from "../../../../service/apiService";
import ModalDeleteProduct from "./ModalDeleteProduct";
import ModalUpdateProduct from "./ModalUpdateProduct";
import { updateShowProduct } from "../../../../service/apiService";
import { toast } from "react-toastify";


const ManageProduct =() =>{

    const LIMIT_PRODUCT =5;

    const[showModalCreateProduct,setShowModalCreateProduct]=useState(false)
    const[listProduct ,setListProduct] =useState([])
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalDeleteProduct,setShowModalDeleteProduct] =useState(false)
    const [showModalUpdateProduct,setShowModalUpdateProduct]=useState(false)
    const [dataUpdate,setDataUpdate]=useState("")

    useEffect(()=>{
        fetchListProductWithPaginate(1)
    },[])

    const fetchListProductWithPaginate =async(page) =>{
        let res = await getProductWithPaginate(page,LIMIT_PRODUCT);
        if(res.EC===0){
            console.log('res.dt',res.DT)
            setListProduct(res.DT.product)
            setPageCount(res.DT.totalPages)
        }
    }

    const handleClickBtnDelete =(product)=>{
        setShowModalDeleteProduct(true);
        setDataUpdate(product)
    }

    const handleClickBtnUpdate =(product) =>{
        setShowModalUpdateProduct(true)
        setDataUpdate(product)
        console.log('check data',product)
    }

    const dataUpdateResert=()=>{
        setDataUpdate("")
    }

    const toogleShowHide = async(id , status) =>{

        const changeStatus = status === 1 ? 0 : 1; // toán tử điều kiện , nếu status = 1 thì chuyển 0 , status =0 thì chuyển 1
        console.log('id :',id ,'status',changeStatus)
        let data = await updateShowProduct(id,changeStatus)
        if(data && data.EC=== 0){
        fetchListProductWithPaginate(currentPage)
        toast.success(data.message)
        }
       
        
    }
    

    return(
        <div className="manage-container">
            <div className="title">
                Manage Product
            </div>
            <div className="content">
                <div className="btn-add-new">
                    <button className="btn btn-primary" onClick={() =>setShowModalCreateProduct(true)}><FiPlus />Add New Product</button>  
                </div>
                <div className="table-product-container">
                    <TableProductPaginate
                        fetchListProductWithPaginate={fetchListProductWithPaginate}
                        listProduct={listProduct}
                        setListProduct={setListProduct}   
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}   
                        pageCount={pageCount}  
                        handleClickBtnDelete={handleClickBtnDelete}    
                        handleClickBtnUpdate={handleClickBtnUpdate}     
                        toogleShowHide={toogleShowHide}       
                    />
                    <ModalCreateProduct 
                        show={showModalCreateProduct}
                        setShow={setShowModalCreateProduct}
                        fetchListProductWithPaginate={fetchListProductWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                    <ModalDeleteProduct
                        show={showModalDeleteProduct}
                        setShow={setShowModalDeleteProduct}
                        dataUpdate={dataUpdate}
                        fetchListProductWithPaginate={fetchListProductWithPaginate}
                        setCurrentPage={setCurrentPage}
                    />
                   <ModalUpdateProduct
                        show={showModalUpdateProduct}
                        setShow={setShowModalUpdateProduct}
                        dataUpdate={dataUpdate}
                        fetchListProductWithPaginate={fetchListProductWithPaginate}
                        setCurrentPage={setCurrentPage}
                        dataUpdateResert={dataUpdateResert}
                   />
                </div>  
            </div>
        </div>
    )
}
export default ManageProduct