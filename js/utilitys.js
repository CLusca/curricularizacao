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