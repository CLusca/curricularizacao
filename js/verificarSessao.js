verificarSessao();
async function verificarSessao(){
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    try{
        const paginasPublicas = ['/', '/index.html'];
        const paginasPrivadas = ['/main/, /opcoes/'];
        const path = window.location.pathname;
        const isPaginaPublica = paginasPublicas.some(p => path.endsWith(p));
        const isPaginaPrivada = paginasPrivadas.some(p => path.startsWith(p));

        const requisicao = await fetch('../backend/verificarSessao.php', {
            method: 'POST'
        });
        
        if(!requisicao.ok){
            alert('Não Foi Possivel Verificar Sua Sessão! Você sera Desconectado.');
            // window.location.href = '../backend/logout.php';
            return;
        }

        const resposta = await requisicao.json();
        
        if(resposta.login == true){
            if((window.parent == window) == true && isPaginaPrivada){
                window.parent.location.href = '../main/home.html';
            }
            
            window.sessaoDados = resposta;
            const evento = new CustomEvent('sessaoVerificada', { detail: resposta });
            document.dispatchEvent(evento);
        } else {
            if(resposta.login === false && !isPaginaPublica){
                window.parent.location.href = '../backend/logout.php';
            }
        }
    } catch(error){
        console.error(error);
    }
}