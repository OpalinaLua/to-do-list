const input = document.getElementById('tarefaInput');
const btn = document.getElementById('adicionarBtn');
const lista = document.getElementById('listaTarefas');

function criarItemTarefa(texto) {
    const item = document.createElement('li');
    
    const spanTexto = document.createElement('span');
    spanTexto.textContent = texto;
    spanTexto.style.flex = '1';
    //botao remover com a funcao remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'REMOVER';
    btnRemover.className = 'btn-remover';
    
    btnRemover.addEventListener('click', () => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            lista.removeChild(item);
            salvarTarefas();
        }, 300);
    });
//Tentativa de botao status 
    const btnStatus = document.createElement('button');
    btnStatus.textContent = 'Selecionar status';
    btnStatus.className = 'btn-Status';

    btnStatus.addEventListener('click', () => {
        const statusAtual = btnStatus.textContent;
        
        if (statusAtual === 'Selecionar status') {
            btnStatus.textContent = 'Pendente';
            btnStatus.className ='emCima'
            btnStatus.style.backgroundColor = 'crimson'; 
            spanTexto.classList.remove('riscado'); 
        
        } else if (statusAtual === 'Pendente') {
            btnStatus.textContent = 'Em andamento';
            btnStatus.className ='meio'
            btnStatus.style.backgroundColor = 'orange'; 
            spanTexto.classList.remove('riscado');

        } else if (statusAtual === 'Em andamento'){
            btnStatus.textContent = 'Concluido';
            btnStatus.className ='emBaixo'
            btnStatus.style.backgroundColor = 'green'; 
            spanTexto.classList.add('riscado');

        }else {
            btnStatus.textContent = 'Pendente';
            btnStatus.className ='emCima'
            btnStatus.style.backgroundColor = 'red'; 
            spanTexto.classList.remove('riscado');
        }
        
        salvarTarefas(); 
    });
//funcoes 
    item.appendChild(spanTexto);
    item.appendChild(btnStatus);
    item.appendChild(btnRemover);
    lista.appendChild(item);
    
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.transition = 'all 0.3s ease';
    }, 10);
}

function salvarTarefas() {
    const tarefas = [];
    lista.querySelectorAll('li span').forEach(span => {
        tarefas.push(span.textContent.trim()); 
    });

    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');
    if (tarefasSalvas) {
        const tarefas = JSON.parse(tarefasSalvas);
        console.log(tarefas)
        tarefas.forEach(textoDaTarefa => {
            criarItemTarefa(textoDaTarefa);
        });
    }
}

btn.addEventListener('click', () => {
    const texto = input.value.trim();
    if (texto === "") {
        alert('Digite uma tarefa!');
        return;
    }
    criarItemTarefa(texto);
    input.value = '';
    salvarTarefas(); 
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btn.click();
    }
});
document.addEventListener('DOMContentLoaded', carregarTarefas);