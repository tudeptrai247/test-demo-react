import axios from '../utils/axiosCustomize';

const postCreateNewUser =(email , password,username,role) =>{
    return axios.post('api/v1/user',{
        email,
        password,
        username,
        role
    });
};

const getAllUser =() =>{
    return axios.get('api/v1/participant/all');

}

const putUpdateUser =(id,username,role) =>{  //form data ko phải là dạng json nên sẽ undefined 
    return axios.put(`api/v1/user/${id}`,{
        username,
        role
    });

}

const deleteUser =(userId) =>{
    return axios.delete(`api/v1/user/${userId}`);
}
//Người dùng

const getUserWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/user?page=${page}&limit=${limit}`);
}
//Phân trang người dùng

const postLogin = (email,password)  =>{
    return axios.post(`api/v1/auth/login`,{email,password});
}

const postRegister = (username,email,password)  =>{
    return axios.post(`api/v1/auth/register`,{username,email,password});
}

const logout =(email , refresh_token) =>{
    return axios.post(`api/v1/logout`,{email,refresh_token});
}

//đăng nhập , đăng ký

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
//nhà cung cấp
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
//size
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

//brand
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
//category
export {postCreateNewUser , getAllUser ,putUpdateUser ,deleteUser
    ,getUserWithPaginate ,postLogin , postRegister , logout ,
    postCreateNewSupplier , getSupplierWithPaginate , deleteSupplier ,putUpdateSupplier,
    postCreateNewSize ,getSizeWithPaginate ,deleteSize ,putUpdateSize,
    postCreateNewBrand ,getBrandWithPaginate ,deleteBrand ,putUpdateBrand,
    postCreateNewCategory ,getCategoryWithPaginate ,deleteCategory ,putUpdateCategory
}
