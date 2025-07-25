import { Button } from "bootstrap"
import ReactPaginate from "react-paginate"

const OrderTablePaginate =(props) =>{

    const {listOrder,pageCount,currentPage} =props

    const handlePageClick=(event)=>{
        props.fetchOrderWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1);
    }
    

    return(
        <>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>

                    </tr>
                </thead>
            
            <tbody>
                {listOrder && listOrder.length >0 &&
            
            listOrder.map((item,index)=>{
                const date = new Date(item.order_date)    
                const vietnamTime = date.toLocaleDateString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"})            
                return(
                    <tr key={`table-order-${index}`}>
                        <th>{item.order_id}</th>
                        <td>{item.address}</td>
                        <td>{item.number}</td>
                        <td>{vietnamTime}</td>
                        <td>{item.payment_method}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}</td>
                        <td>{item.status}</td>
                        <td>
                            <button className="btn btn-btn btn-warning mx-2" onClick={()=>props.handleClickOrderDetail(item)}>
                                Order Detail
                            </button>
                            <button className="btn btn-danger mx-2" onClick={() =>props.handleDeleteOrder(item)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                )
            })
            }
            {listOrder && listOrder.length ==0 &&
            <tr>
                <td colSpan={'4'}>Not Found Data</td>
            </tr>
            }
            
            </tbody>
        </table>
<div className="user-paginate">  
        <ReactPaginate
         nextLabel="next >"
         onPageChange={handlePageClick}
         pageRangeDisplayed={3}
         marginPagesDisplayed={2}
         pageCount={pageCount}
         previousLabel="< previous"
         pageClassName="page-item"
         pageLinkClassName="page-link"
         previousClassName="page-item"
         previousLinkClassName="page-link"
         nextClassName="page-item"
         nextLinkClassName="page-link"
         breakLabel="..."
         breakClassName="page-item"
         breakLinkClassName="page-link"
         containerClassName="pagination"
         activeClassName="active"
         renderOnZeroPageCount={null}
         forcePage={currentPage -1}   
       />
       </div>
        </>
    )
}
export default OrderTablePaginate