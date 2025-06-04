import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReviewOrder.scss'
import { Button } from 'react-bootstrap';
import { MdCheck } from 'react-icons/md';


const MomoReturn = () => {
  const location = useLocation();

  const [orderId ,setOrderId]=useState("")

  const navigate =useNavigate()

  useEffect(() => {

    

    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get('resultCode');
    const message = queryParams.get('message');
    const extraData = queryParams.get('extraData');

    
    if (resultCode === '0') {
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
         <p><MdCheck />Your Order Payment Success</p>
      </div>
      <h2>Thank you for your payment. Your order is now being prepared and will be shipped within 1–2 days. You can track the status of your order in the 'Purchase History' section . Your order id is {orderId}</h2>
          <Button onClick={()=>handleClickToHomePage()}>Back to homepage</Button>
    </div>
  );
};

export default MomoReturn;
