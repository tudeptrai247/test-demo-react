import ReactPaginate from "react-paginate"


const TableCartPaginate =(props) =>{

    const {listItemCart,pageCount}= props

    const handlePageClick=(event)=>{
        props.fetchListCartWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1);
    }

    return(
        <>
            <table className="table table-hover">
            <thead>
                <tr className="title-product-cart">
                    <th scope="col">No</th>
                    <th scope="col">Image</th>
                    <th scope="col">Name Product</th>
                    <th scope="col">Size</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {listItemCart && listItemCart.length>0 &&

                listItemCart.map((item,index)=>{
                    return(
                        <tr key={`table-cart-${index}`}>
                            <td>{index+1}</td>

                            <td> <img 
                                src={`http://localhost:8081/uploads/${item.image}`}
                                alt="product"
                                style={{width:'100px',height:'100px'}}
                                /></td>

                            <td>{item.name.length >30 ? item.name.substring(0,30) +"..." :item.name}</td>
                            <td>{item.size}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}</td>
                            <td>{item.quantity}</td>
                            <td>
                            
                            <button className="btn btn-btn btn-warning mx-2"
                            onClick={()=>props.handleClickBtnUpdate(item)}
                            >
                                Update
                            </button>
                            <button className="btn btn-danger mx-2"
                            onClick={()=>props.handleClickBtnDelete(item)}
                            >
                                Delete
                            </button>
                        </td>
                        </tr>
                    )
                })
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
         forcePage={props.currentPage -1}   
       />
        </div>
        </>
    )
}
export default TableCartPaginate