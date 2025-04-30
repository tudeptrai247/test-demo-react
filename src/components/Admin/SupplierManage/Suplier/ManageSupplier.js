import { FiPlus } from "react-icons/fi";
import './ManageSupplier.scss';
import { useState } from "react";
import ModalCreateSupplier from "./ModalCreateSupplier";

const ManageSupplier = (props) =>{

    const [showModalCreateSupplier , setShowModalCreateSupplier] = useState(false)

    return(
        <div>
            <div className="manage-container">
                <div className="title">
                    Manage Supplier
                </div>
                <div className="content">
                    <div className="btn-add-new">
                        <button className="btn btn-primary" onClick={() =>{setShowModalCreateSupplier(true)}}><FiPlus />Add New Supplier</button>
                    </div>  
                    <div className="table-supplier-container">
                        <ModalCreateSupplier show ={showModalCreateSupplier}
                        setShow={setShowModalCreateSupplier}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageSupplier;