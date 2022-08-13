// import axios from 'axios'


const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/player/updateMyPassword'
        : '/api/v1/player/updateMe';

    const res = await fetch(url,{
      method: 'PATCH',
      body:data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 30000);
};

const login= async (email,password)=>{
    try {
        const res= await fetch('/api/v1/player/login',{
                        method:'POST',
                        headers: {
                          'Content-Type': 'application/json'
                          // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body:JSON.stringify({
                            email,
                            password
                        })
        })
        if (res.statusText==='OK') {
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
      const res = await fetch('/api/v1/player/logout',{
        method: 'GET'
      });
      if ((res.statusText==='OK')) {
        location.reload(true)};
    } catch (err) {
      showAlert('error', 'Error logging out! Try again.');
    }
  };

const postScoresForm = document.querySelector('.form-post-scores')
const loginForm = document.querySelector('.form--login');
const logOutBtn=document.querySelector('.nav__el--logout');
const saveSettingsForm=document.querySelector('.form-user-data');
const savePasswordForm=document.querySelector('.form-user-password');
const updatePasswordBtn=document.querySelector('.updatePassword');
const postScoresBtn=document.querySelector('.postScores')
const calculateBtn=document.querySelector('.calculate')

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password);
  });
}
if (calculateBtn) {
  calculateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    var startAmount=parseFloat(document.getElementById('starting-amount').value);
    if (!startAmount) startAmount=0
    var c5000 = document.getElementById('c5000').value;
    if (c5000=='') c5000=0
    var c1000 = document.getElementById('c1000').value;
    if (c1000=='') c1000=0
    var c500 = document.getElementById('c500').value;
    if (c500=='') c500=0
    var c100 = document.getElementById('c100').value;
    if (c100=='') c100=0
    var c50 = document.getElementById('c50').value;
    if (c50=='') c50=0
    var c25 = document.getElementById('c25').value;  
    if (c25=='') c25=0  
    document.getElementById('c5000').value=c5000
    document.getElementById('c1000').value=c1000
    document.getElementById('c500').value=c500
    document.getElementById('c100').value=c100
    document.getElementById('c50').value=c50
    document.getElementById('c25').value=c25
    document.getElementById('starting-amount').value=startAmount

    var endAmount=parseFloat(c5000)*5000+parseFloat(c1000)*1000+parseFloat(c500)*500+parseFloat(c100)*100+parseFloat(c50)*50+parseFloat(c25)*25
    document.getElementById('end-amount').value=endAmount
    document.getElementById('profit').value=endAmount-parseFloat(startAmount)
  })
}
if (postScoresForm) {
  postScoresForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const startAmount = document.getElementById('starting-amount').value;
    const endAmount = document.getElementById('end-amount').value;
    const profit = document.getElementById('profit').value;
    const c5000 = document.getElementById('c5000').value;
    const c1000 = document.getElementById('c1000').value;
    const c500 = document.getElementById('c500').value;
    const c100 = document.getElementById('c100').value;
    const c50 = document.getElementById('c50').value;
    const c25 = document.getElementById('c25').value;
    const quarter = document.getElementById('quarter').value;
    const date = document.getElementById('date').value;
    
    const data={
      quarter,
      date,
      startAmount,
      endAmount,
      c5000,
      c1000,
      c500,
      c100,
      c50,
      c25,
      profit
    }
    try {
      const res = await fetch('/api/v1/score',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      });

      if ((res.statusText==='Created')) {
        showAlert('success', 'Your scores were posted.')
      }
      else {
          showAlert('error',res.statusText)
        }
    } catch (err) {
      showAlert('error', 'Error Sending scores!');
    }

  });

}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
  }
if (saveSettingsForm) {
  saveSettingsForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const form=new FormData();
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('photo',document.getElementById('photo').files[0]);
    updateSettings(form,'data');
  });
}

if (savePasswordForm) {
  savePasswordForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;  
    const newPasswordConfirm = document.getElementById('password-confirm').value;  
       
    updatePasswordBtn.innerHTML='Updating...' 
    await updateSettings({password,newPassword,newPasswordConfirm},'password');
    updatePasswordBtn.innerHTML='Save password' 
    document.getElementById('password-current').value='';
    document.getElementById('password').value=''; 
    document.getElementById('password-confirm').value=''; 
  });
}
  
