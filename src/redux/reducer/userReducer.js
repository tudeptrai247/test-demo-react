import { FETCH_USER_LOGIN_SUCCESS ,FETCH_USER_LOGOUT_SUCCESS } from '../action/userAction';


const INITIAL_STATE = {
    // lưu thông tin người dùng
    account :{
        access_token: '',
        refresh_token:' ',
        username:' ',
        role:'',
        email:''
    },
    isAuthenticated: false
};
const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_LOGIN_SUCCESS:
            console.log('check action',action)
            return {
                ...state, account:{     // ban đầu state account set ở trên là rỗng , rồi set data vào state account
                    id:action?.payload?.DT?.id,
                    access_token: action?.payload?.DT?.access_token,
                    refresh_token: action?.payload?.DT?.refresh_token,
                    username: action?.payload?.DT?.username,
                    role: action?.payload?.DT?.role,
                    email: action?.payload?.DT?.email,
                    login_type :action?.payload?.DT?.login_type
                },
                isAuthenticated: true   //khi có được data rồi sẽ set authenticated là true để phần header ko hiện 2 button login register
                
            };

        case FETCH_USER_LOGOUT_SUCCESS:
            return {
                ...state, account :{
                        access_token: '',
                        refresh_token:' ',
                        username:' ',
                        role:'',
                        email:'',
                        login_type:''
                    },
                    isAuthenticated: false
            };
        default: return state;
    }
};

export default userReducer;