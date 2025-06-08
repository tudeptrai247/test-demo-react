import { useEffect, useState } from "react";


const OverViewBox = (props) =>{

    const {dataOrderNumber} =props
    
    console.log("data order" ,dataOrderNumber)

    return(
        <>
            <div className="over-view-box-container">  
                {dataOrderNumber.map(item =>(
                    
                    <div key={item.status}>
                        <div className="number">
                            {item.count}
                        </div>
                        <div className="label">
                            {item.status}
                        </div>
                    </div>
                ))}
               
            </div>
        </>
    )
}
export default OverViewBox