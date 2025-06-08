import ReactPaginate from "react-paginate"


const TableAdminOrderPaginate =(props) =>{

        const {listOrder,pageCount,currentPage} =props

         const handlePageClick=(event)=>{
        props.fetchListProductWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1);
    }

    return(
        <>
         <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                        <th scope="col">Status Payment</th>

                        <th scope="col">Action</th>

                    </tr>
                </thead>
            
            <tbody>
                {listOrder && listOrder.length >0 &&
            
            listOrder.map((item,index)=>{
                return(
                    <tr key={`table-order-${index}`}>
                        <th>{item.order_id}</th>
                        <td>{item.username}</td>
                        <td>{item.address}</td>
                        <td>{item.number}</td>
                        <td>{item.order_date}</td>
                        <td>{item.payment_method}</td>
                        <td>{item.payment_status}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}</td>
                        <td>{item.status}</td>
                        <td>
                            <button className="btn btn-btn btn-warning mx-2" onClick={()=>props.handleUpdateStatus(item)}>
                                Change Status 
                            </button> 
                             <button className="btn btn-btn btn-danger mx-2" style={{marginTop:"10px"}} onClick={()=>props.handleOrderDetail(item)}>
                                Order Detail 
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
export default TableAdminOrderPaginate