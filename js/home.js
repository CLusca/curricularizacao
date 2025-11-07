const btnLogout       = document.getElementById('btn_logout');
const btnInicio       = document.getElementById('btn-inicio'); 
const btnClientes     = document.getElementById('btn-cliente'); 
const btnAgendamentos = document.getElementById('btn-agendamentos'); 
const btnDisparos     = document.getElementById('btn-disparos'); 
const main            = document.getElementById('main');

telaInicio();

btnLogout.addEventListener('click', ()=>{
    window.location.href = '../backend/logout.php';
})

btnInicio.addEventListener('click', ()=>{
    telaInicio();
})

btnClientes.addEventListener('click', ()=>{
    telaClientes();
})

btnAgendamentos.addEventListener('click', ()=>{
    telaAgendamentos();
})

btnDisparos.addEventListener('click', ()=>{
    telaDisparos();
})

function telaInicio() {
    document.getElementById('tituloOpcao').textContent = 'Sistema de Cobrança';
    document.title = "Inicio - Sistema de Cobrança";

    main.innerHTML =
        `<div class="medium-box">
                <img class="dashboard-img-default" src="../assets/images/pessoas.svg" alt="">
                <div class="box-text">
                    <b>Total de Clientes</b>
                    <p id="inicio-total-clientes">0</p>
                </div>
            </div>
            <div class="medium-box">
                <img class="dashboard-img-orange" src="../assets/images/relogio.svg" alt="">
                <div class="box-text">
                    <b>Envios Pendentes</b>
                    <p>0</p>
                </div>
            </div>
            <div class="medium-box">
                <img class="dashboard-img-green" src="../assets/images/dolar.svg" alt="">
                <div class="box-text">
                    <b>Valor Pendente</b>
                    <p>R$ 0,00</p>
                </div>
            </div>
            <div class="medium-box">
                <img class="dashboard-img-default" src="../assets/images/calendario.svg" alt="">
                <div class="box-text">
                    <b>Envios Hoje</b>
                    <p>0</p>
                </div>
            </div>
            <div class="big-box">
                <div class="box-header">
                    <p>
                        <b>Envios Pendentes do Mês</b>
                        <br>
                        Cobranças que precisam ser enviadas nos próximos dias
                    </p>
                </div>
                <div class="box-text">
                </div>
            </div>`;
    
    dashboard();
}

function telaClientes() {
    document.getElementById('tituloOpcao').textContent = 'Clientes'; 
    document.title = "Clientes - Sistema de Cobrança";

    main.innerHTML = 
        `<div class="big-box">
            <div class="box-header">
                <p>
                    <b>Gerenciar Clientes</b>
                    <br>
                    Cadastre e gerencie seus clientes para automação de cobranças
                </p>
                <button id="btn-novo-cliente"><img src="../assets/images/plus.svg" alt=""> Novo Clientes</button>
            </div>
            <div class="box-text">
                <table id="tabelaClientes">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>CNPJ/CPF</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div id="popupBackground">
            <div id="popup">
                <div id="popup-header">
                    <p>
                        <b>Novo Cliente</b>
                        <br>
                        Preencha os dados do novo cliente
                    </p>
                    <div id="closeBtn">
                        <span>&times;</span>
                    </div>
                </div>
                <div id="popupContent">
                    <label>Nome *</label>
                    <input id="input-nome" type="text" placeholder="Digite o nome completo" required>
                    <label>Número de WhatsApp *</label>
                    <input id="input-telefone" type="text" placeholder="(00) 00000-0000" required>
                    <label>CPF / CNPJ *</label>
                    <input id="input-cnpj_cpf" type="text" placeholder="00.000.000/0000-00" required>
                    <div id="popup-buttons">
                        <button id="popup-btn-cancelar">Cancelar</button>
                        <button id="popup-btn-adicionar">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>`;

        mostrarClientes();

        const btnNovoCliente = document.getElementById('btn-novo-cliente');
        const btnAdicionar   = document.getElementById('popup-btn-adicionar');  

        btnNovoCliente.addEventListener('click', ()=>{
            mostrarPopup();
        })

        document.getElementById('closeBtn').addEventListener('click', fecharPopup);
        document.getElementById('popup-btn-cancelar').addEventListener('click', fecharPopup);
        document.addEventListener('keydown', fecharPopup);

        btnAdicionar.addEventListener('click', ()=>{
            if(verificarSePreenchido() == true){
                const nome     = document.getElementById('input-nome').value;
                const telefone = document.getElementById('input-telefone').value.replace(/[^\d]+/g, '');
                const cnpj_cpf = document.getElementById('input-cnpj_cpf').value.replace(/[^\d]+/g, '');

                const chave = {
                    'nome' : nome,
                    'telefone' : telefone,
                    'cnpj_cpf' : cnpj_cpf
                    
                }

                if(!validarTelefoneBR(telefone)){
                    alert('Número Inválido!');
                    return;
                }

                if(!validarCPFouCNPJ(cnpj_cpf)){
                    alert('CPF/CNPJ Inválido!');
                    return;
                }

                salvarCliente(chave);
           }
       })
}

function telaAgendamentos() {
    document.getElementById('tituloOpcao').textContent = 'Agendamentos';
    document.title = "Agendamentos - Sistema de Cobrança";

    main.innerHTML =
    `<div class="big-box">
            <div class="box-header">
                <p>
                    <b>Gerenciar Agendamentos</b>
                    <br>
                    Gerencie seus disparos de cobranças
                </p>
                <button id="btn-novo-agendamento"><img src="../assets/images/plus.svg" alt=""> Novo Agendamento</button>
            </div>
            <div class="box-text">
            </div>
        </div>
        <div id="popupBackground">
            <div id="popup">
                <div id="popup-header">
                    <p>
                        <b>Novo Agendamento</b>
                        <br>Preencha os dados do novo agendamento
                    </p>
                    <div id="closeBtn">
                        <span>&times;</span>
                    </div>
                </div>
                <div id="popupContent">
                    <label>Cliente *</label>
                    <select name="agendamento-cliente" id="agendamento-cliente" class="cadSelectInfos" required>
                        <option value="">Selecione um cliente</option>
                    </select>
                    <label>Data de Pagamento *</label>
                    <input type="text" placeholder="dd/mm/aaaa">
                    <label>Meses *</label>
                    <input type="text" placeholder="0">
                    <label>Valor a ser Pago *</label>
                    <input type="text" placeholder="R$ 0,00">
                    <div id="popup-buttons">
                        <button id="popup-btn-cancelar">Cancelar</button>
                        <button id="popup-btn-adicionar">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>`;

        const btnNovoAgendamento = document.getElementById('btn-novo-agendamento');

        btnNovoAgendamento.addEventListener('click', ()=>{
            mostrarPopup();
        })

        document.getElementById('closeBtn').addEventListener('click', fecharPopup);
        document.getElementById('popup-btn-cancelar').addEventListener('click', fecharPopup);
        document.addEventListener('keydown', fecharPopup);
}

function telaDisparos() {
    document.getElementById('tituloOpcao').textContent = 'Disparos';
    document.title = "Disparos - Sistema de Cobrança";

    main.innerHTML =
    `<div class="big-box">
            <div class="box-header">
                <p>
                    <b>Gerenciar Disparos</b>
                    <br>
                    Gerencie seus disparos de cobranças
                </p>
            </div>
            <div class="box-text">
            </div>
        </div>
        <div id="popupBackground">
            <div id="popup">
                <div id="popup-header">
                    <p>
                        <b>Novo Agendamento</b>
                        <br>
                        Preencha os dados do novo agendamento
                    </p>
                    <div id="closeBtn">
                        <span>&times;</span>
                    </div>
                </div>
                <div id="popupContent">
                    <label>Cliente *</label>
                    <select name="agendamento-cliente" id="agendamento-cliente" class="cadSelectInfos" required>
                        <option value="">Selecione um cliente</option>
                    </select>
                    <label>Data de Pagamento *</label>
                    <input type="text" placeholder="dd/mm/aaaa">
                    <label>Meses *</label>
                    <input type="text" placeholder="0">
                    <label>Valor a ser Pago *</label>
                    <input type="text" placeholder="R$ 0,00">
                    <div id="popup-buttons">
                        <button id="popup-btn-cancelar">Cancelar</button>
                        <button id="popup-btn-adicionar">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>`;

        const btnNovoAgendamento = document.getElementById('btn-novo-agendamento');

        btnNovoAgendamento.addEventListener('click', ()=>{
            mostrarPopup();
        })

        document.getElementById('closeBtn').addEventListener('click', fecharPopup);
        document.getElementById('popup-btn-cancelar').addEventListener('click', fecharPopup);
        document.addEventListener('keydown', fecharPopup);
}

async function dashboard() {
    try{
        const requisicao = await fetch('../backend/dashboard.php',{
            method: 'POST',
            body: JSON.stringify()
        });

        if(requisicao.ok == false){
            alert('ERRO INTERNO! TENTE NOVAMENTE MAIS TARDE');
            return;
        }

        const resposta = await requisicao.json();
        
        if(resposta.status != 200){
            alert('Erro');
            return;
        }

        console.log(resposta);

        const totalClientes = document.getElementById('inicio-total-clientes');
        totalClientes.textContent = resposta.clientes;

        // const tabela = document.getElementById('tabelaClientes');

        // for (var i = 0; i < resposta.clientes.length; i++) {
        //     var cliente = resposta.clientes[i];
        //     var row = document.createElement('tr');
        //     console.log(cliente);

        //     row.innerHTML =
        //         `<td>${cliente.nome}</td>
        //         <td>${formatarTelefone(cliente.telefone)}</td>
        //         <td>${formatarCPFCNPJ(cliente.cnpj_cpf)}</td>`;
        //     tabela.appendChild(row);
        // }
        
    } catch(e){
        console.error(e);
    }
    }

    async function mostrarClientes(){
    try{
        const requisicao = await fetch('../backend/clientes.php',{
            method: 'POST',
            body: JSON.stringify()
        });

        if(requisicao.ok == false){
            alert('ERRO INTERNO! TENTE NOVAMENTE MAIS TARDE');
            return;
        }

        const resposta = await requisicao.json();
        
        if(resposta.status != 200){
            alert('Erro');
            return;
        }


        const tabela = document.getElementById('tabelaClientes');

        for (var i = 0; i < resposta.clientes.length; i++) {
            var cliente = resposta.clientes[i];
            var row = document.createElement('tr');
            console.log(cliente);

            row.innerHTML =
                `<td>${cliente.nome}</td>
                <td>${formatarTelefone(cliente.telefone)}</td>
                <td>${formatarCPFCNPJ(cliente.cnpj_cpf)}</td>`;
            tabela.appendChild(row);
        }
        
    } catch(e){
        console.error(e);
    }
    }

    async function salvarCliente(chave){
    try{
        const requisicao = await fetch('../backend/salvarCliente.php',{
            method: 'POST',
            body: JSON.stringify(chave)
        });

        if(requisicao.ok == false){
            alert('ERRO INTERNO! TENTE NOVAMENTE MAIS TARDE');
            return;
        }

        const resposta = await requisicao.json();
        
        if(resposta.status == 200){
            alert('Cliente gravado com sucesso!');
            return;
        }
        
    } catch(e){
        console.error(e);
    }
}