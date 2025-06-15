import { useEffect, useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {getRevenueMonthly} from "../../../service/apiService"

const RevenueRechart =() =>{

    const [data ,setData]=useState([])

    useEffect(()=>{
        fetchDatagetRevenueMonthly()
    },[])

    const fetchDatagetRevenueMonthly = async() =>{
            const res = await getRevenueMonthly();
            setData(res)
        }

    return(
        <div className="revenue-chart-container">
            <h3>Monthly Revenue Report</h3>
                <LineChart width={400} height={250} data={data}margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        
                </LineChart>
        </div>
    )
}
export default RevenueRechart