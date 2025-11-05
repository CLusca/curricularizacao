const btnLogout = document.getElementById('btn_logout');

btnLogout.addEventListener('click', ()=>{
    window.location.href = '../backend/logout.php';
})