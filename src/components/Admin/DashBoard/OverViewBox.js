import { useEffect, useState } from "react";
import { FaShippingFast, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";



const OverViewBox = (props) =>{

    const {dataOrderNumber} =props

    const allStatus =['processing','shipping','delivered','canceled']

    const navigate =useNavigate()
    
    const getStatusIcons =(status) =>{
        switch(status){
            case 'processing' : return <FaSpinner color="#1890ff"/>
            case 'shipping' : return <FaShippingFast color="#fa8c16"/>
            case 'delivered' : return <FaCheckCircle color="#52c41a"/>
            case 'canceled' : return <FaTimesCircle color="#ff4d4f"/>
            default: return null
        }
    }

    const handleOnClickToOrder =(status) =>{
        console.log(status)
        if(status ==="canceled"){
            navigate("../order-canceled")
        }else{
            navigate("../manage-order")
        }
    }
    return(
        <>
            
            <div className="over-view-box-container"> 
               
                {allStatus.map(status =>{
                    const found = dataOrderNumber.find(item =>item.status === status);
                    const count = found ? found.count : 0;
                     
                    return(  
                    <div className="status-box" key={status} onClick={()=>handleOnClickToOrder(status)}>  
                        <div className="icon-status">{getStatusIcons(status)}</div>
                        <div className="number-order">{count}</div>
                        <div className="label-order">{status}</div>
                    </div>
                    )
                })}
               </div>
        </>
    )
}
export default OverViewBox