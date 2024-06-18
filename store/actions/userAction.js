import axiosInstance from 'store/axiosinstance/axiosinstance';
import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_RESET,

    VERIFY_NUMBER_FAIL,
    VERIFY_NUMBER_REQUEST,
    VERIFY_NUMBER_SUCCESS,


    USER_SEND_FAIL,
    USER_SEND_REQUEST,
    USER_SEND_SUCCESS,
    USER_SEND_RESET,

    
    AVI_RESET_FAIL,
    AVI_RESET_REQUEST,
    AVI_RESET_SUCCESS,

      
    STAFF_REMOVE_FAIL,
    STAFF_REMOVE_REQUEST,
    STAFF_REMOVE_SUCCESS,
    STAFF_REMOVE_RESET,

    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,

    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,

    USER_LIST_RESET,

    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
 
    
    ACCOUNT_DELETE_FAIL,
    ACCOUNT_DELETE_REQUEST,
    ACCOUNT_DELETE_SUCCESS,





    PASSWORD_RESET_REQUEST,
  


    
    PASSWORD_RESET_CONFIRM_REQUEST,



} from '../constants/userConstants'
import axios from 'axios'









export const forgot_password = (email) => async dispatch => {
    
    try {

        dispatch({
            type: PASSWORD_RESET_REQUEST

        })

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };


    const { data } = await axiosInstance.post(`api/users/password-reset/`, {email}, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: PASSWORD_RESET_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};


export const removeStaffAction = (user_id) => async (dispatch, getState) => {
    
    try {

        dispatch({
            type: STAFF_REMOVE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }

    const { data } = await axiosInstance.delete(`api/users/remove/${user_id}/`, config);

        dispatch({
            type: STAFF_REMOVE_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: STAFF_REMOVE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};



export const getOtpAction = () => async (dispatch, getState) => {
    
    try {

        dispatch({
            type: USER_SEND_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }



    const { data } = await axiosInstance.post(`api/users/getotp/`, 
    {},
    config);



        dispatch({
            type: USER_SEND_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: USER_SEND_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};


export const resetAvi = () => async (dispatch, getState) => {
    
    try {

        dispatch({
            type: AVI_RESET_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }



    const { data } = await axiosInstance.post(`api/users/reset/`, 
    {},
    config);



        dispatch({
            type: AVI_RESET_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: AVI_RESET_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};




export const verifyOtpAction = (otp) => async (dispatch, getState) => {
    
    try {

        dispatch({
            type: VERIFY_NUMBER_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }

    const { data } = await axiosInstance.post(`api/users/verify/`,{otp}, config);

        dispatch({
            type: VERIFY_NUMBER_SUCCESS,
            payload:data
        });
    } catch (error) {
        dispatch({
            type: VERIFY_NUMBER_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};








export const reset_password = (new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {


        dispatch({
            type: PASSWORD_RESET_CONFIRM_REQUEST

        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };


        const { data } =  await axiosInstance.patch(`/api/users/set-new-password/`, new_password, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS,
            payload:data

        });
    } catch (error) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        });
    }
};








export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
  
      const { data } = await axiosInstance.post('/api/users/login/', {
        username: email,
        password,
      }, config);
  
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
  
      // Extract user ID from login response (assuming 'id' property exists)
      const userId = data.id;
  
      // Call getUserDetails with the extracted ID
      dispatch(getUserDetails(userId));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
  


export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userPrimary')

    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_DETAILS_RESET })
    dispatch({ type: USER_LIST_RESET })


}


export const register = (
    name,
    email,
    password,
    gender,
    user_type,
    Id_number
  ) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });
  
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
  
      const userData = {
        name: name,
        email: email,
        password: password,
        gender: gender,
        user_type:user_type,
        Id_number:Id_number,

      };
  
      const { data } = await axiosInstance.post('/api/users/register/', userData, config);
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });
    dispatch(login(email , password))
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };


  export const registerStaff = (
    name,
    email,
    password,
    gender,
    user_type,
    Id_number
  ) => async (dispatch, getState) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });
  

      const {

        userLogin: { userInfo },
    } = getState()


    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization : `Bearer ${userInfo?.token}`
        }
    }

  
      const userData = {
        name: name,
        email: email,
        password: password,
        gender: gender,
        user_type:user_type,
        Id_number:Id_number,

      };
  
      const { data } = await axiosInstance.post('/api/users/register/', userData, config);
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });
  
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
  
  


export const getUserDetails = (id) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_DETAILS_REQUEST
            

        })


        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }


        const { data } = await axiosInstance.get(
            `/api/users/${id}/`,
            config
        )

        console.log("all hail me" + data)
        localStorage.setItem('userPrimary', JSON.stringify(data))


        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload:data
        })








    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}





export const updateUserProfile = (user) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }

        const { data } = await axiosInstance.put(
            `/api/users/profile/update/`,
            user,
            config
        )
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload:data
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload:data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))


    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}




export const deleteAccount = () => async(dispatch, getState) => {
    try{
        dispatch({
            type: ACCOUNT_DELETE_REQUEST

        })

        const {

            userLogin: { userInfo },
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }

        const { data } = await axiosInstance.delete(
            `/api/users/delete/`,
            config
        )
        dispatch({
            type: ACCOUNT_DELETE_SUCCESS,
            payload:data
        })

    } catch (error) {
        dispatch({
            type: ACCOUNT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}



export const updateUser = (user) => async(dispatch, getState) => {
    try{
        dispatch({
            type: USER_UPDATE_REQUEST

        })

        const {

            userLogin: { userInfo }, 
        } = getState()


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization : `Bearer ${userInfo?.token}`
            }
        }

        const { data } = await axiosInstance.put(
            `/api/users/update/${user._id}/`,
            user, 
            config
        )
        dispatch({
            type: USER_UPDATE_SUCCESS,
        })
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload:data
        })


    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}






