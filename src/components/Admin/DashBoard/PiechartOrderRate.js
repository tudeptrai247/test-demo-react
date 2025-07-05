import { useEffect, useState } from "react"
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts"
import {getOrderRate} from "../../../service/apiService"
import { values } from "lodash"


const PieChartOrderRate =(props) =>{

    const [data ,setData] =useState([])

    useEffect(()=>{
            fetchDataOrderRate()
        },[])

      const fetchDataOrderRate= async() =>{
            const res = await getOrderRate();
            console.log(res)
            const fetchData = res.map(item =>({
                name:item.status,
                value:item.count
            }))
            setData(fetchData)
        }


    const colorPie=['#82ca9d', '#ff6b6b']

    return(
        <div className="piechart-container">
            <h3>Order Rate</h3>
                <PieChart width={300} height={250}>
                        {/* name key để lấy tên theo value đó */}
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50}> 
                    {data.map((item,index) =>(
                        <Cell key={item.name} fill={colorPie[index % colorPie.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
        </PieChart>
        </div>
    )
}
export default PieChartOrderRate