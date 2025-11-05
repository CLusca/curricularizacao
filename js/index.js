const usuario  = document.getElementById('username');
const senha    = document.getElementById('password');
const span     = document.getElementById('status');
const btnLogin = document.getElementById('btn_login');

usuario.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

btnLogin.addEventListener('click', function(){
    if(verificarSePreenchido() == true){
        if(btnLogin.disabled == true) return;

        btnLogin.disabled = true;
        btnLogin.innerHTML = `<div id="miniLoader"></div>`;

        login(`${usuario.value}-${senha.value}`);
    }
})

async function login(chave){
    try{
        const requisicao = await fetch("./backend/login.php", {
            method: 'POST',
            body: JSON.stringify(chave)
        });

        if(requisicao.ok == false){
            alert('ERRO INTERNO! TENTE NOVAMENTE MAIS TARDE');
            btnLogin.disabled = false;
            return;
        }

        const resposta = await requisicao.json();

        if(resposta.status == 200){
            btnLogin.textContent = `Verificado com Sucesso`;
            
            setTimeout(function(){
                window.location.href = "./main/home.html";
                btnLogin.textContent = `Entrar`;
                btnLogin.disabled    = false;
            }, 500);

        } else {
            btnLogin.classList.add("login_incorreto");
            btnLogin.textContent = `Usuário ou Senha Incorretos`;

            setTimeout(()=>{
                btnLogin.classList.remove("login_incorreto");
                btnLogin.textContent = `Entrar`;
                btnLogin.disabled    = false;
            }, 2000)
        }

    } catch(e){
        console.error(e);
    }
}