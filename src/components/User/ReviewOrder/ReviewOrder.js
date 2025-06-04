import { useEffect, useState } from 'react'
import './ReviewOrder.scss'
import CartItemList from './CartItemList'
import {getCartItemWithPaginate} from "../../../service/apiService"
import { Button } from 'react-bootstrap'
import { sumBy } from 'lodash'
import './ReviewOrder.scss'
import {postCreateNewOrder} from '../../../service/apiService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import {postCreateBankingPayment} from '../../../service/apiService'

const ReviewOrder =() =>{

    const [number ,setNumber]=useState("")
    const [roadName ,setRoadName] =useState("")
    const [province ,setProvince]=useState("")
    const [district ,setDistrict]=useState("")
    const [ward ,setWard]=useState("")
    const [checkedPayment ,setCheckedPayment]=useState("")
    const [note ,setNote] = useState("")

    const [listProvince ,setListProvince] =useState([])
    const [listDistrict ,setListDistrict]= useState([])
    const [listWard ,setListWard]=useState([])

    const [discountCode ,setDiscountCode]=useState("")

    const LIMIT_CARTITEM=6;
    const [listItemCart ,setListItemCart]=useState([])
    const [pageCount,setPageCount]=useState(0)
    const [currentPage,setCurrentPage]=useState(1)

    const storedAccount =localStorage.getItem("account");
    const user =JSON.parse(storedAccount)
    const user_id =user?.id;


    const navigate =useNavigate()

     // tổng tiền
     const total = sumBy(listItemCart,item => Number(item.unit_price) * Number(item.quantity))

    // useEffect để hiện tỉnh huyện 
    useEffect(()=>{  
        fetchProvince();  
       fetchListCartWithPaginate(1);

    },[total,discountCode])

    useEffect(()=>{  
            if(province)
                fetchDistrict(province)
        },[province])

    useEffect(()=>{  
            if(district)
                fetchWard(district)
        },[district])

    //useEffect hiện tổng tiền
  

    const handleChangeStatePayment =(event)=>{
        setCheckedPayment(event.target.value)
    }

    const getNameFromList=(list,code)=>{
        const found = list.find(item=>item.code === +code)
        return found?.name || "";
    }


    const fetchProvince =async() =>{
        let res = await fetch('https://provinces.open-api.vn/api/p/') 
        const data =await res.json(); //chuyển respone thành dữ liệu json
        setListProvince(data)
    }

    const fetchDistrict =async(province) =>{
        let res = await fetch(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
        const data =await res.json()
        setListDistrict(data.districts)
    }

    const fetchWard =async(district) =>{
        let res = await fetch(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
        const data =await res.json()
        setListWard(data.wards)
    }

     const fetchListCartWithPaginate = async(page)=>{
        let res = await getCartItemWithPaginate(page,LIMIT_CARTITEM,user_id)
        console.log('res item cart',res)
        if(res.EC ===0){
            setListItemCart(res.DT.cart)
            setPageCount(res.DT.totalPages)
        }
    }

    const getDiscountAmout =(code) =>{
        
        if(code==="DIS10k" && total > 500000){
            return 10000;

        }
        else if(code==="DIS20k" && total > 1000000){
            return 20000;

        }else if (code ==="DIS30k" && total > 2000000){
            return 30000;
        }
    }

   

    const discountAmout =getDiscountAmout(discountCode)
    const totalAfterDiscount =total -(discountAmout ? discountAmout :0)


    const handleOnClickCreateOrder =async() =>{
        if(!number || !roadName || !province || !district || !ward ){
            toast.error("Please Fill All Your Information")
            return
        }
        if(!checkedPayment){
            toast.error("Please Choose Your Payment Method")
            return
        }
        
        const address =`${roadName} ${getNameFromList(listWard,ward)}, ${getNameFromList(listDistrict,district)}, ${getNameFromList(listProvince,province)}`
            if(checkedPayment ==="banking"){

                let resOrder = await postCreateNewOrder(address,number,checkedPayment,totalAfterDiscount,note,user_id,listItemCart) 
                if(resOrder && resOrder.EC === 0){
                    
                const order_id = resOrder.orderId

                let res = await postCreateBankingPayment(totalAfterDiscount,user_id,order_id)
                console.log('res data', res)
                if(res && res.resultCode ===0 && res.payUrl){
                    window.location.href = res.payUrl; // chuyển sang trang MOMO
                }
            }     
            else{
                    toast.error("failed to open momo")
                }
            }else{
                //COD
                let res = await postCreateNewOrder(address,number,checkedPayment,totalAfterDiscount,note,user_id,listItemCart)      
                    if(res && res.EC === 0){
                        alert("Your Order Create Success")
                        navigate('/')
        }
            }
        
    }

    const formatVND =(price) =>{
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    }

    

    return(
        <>
            <div className="review-order-manage-container">
                <div className="title">
                    Review Order
                </div>
                <div className='review-order-content'>
                    <div className='infor-user'>
                        <div className='title-user'>
                            User Information
                        </div>
                        <div className='input-information-user'>
                             <div>
                                <label>Number :</label>
                                <input type="text" value={number} onChange={(event) =>setNumber(event.target.value)}/>
                            </div>
                            <div>
                                <label>Address :</label>
                                <input type="text" value={roadName} onChange={(event)=>setRoadName(event.target.value)}/>
                            </div>
                            <div>
                                <label>Province :</label>
                                <select value={province} onChange={(event) =>setProvince(event.target.value)}>
                                    <option value="">--Choose Province--</option>
                                    {listProvince.map((item,index)=>{
                                       return <option key={index} value={item.code}>{item.name}</option>
                                      })
                                    }
                                </select>
                            </div>
                            <div>
                                <label>District :</label>
                                <select value={district} onChange={(event) =>setDistrict(event.target.value)} disabled={!province} >
                                    <option value="">--Choose District--</option>
                                    {listDistrict.map((item,index)=>{
                                        return <option key={index} value={item.code}>{item.name}</option>
                                    })}
                                </select>
                            </div>
                            <div>
                                <label>Ward/Commune :</label>
                                <select value={ward} onChange={(event) =>setWard(event.target.value)} disabled={!district}>
                                    <option value="">--Choose Ward/Commue--</option>
                                     <option value="">--Choose Province--</option>
                                    {listWard.map((item,index)=>{
                                       return <option key={index} value={item.code}>{item.name}</option>
                                      })
                                    }
                                </select>
                            </div>
                             <div>
                                <label>Note :</label>
                                <input type="text" value={note} onChange={(event)=>setNote(event.target.value)}/>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div className='total-money'>
                        <div className='text-fill-information'>
                                <p>Please Fill Your Information</p>
                        </div>
                        <div className='payment-method'>
                            <label>Choose Your PaymentMethod</label>
                        <div className='form-input-payment'>
                            <div className='checkbox-payment'>
                                <input className='form-check-input' type='radio' value='banking' name='checkbox-payment' checked={checkedPayment ==="banking"} onChange={handleChangeStatePayment}/>
                                <label>Banking</label>
                            </div>
                            <div className='checkbox-payment'>
                                <input className='form-check-input' type='radio' value='cod' name='checkbox-payment' checked={checkedPayment ==="cod"} onChange={handleChangeStatePayment}/>
                                <label>Cod</label>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='infor-product'>
                        
                        <CartItemList 
                        fetchListCartWithPaginate={fetchListCartWithPaginate}
                        listItemCart={listItemCart}
                        pageCount={pageCount}
                        setPageCount={setPageCount}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        />
                        <div className='sub-total'>
                        <p>Sub Total  : {formatVND(total)}</p>
                        {discountAmout ? <p>Discount : {formatVND(discountAmout)}</p> :"" }
                        </div>
                        <p style={{marginTop:"10px" , fontSize:"20px"}}>Total : {formatVND(totalAfterDiscount)}</p>
                        <div className='input-code-discount'>
                            <input type='text' placeholder='Discount Code'value={discountCode} onChange={(event)=>setDiscountCode(event.target.value)}/>
                        </div>
                        
                        <Button onClick={handleOnClickCreateOrder}>Order</Button>
                    </div>
                </div>
            </div>

        </>
    )
}
export default ReviewOrder