export const FETCH_USER_LOGIN_SUCCESS = 'FETCH_USER_LOGIN_SUCCESS'
export const FETCH_USER_LOGOUT_SUCCESS = 'FETCH_USER_LOGOUT_SUCCESS'

export const doLogin = (data) => {
    localStorage.setItem('account',JSON.stringify(data?.DT)); // lưu account vào localStorage
    return(
        {
            type:FETCH_USER_LOGIN_SUCCESS,
            payload: data
        }
    )
}

export const doLogout = () => {
    localStorage.removeItem('account')
    return(
        {
            type:FETCH_USER_LOGOUT_SUCCESS
        }
    )
}