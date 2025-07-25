import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReviewOrder.scss'
import { Button } from 'react-bootstrap';
import { MdCheck } from 'react-icons/md';
import { MdClose } from 'react-icons/md';


const MomoReturn = () => {
  const location = useLocation();

  const [orderId ,setOrderId]=useState("")
  const [resultCode ,setResultCode]=useState("")
  const navigate =useNavigate()

  useEffect(() => {

    

    const queryParams = new URLSearchParams(location.search);
    const resultCodeFormURL = queryParams.get('resultCode');
    setResultCode(resultCodeFormURL)
    
    const message = queryParams.get('message');
    const extraData = queryParams.get('extraData');

    
    if (resultCodeFormURL === '0') {
      // giải mã chuỗi base64 thành js
      const decodedExtraData = JSON.parse(atob(extraData));
      setOrderId(decodedExtraData.order_id)
      console.log('Payment Success:', decodedExtraData);
    } else {
      console.log('Payment Failed:', message);
    }
  }, [location.search]);

  const handleClickToHomePage =() =>{
    navigate("/")
  }
    

  return (
    <div className='momo-return'>
      <div className='title'>
         {resultCode === "0" ?
         <p style={{color:"green"}}><MdCheck />Your Order Payment Success</p> :
         <p style={{color:"red"}}><MdClose />Your Order Payment Failed</p>
         }
      </div>
      {resultCode === "0" ?
      <h2>Thank you for your payment. Your order is now being prepared and will be shipped within 1–2 days. You can track the status of your order in the 'My Order' section . Your order id is {orderId}</h2>
                        :
      <h2>Your Payment Failed , Please check your payment again</h2>                  
      }
      <Button onClick={()=>handleClickToHomePage()}>Back to homepage</Button>
    </div>
  );
};

export default MomoReturn;
