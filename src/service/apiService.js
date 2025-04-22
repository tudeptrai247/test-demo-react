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

const putUpdateUser =(id,username,role,image) =>{
    const data = new FormData();
    data.append('id', id);
    data.append('username', username);
    data.append('role', role);
    data.append('userImage', image);
    return axios.put('api/v1/participant', data);

}

const deleteUser =(userId) =>{
    return axios.delete('api/v1/participant',{data :{id: userId} });
}

const getUserWithPaginate =(page,limit) =>{
    return axios.get(`api/v1/user?page=${page}&limit=${limit}`);
}

const postLogin = (email,password)  =>{
    return axios.post(`api/v1/login`,{email,password});
}

const postRegister = (username,email,password)  =>{
    return axios.post(`api/v1/register`,{username,email,password});
}

const logout =(email , refresh_token) =>{
    return axios.post(`api/v1/logout`,{email,refresh_token});
}

export {postCreateNewUser , getAllUser ,putUpdateUser ,deleteUser
    ,getUserWithPaginate ,postLogin , postRegister , logout
}
