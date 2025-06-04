import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"

const CartItemList =(props) =>{

    const {listItemCart}= props

    return(
        <>
            <div className="cart-list-scrool">
                {listItemCart && listItemCart.length>0 && listItemCart.map((item,index)=>
                    (
                        <div key={`table-cart-${index}`} className="cart-item">
                            <img 
                                src={`http://localhost:8081/uploads/${item.image}`}
                                alt="product"
                                />
                                <div className="badge-quantity" >x{item.quantity}</div>
                                
                            <div className="cart-item-infor"> 
                                {/* lớn hơn 30 ký tự thì ... */}
                                <p>{item.name.length >30 ? item.name.substring(0,30) +"..." :item.name}</p>
                                <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}</p>                        
                            </div>
                        </div>
                      )  
                    )
                }
                
            </div>
        </>
    )
}
export default CartItemList