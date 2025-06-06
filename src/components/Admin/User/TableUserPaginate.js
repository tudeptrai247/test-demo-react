 import ReactPaginate from "react-paginate";
 import { useState , useEffect } from "react";

const TableUserPaginate = (props) =>{

    const {listUsers , pageCount} = props;
    

    const handlePageClick = (event) => {
       props.fetchListUsersWithPaginate(+event.selected +1)
       props.setCurrentPage(+event.selected +1);
        console.log(`User requested page number ${event.selected}, which is offset`);
        
      };

return(
    <>
            <table className="table table-hover table-bordered">
        <thead>
            <tr>
            <th scope="col">No</th>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {listUsers && listUsers.length>0 &&
            
            listUsers.map( (item,index) =>{
               
                return(
                    <tr key={`table-user-${index}`}>
                    <th>{item.id}</th>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>
                        <button className="btn btn-secondary" 
                        onClick={() => props.handleClickBtnView(item)}
                        >View</button>
                        <button className="btn btn-warning mx-3"
                        onClick={() => props.handleClickBtnUpdate(item)}
                        >Update</button>
                        <button className="btn btn-danger" onClick={() =>{props.handleBtnDelete(item)}}>Delete</button>
                    </td>
                    </tr>                                      
                )
            })
        }
        {listUsers && listUsers.length === 0 && 
        <tr>
            <td colSpan={'4'}>not found data</td>
            
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
         forcePage={props.currentPage -1}   
       />
        </div>
    </>
    )
}
export default TableUserPaginate