function verificarSePreenchido(){
    const inputs = document.querySelectorAll('[required]');
    let todosPreenchidos = true;

    inputs.forEach(element => {
        addEventListener('input', function(){
            if(element.value == ''){
                element.classList.add('red');
                element.classList.remove('green');
            } else {
                element.classList.add('green');
                element.classList.remove('red');
            }
        });
        if(element.value == ''){
            element.classList.add('red');
            element.classList.remove('green');
            todosPreenchidos = false;
        } else {
            element.classList.add('green');
            element.classList.remove('red');
        }
    });

    return todosPreenchidos;
}

function validarCPFouCNPJ(documento) {
    const docLimpo = String(documento).replace(/[^\d]+/g, '');

    if (docLimpo.length === 11) {
        return validarCPF(docLimpo);
    } 
    
    if (docLimpo.length === 14) {
        return validarCNPJ(docLimpo);
    }

    return false;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos  = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}

function validarTelefoneBR(numero) {
    if(numero == null) return false;
  
    const regexCompleto = /^55\d{2}9\d{8}$/;
    const regexLocal = /^\d{2}9\d{8}$/;

    if (numero.length === 13) {
        return regexCompleto.test(numero);
    }

    if (numero.length === 11) {
        return regexLocal.test(numero);
    }

    return false;
}

function formatarCPFCNPJ(valor) {
    const numeros = String(valor).replace(/\D/g, '');

    if (numeros.length === 11) {
        const parte1 = numeros.slice(0, 3);
        const parte2 = numeros.slice(3, 6);
        const parte3 = numeros.slice(6, 9);
        const parte4 = numeros.slice(9, 11);

        return `${parte1}.${parte2}.${parte3}-${parte4}`;

    } else if (numeros.length === 14) {
        const parte1 = numeros.slice(0, 2);
        const parte2 = numeros.slice(2, 5);
        const parte3 = numeros.slice(5, 8);
        const parte4 = numeros.slice(8, 12);
        const parte5 = numeros.slice(12, 14);

        return `${parte1}.${parte2}.${parte3}/${parte4}-${parte5}`;
    } else {
        return valor; 
    }
}

function formatarTelefone(valor) {
    const numeros = String(valor).replace(/\D/g, '');

    if (numeros.length === 11) {
        const ddd = numeros.slice(0, 2);
        const parte1 = numeros.slice(2, 7);
        const parte2 = numeros.slice(7, 11);

        return `(${ddd}) ${parte1}-${parte2}`;

    } else if (numeros.length === 10) {
        const ddd = numeros.slice(0, 2);
        const parte1 = numeros.slice(2, 6);
        const parte2 = numeros.slice(6, 10);

        return `(${ddd}) ${parte1}-${parte2}`;
    } else {
        return valor;
    }
}

function formatarDataBR(valor){
    const data_original = String(valor).replace(/\D/g, '');

    let dia = data_original.substring(0, 2);
    let mes = data_original.substring(2, 4);
    let ano = data_original.substring(4, 8);

    if (mes < 1) mes  = 1;
    if (mes > 12) mes = 12;

    let ultimoDiaDoMes = new Date(ano, mes, 0).getDate();

    if (dia > ultimoDiaDoMes) dia = ultimoDiaDoMes;

    if (dia < 1) dia = 1;
    
    let diaFormatado = String(dia).padStart(2, '0');
    let mesFormatado = String(mes).padStart(2, '0');

    return `${diaFormatado}/${mesFormatado}/${ano}`;
}

function formatarDataUS(valor){
    const data_original = String(valor).replace(/\D/g, '');

    let dia = data_original.substring(6, 8);
    let mes = data_original.substring(4, 6);
    let ano = data_original.substring(0, 4);

    if (mes < 1) mes  = 1;
    if (mes > 12) mes = 12;

    let ultimoDiaDoMes = new Date(ano, mes, 0).getDate();

    if (dia > ultimoDiaDoMes) dia = ultimoDiaDoMes;

    if (dia < 1) dia = 1;
    
    let diaFormatado = String(dia).padStart(2, '0');
    let mesFormatado = String(mes).padStart(2, '0');

    return `${diaFormatado}/${mesFormatado}/${ano}`;
}

function pegarDateHoje(){
    var data = new Date();
    var dia  = String(data.getDate()).padStart(2, '0');
    var mes  = String(data.getMonth() + 1).padStart(2, '0');
    var ano  = data.getFullYear();

    var dataFormatada = ano + '-' + mes + '-' + dia;

    return dataFormatada;
}

function converterParaBrl(valor){
    const valorInt = parseFloat(valor);
    return valorInt.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function mostrarPopup(){
    document.body.style.overflow = 'hidden';
    popupBackground.style.display = 'flex';
}

function fecharPopup(event){
    if (event.type === 'keydown' && event.key !== 'Escape') return;

    popupBackground.style.display = 'none';
    document.body.style.overflow  = 'auto';
}