import ReactPaginate from "react-paginate"


const TableProductPaginate =(props) =>{

    const {listProduct ,pageCount} =props

    const handlePageClick=(event)=>{
        props.fetchListProductWithPaginate(+event.selected +1);
        props.setCurrentPage(+event.selected +1);
    }
    console.log("list product",listProduct)
    
    return(
        <>

        <table className="table table-hover table-bordered">
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Name Product</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Description</th>
                    <th scope="col">Image</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {listProduct && listProduct.length>0 &&
                    
                listProduct.map((item,index)=>{
                    return(
                        <tr key={`table-size-${item.id}`}>
                            <th>{item.id}</th>
                            <td>{item.name}</td>
                            <td>{item.brand}</td>
                            <td>{item.category}</td>
                            <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                            <td className="description-product">{item.description}</td>
                            <td>
                                <img 
                                src={`http://localhost:8081/uploads/${item.image}`}
                                alt="product"
                                style={{width:'100px',height:'50px'}}
                                />
                            </td>
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
                            <button className="btn btn-secondary mx-2"
                            onClick={()=>props.toogleShowHide(item.id,item.status)}
                            >
                                {item.status ===1 ? 'Hide' :'Show'}
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
export default TableProductPaginate