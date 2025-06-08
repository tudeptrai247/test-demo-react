import axios from '../utils/axiosCustomize';

//Người dùng
const postCreateNewUser =(email , password,username,role) =>{
    return axios.post('api/v1/user',{
        email,
        password,
        username,
        role
    });
};

// const getAllUser =() =>{
//     return axios.get('api/v1/participant/all');

// }

const putUpdateUser =(id,username,role) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/user/${id}`,{
        username,
        role
    });

}

const deleteUser =(userId) =>{
    return axios.delete(`api/v1/user/${userId}`);
}


const getUserWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/user?page=${page}&limit=${limit}`);
}
//đăng nhập , đăng ký

const postLogin = (email,password)  =>{
    return axios.post(`api/v1/auth/login`,{email,password});
}

const postRegister = (username,email,password)  =>{
    return axios.post(`api/v1/auth/register`,{username,email,password});
}

const logout =(email , refresh_token) =>{
    return axios.post(`api/v1/logout`,{email,refresh_token});
}

//nhà cung cấp

const postCreateNewSupplier =(name,address,number) =>{
    return axios.post('api/v1/supplier',{
        name,
        address,
        number
    });
};

const deleteSupplier =(supplierId) =>{
    return axios.delete(`api/v1/supplier/${supplierId}`);
}

const putUpdateSupplier =(id,name,address,number) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/supplier/${id}`,{
        name,
        address,
        number
    });

}

const getSupplierWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/supplier?page=${page}&limit=${limit}`);
}

const getAllSupplier =() =>{
    return axios.get('api/v1/supplier/all');

}
//size

const getAllSize =() =>{
    return axios.get('api/v1/size/all');

}

const postCreateNewSize =(size) =>{
    return axios.post('api/v1/size',{
        size
    });
};

const getSizeWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/size?page=${page}&limit=${limit}`);
}

const deleteSize =(sizeId) =>{
    return axios.delete(`api/v1/size/${sizeId}`);
}

const putUpdateSize =(id,size) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/size/${id}`,{
        size
    });

}

//brand

const getAllBrand =() =>{
    return axios.get('api/v1/brand/all');
}

const postCreateNewBrand =(brand) =>{
    return axios.post('api/v1/brand',{
        brand
    });
};

const getBrandWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/brand?page=${page}&limit=${limit}`);
}

const deleteBrand =(brandId) =>{
    return axios.delete(`api/v1/brand/${brandId}`);
}
const putUpdateBrand =(id,brand) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/brand/${id}`,{
        brand
    });

}

//category

const getAllCategory =() =>{
    return axios.get('api/v1/category/all');

}
const postCreateNewCategory =(category) =>{
    return axios.post('api/v1/category',{
        category
    });
};

const getCategoryWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/category?page=${page}&limit=${limit}`);
}

const deleteCategory =(categoryId) =>{
    return axios.delete(`api/v1/category/${categoryId}`);
}

const putUpdateCategory =(id,category) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/category/${id}`,{
        category
    });

}

//sản phẩm
const postCreateNewProduct =(formData) =>{
    return axios.post('api/v1/product',formData,{
       headers:{
        'Content-Type':'multipart/form-data'
       }
    });
};

const getProductWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/product?page=${page}&limit=${limit}`);
}

const deleteProduct =(productId) =>{
    return axios.delete(`api/v1/product/${productId}`);
}
const putUpdateProduct =(formData) =>{  //form data ko phải là dạng json nên sẽ undefined 
    const id =formData.get('id')
    return axios.put(`api/v1/product/${id}`,formData,{
        'Content-Type': 'multipart/form-data'
    });

}

const updateShowProduct =(productId ,status) =>{
    return axios.put(`api/v1/product/${productId}/status`,{
        status
    })
}

const getAllProduct =() =>{
    return axios.get('api/v1/product/all');

}
// lấy 4 item đầu tiên
const get4product =() =>{
    return axios.get('api/v1/product/4item');
}
// lấy item nike
const getitemnike =() =>{
    return axios.get('api/v1/product/nikeitem');
}
// lấy item adidas
const getitemadidas =() =>{
    return axios.get('api/v1/product/adidasitem');
}

// lấy sản phẩm cho trang user

const getProductUserWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/product/productuser?page=${page}&limit=${limit}`);
}   

// Filter Sản Phẩm

const getProductFilter=(querryString) =>{
    return axios.get(`api/v1/product/filter?${querryString}`);
}

//tìm kiếm sản phẩm 
const getSearchProduct=(querryString) =>{
    return axios.get(`api/v1/product/search?${querryString}`);
}

// phiếu nhập

const postCreateNewReceipt =(supplier_id,note,item) =>{
    return axios.post('api/v1/receipt',{
       supplier_id,
       note,
       item
    });

};

const getReceiptWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/receipt?page=${page}&limit=${limit}`);
}

const getReceiptDetail =(receipt_id)=>{
    return axios.get(`api/v1/receipt/${receipt_id}/recieptdetail`);
}

const deleteSoftReceipt =(receiptId ,status) =>{
    return axios.put(`api/v1/receipt/${receiptId}`,{
        status
    })
}

//lịch sử xóa phiếu nhập

const getDeleteReceiptWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/restorereceipt?page=${page}&limit=${limit}`);
}

const   restoreReceipt =(receiptId ,status) =>{
    return axios.put(`api/v1/restorereceipt/${receiptId}/`,{
        status
    })
}

// lấy danh sách sản phẩm trong inventory

const getInventorytWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/inventory?page=${page}&limit=${limit}`);
}
// lấy size của sản phẩm trong inventory
const getSizeProduct =(product_id) =>{
    return axios.get(`api/v1/inventory/allsizeproduct?product_id=${product_id}`);
}

//giỏ hàng
const postCreateNewCart =(itemAdd) =>{
    return axios.post('api/v1/cart',itemAdd);
};

// lấy danh sách giỏ hàng phân trang
const getCartItemWithPaginate =(page,limit,user_id) =>{
    return axios.get(`api/v1/cart?page=${page}&limit=${limit}&user_id=${user_id}`);
}

//xóa sản phẩm trong giỏ hàng
const deleteCartItem =(cartItemId,quantity,productId,sizeId) =>{
    return axios.delete(`api/v1/cart/${cartItemId}?quantity=${quantity}&product_id=${productId}&size_id=${sizeId}`)
}

// cập nhật số lượng trong giỏ hàng
const putUpdateCartItem =(cart_detail_id,quantity,new_size_id) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/cart/${cart_detail_id}`,{
        quantity,
        new_size_id
    });

}

// Tạo Order
const postCreateNewOrder =(address,number,payment_method,total,note,user_id,item) =>{
    return axios.post('api/v1/order',{
       address,
       number,
       payment_method,
       total,
       note,
       user_id,
       item
    });
};

// tạo thanh toán vs momo
const postCreateBankingPayment =(total,user_id,order_id) =>{
    return axios.post('api/v1/momo/payment',{
      total,
      user_id,
      order_id
    });
};

//Lấy Order đã thanh toán và cod
const getOrderWithPaginate =(page,limit,user_id) =>{
    return axios.get(`api/v1/order?page=${page}&limit=${limit}&user_id=${user_id}`);
}

const deleteOrder=(orderId) =>{
    return axios.delete(`api/v1/order/${orderId}`)
}

const getOrderListAdminWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/order/adminOrderList?page=${page}&limit=${limit}`);
}

const putUpdateStatusOrder =(orderId,status) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/order/${orderId}`,{
        status
    });
}

const getOrderListAdminCanceledWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/order/adminOrderListCanceled?page=${page}&limit=${limit}`);
}

const getOrderStatus =()=>{
    return axios.get(`api/v1/dashboard/orderStatus`)
}


export {postCreateNewUser,putUpdateUser ,deleteUser
    ,getUserWithPaginate ,postLogin , postRegister , logout ,
    postCreateNewSupplier , getSupplierWithPaginate , deleteSupplier ,putUpdateSupplier,getAllSupplier,
    postCreateNewSize ,getSizeWithPaginate ,deleteSize ,putUpdateSize,getAllSize,
    postCreateNewBrand ,getBrandWithPaginate ,deleteBrand ,putUpdateBrand,getAllBrand,
    postCreateNewCategory ,getCategoryWithPaginate ,deleteCategory ,putUpdateCategory,getAllCategory,
    postCreateNewProduct,getProductWithPaginate ,deleteProduct ,putUpdateProduct ,updateShowProduct ,getAllProduct, get4product,getitemnike,getitemadidas,getProductUserWithPaginate,getProductFilter,getSearchProduct,
    postCreateNewReceipt ,getReceiptWithPaginate ,getReceiptDetail ,deleteSoftReceipt,
    getDeleteReceiptWithPaginate ,restoreReceipt,
    getInventorytWithPaginate,getSizeProduct,
    postCreateNewCart ,getCartItemWithPaginate,deleteCartItem,putUpdateCartItem,
    postCreateNewOrder ,postCreateBankingPayment ,getOrderWithPaginate ,deleteOrder ,getOrderListAdminWithPaginate ,putUpdateStatusOrder ,getOrderListAdminCanceledWithPaginate,
    getOrderStatus
    
}
