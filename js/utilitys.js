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

function mostrarPopup(){
    document.body.style.overflow = 'hidden';
    popupBackground.style.display = 'flex';
}

function fecharPopup(event){
    if (event.type === 'keydown' && event.key !== 'Escape') return;

    popupBackground.style.display = 'none';
    document.body.style.overflow  = 'auto';
}