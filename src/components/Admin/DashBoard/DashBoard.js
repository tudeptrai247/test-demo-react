import { useEffect, useState } from 'react';
import './DashBoard.scss'
import OverViewBox from './OverViewBox';
import {getOrderStatus} from "../../../service/apiService"


const Dashboard =() =>{

    const [dataOrderNumber ,setDataOrderNumber]=useState([])

    useEffect(()=>{
        fetchOrderStatus()
    },[])

    const fetchOrderStatus =async() =>{
        let res = await getOrderStatus();
        setDataOrderNumber(res)        
    }   

    return(
        <div className="dashboard-container">
            <div className="title">
                <p>Dash Board</p>
            </div>
                <OverViewBox 
                dataOrderNumber ={dataOrderNumber}
                />
        </div>
    )
}
export default Dashboard;