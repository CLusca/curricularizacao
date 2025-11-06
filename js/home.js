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

function telaInicio() {
    document.getElementById('tituloOpcao').textContent = 'Sistema de Cobrança';

    main.innerHTML =
        `<div class="medium-box">
                <img class="dashboard-img-default" src="../assets/images/pessoas.svg" alt="">
                <div class="box-text">
                    <b>Total de Clientes</b>
                    <p>0</p>
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
                    <b>Envios Pendentes do Mês</b>
                    <p>Cobranças que precisam ser enviadas nos próximos dias</p>
                </div>
                <div class="box-text">
                </div>
            </div>`;
}

function telaClientes() {
   document.getElementById('tituloOpcao').textContent = 'Clientes'; 

   main.innerHTML = 
   `<div class="big-box">
            <div class="box-header">
                <b>Gerenciar Clientes</b>
                <p>Cadastre e gerencie seus clientes para automação de cobranças</p>
            </div>
            <div>
                <button id="btn-novo-cliente"><img src="../assets/images/plus.svg" alt=""> Novo Clientes</button>
            </div>
            <div class="box-text">
            </div>
        </div>
        <div id="popupBackground">
            <div id="popup">
                <div id="popup-header">
                    <p>
                        <b>Novo Cliente</b>
                        <br>Preencha os dados do novo cliente
                    </p>
                    <div id="closeBtn">
                        <span>&times;</span>
                    </div>
                </div>
                <div id="popupContent">
                    <label>Nome *</label>
                    <input type="text" placeholder="Digite o nome completo">
                    <label>Número de WhatsApp *</label>
                    <input type="text" placeholder="(00) 00000-0000">
                    <label>CPF / CNPJ *</label>
                    <input type="text" placeholder="00.000.000/0000-00">
                    <div id="popup-buttons">
                        <button id="popup-btn-cancelar">Cancelar</button>
                        <button id="popup-btn-adicionar">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>`;

        const btnNovoCliente   = document.getElementById('btn-novo-cliente');

        btnNovoCliente.addEventListener('click', ()=>{
            mostrarPopup();
        })

        document.getElementById('closeBtn').addEventListener('click', fecharPopup);
        document.getElementById('popup-btn-cancelar').addEventListener('click', fecharPopup);
        document.addEventListener('keydown', fecharPopup);
}

function telaAgendamentos() {
    document.getElementById('tituloOpcao').textContent = 'Agendamentos';

    main.innerHTML =
    `<div class="big-box">
            <div class="box-header">
                <b>Gerenciar Agendamentos</b>
                <p>Gerencie seus agendamentos de cobranças</p>
            </div>
            <div>
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
                    <label>Nome *</label>
                    <input type="text" placeholder="Digite o nome completo">
                    <label>Número de WhatsApp *</label>
                    <input type="text" placeholder="(00) 00000-0000">
                    <label>Data de Pagamento *</label>
                    <input type="text" placeholder="dd/mm/aaaa">
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