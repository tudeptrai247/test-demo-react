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

//nhà cung cấp
const getSupplierWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/supplier?page=${page}&limit=${limit}`);
}
export {postCreateNewUser , getAllUser ,putUpdateUser ,deleteUser
    ,getUserWithPaginate ,postLogin , postRegister , logout ,
    postCreateNewSupplier , getSupplierWithPaginate , deleteSupplier ,putUpdateSupplier
}
