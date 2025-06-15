import { useEffect, useState } from 'react';
import './DashBoard.scss'
import OverViewBox from './OverViewBox';
import {getOrderStatus} from "../../../service/apiService"
import BestSellingRechart from './BestSellingRechart';
import RevenueRechart from './RevenueRechart';
import PieChartOrderRate from './PiechartOrderRate'

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
                <div className='chart-dashboard'>
                    <BestSellingRechart/>
                    <RevenueRechart />
                    <PieChartOrderRate/>
                </div>
        </div>
    )
}
export default Dashboard;