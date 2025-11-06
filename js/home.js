const btnLogout    = document.getElementById('btn_logout');
const btnInicio    = document.getElementById('btn-inicio'); 
const btnClientes  = document.getElementById('btn-cliente'); 

btnLogout.addEventListener('click', ()=>{
    window.location.href = '../backend/logout.php';
})

btnInicio.addEventListener('click', ()=>{
    window.location.reload();
})

btnClientes.addEventListener('click', ()=>{
    window.location.href = '../main/clientes.html';
})