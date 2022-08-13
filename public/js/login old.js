/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts'

export const login= async (email,password)=>{

    try {
        const res= await axios({
                        method:'POST',
                        url: 'http://127.0.0.1/api/v1/player/login',
                        data:{
                            email,
                            password
                        }
        })

        if (res.data.status==='Success') {
            showAlert('success','Logged in successfuly')
            window.setTimeout(()=>{
                location.assign('/');
            },1500)
        }
    } catch (err) {
        showAlert('error',err.message)
    }
}

export const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: 'http://127.0.0.1/api/v1/player/logout'
      });
      if ((res.data.status = 'success')) {
        location.reload(true)};
    } catch (err) {

      showAlert('error', 'Error logging out! Try again.');
    }
  };
