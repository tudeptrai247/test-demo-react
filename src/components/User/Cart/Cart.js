import {getCartItemWithPaginate,deleteCartItem} from "../../../service/apiService"
import TableCartPaginate from "./TableCartPaginate"
import './Cart.scss'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ModalUpdateCart from "./ModalUpdateCart"
import { Button, Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { map, sumBy } from "lodash"
import { BiPurchaseTag  } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import ModalShowRuleDiscount from "./ModalShowRuleDiscount"




const Cart =() =>{

    const LIMIT_CARTITEM=6;

    const [dataUpdate ,setDataUpdate]=useState("")
    const [listItemCart ,setListItemCart]=useState([])
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)
    const [showModalUpdateCartItem ,setShowModalUpdateCartItem]=useState(false)
    const [showModalRule ,setShowModalRule]=useState(false)
    

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
        // nếu node cron chạy thì sẽ thông báo xóa giỏ hàng và trở lại product
       
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

    const handleGoToProduct =() =>{
        navigate("/products")
    }

    const handleChangToOrderReviewPage =() =>{
        if(listItemCart.length === 0){ //listCartItem là mảng nên cần kiểm tra số lượng
            toast.error("Please Add The Product To The Cart ")
            return
        }
        navigate("/reviewOrder")
    }

    const handleCoppyDiscountCode =(code) =>{
        navigator.clipboard.writeText(code)
        .then(()=>{
            toast.success("Coppy Code Success")
        })   
    }

    const handleShowRule =()=>{
        setShowModalRule(true)
    }
    
    //sd sumby để trả về tổng tất cả sp trong giỏ hàng
    const total = sumBy(listItemCart,item =>Number(item.unit_price) * Number(item.quantity))
    console.log('cart item',listItemCart)

    return(
        <div className="cart-manage-container">
            
            <div className="cart-left">
                <div className="title">
                Cart
            </div>
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
            
            <div className="cart-right">
                <p className="title">Order Information</p>
                <p style={{color:'red'}}>Note : We will send you an email to remind you not to forget these items in the cart</p>
                <p>Total Amount :<span style={{color:'red'}}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span> đ</p>
                <div className="discount-code">
                    <h6>Get Your Discout Code</h6>
                    <Button variant="info" onClick={()=>handleCoppyDiscountCode('DIS10k')}><BiPurchaseTag />10.000 đ</Button>
                    <Button variant="info" onClick={()=>handleCoppyDiscountCode('DIS20k')}><BiPurchaseTag />20.000 đ</Button>
                    <Button variant="info" onClick={()=>handleCoppyDiscountCode('DIS30k')}><BiPurchaseTag />30.000 đ</Button>
                </div>
                 <Button variant="secondary" className="btn-rule" onClick={()=>handleShowRule()}><AiOutlineEye />Discount Rule</Button>
                
                <div className="button-cart-right">
                <Button onClick={() =>handleChangToOrderReviewPage()}> Continue To CheckOut </Button>
                <Button variant="secondary" onClick={()=>handleGoToProduct()}>Continue Shopping</Button>
                </div>
            </div>
            <ModalShowRuleDiscount
                show ={showModalRule}
                setShow ={setShowModalRule}
            />
        </div>
       
    )
}
export default Cart