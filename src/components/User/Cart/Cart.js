import {getCartItemWithPaginate,deleteCartItem} from "../../../service/apiService"
import TableCartPaginate from "./TableCartPaginate"
import './Cart.scss'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalUpdateCart from "./ModalUpdateCart"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const Cart =() =>{

    const LIMIT_CARTITEM=6;

    const [dataUpdate ,setDataUpdate]=useState("")
    const [listItemCart ,setListItemCart]=useState([])
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalUpdateCartItem ,setShowModalUpdateCartItem]=useState(false)

    useEffect(()=>{
        fetchListCartWithPaginate(1)
    },[])

     const storedAccount =localStorage.getItem("account");
     const user =JSON.parse(storedAccount)
    
     const user_id =user?.id;

    const navigate =useNavigate()
     

    const fetchListCartWithPaginate = async(page)=>{
        let res = await getCartItemWithPaginate(page,LIMIT_CARTITEM,user_id)
        console.log('res item cart',res)
        if(res.EC ===0){
            setListItemCart(res.DT.cart)
            setPageCount(res.DT.totalPages)
        }
    }

    const handleClickBtnDelete =async(cartItem)=>{
        let data = await deleteCartItem(cartItem.cart_detail_id, cartItem.quantity, cartItem.product_id , cartItem.size_id,)
        console.log('data delete' ,data)
        if(data && data.EC === 0){
            toast.success(data.message)
            fetchListCartWithPaginate(currentPage)
            setCurrentPage(currentPage)
        }
    }

    const handleClickBtnUpdate =(cartItem) =>{
        setShowModalUpdateCartItem(true)
        setDataUpdate(cartItem)
        console.log('item update cart item',cartItem)
    }

    const handleChangToOrderReviewPage =() =>{
        navigate("/reviewOrder")
        
    }

    return(
        <div className="manage-container">
            <div className="title">
                Cart
            </div>
            <div className="table-cart-container">
                <TableCartPaginate
                    fetchListCartWithPaginate={fetchListCartWithPaginate}
                    listItemCart={listItemCart}
                    pageCount={pageCount}
                    setPageCount={setPageCount}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handleClickBtnUpdate={handleClickBtnUpdate}
                    handleClickBtnDelete={handleClickBtnDelete}
                />
                <ModalUpdateCart
                    show={showModalUpdateCartItem}
                    setShow={setShowModalUpdateCartItem}
                    dataUpdate={dataUpdate}
                    fetchListCartWithPaginate={fetchListCartWithPaginate}
                    currentPage={currentPage}
                />
            </div>
            <div className="btn-checkout">
                <Button onClick={() =>handleChangToOrderReviewPage()}> Continue To CheckOut </Button>
            </div>
        </div>
    )
}
export default Cart