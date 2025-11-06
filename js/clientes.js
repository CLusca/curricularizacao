const btnLogout        = document.getElementById('btn_logout');
const btnInicio        = document.getElementById('btn-inicio'); 
const btnClientes      = document.getElementById('btn-cliente'); 
const btnNovoCliente   = document.getElementById('btn-novo-cliente');
const popupBackground  = document.getElementById('popupBackground');
const popupContent     = document.getElementById('popupContent')

btnLogout.addEventListener('click', ()=>{
    window.location.href = '../backend/logout.php';
})

btnInicio.addEventListener('click', ()=>{
    window.location.href = '../main/home.html';
})

btnClientes.addEventListener('click', ()=>{
    window.location.reload();
})

btnNovoCliente.addEventListener('click', ()=>{
    mostrarPopup();
})

document.getElementById('closeBtn').addEventListener('click', fecharPopup);
document.getElementById('popup-btn-cancelar').addEventListener('click', fecharPopup);
document.addEventListener('keydown', fecharPopup);

function mostrarPopup(){
   document.body.style.overflow = 'hidden';
   popupBackground.style.display = 'flex';

}

function fecharPopup(event){
    if (event.type === 'keydown' && event.key !== 'Escape') return;

    popupBackground.style.display = 'none';
    document.body.style.overflow  = 'auto';
}