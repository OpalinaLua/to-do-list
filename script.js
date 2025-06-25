const input = document.getElementById('tarefaInput');
const btn = document.getElementById('adicionarBtn');
const lista = document.getElementById('listaTarefas');

// Função para aplicar estilo conforme status
function aplicarEstiloStatus(status, btnStatus, spanTexto) {
    btnStatus.className = '';
    if (status === 'Pendente') {
        btnStatus.className = 'emCima';
        btnStatus.style.backgroundColor = 'crimson';
        spanTexto.classList.remove('riscado');
    } else if (status === 'Em andamento') {
        btnStatus.className = 'meio';
        btnStatus.style.backgroundColor = 'orange';
        spanTexto.classList.remove('riscado');
    } else if (status === 'Concluido') {
        btnStatus.className = 'emBaixo';
        btnStatus.style.backgroundColor = 'green';
        spanTexto.classList.add('riscado');
    } else {
        btnStatus.className = 'status';
        btnStatus.style.backgroundColor = 'gray';
        spanTexto.classList.remove('riscado');
    }
}

// Função para criar um item de tarefa
function criarItemTarefa(texto, statusInicial = 'Selecionar status') {
    const item = document.createElement('li');
    
    const spanTexto = document.createElement('span');
    spanTexto.textContent = texto;
    spanTexto.style.flex = '1';

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

    const btnStatus = document.createElement('button');
    btnStatus.textContent = statusInicial;
    btnStatus.className = 'btn-Status';

    aplicarEstiloStatus(statusInicial, btnStatus, spanTexto);

    btnStatus.addEventListener('click', () => {
        const statusAtual = btnStatus.textContent;

        if (statusAtual === 'Selecionar status') {
            btnStatus.textContent = 'Pendente';
        } else if (statusAtual === 'Pendente') {
            btnStatus.textContent = 'Em andamento';
        } else if (statusAtual === 'Em andamento') {
            btnStatus.textContent = 'Concluido';
        } else {
            btnStatus.textContent = 'Pendente';
        }

        aplicarEstiloStatus(btnStatus.textContent, btnStatus, spanTexto);
        salvarTarefas();
        organizarListaPorStatus();
    });

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

// Salvar tarefas (texto + status)
function salvarTarefas() {
    const tarefas = [];
    lista.querySelectorAll('li').forEach(item => {
        const span = item.querySelector('span');
        const botaoStatus = item.querySelector('button');

        tarefas.push({
            texto: span.textContent.trim(),
            status: botaoStatus.textContent
        });
    });

    const tarefasJSON = JSON.stringify(tarefas);
    console.log('Salvando tarefas no localStorage:', tarefasJSON);  // <-- Aqui!
    localStorage.setItem('minhasTarefas', tarefasJSON);
}

// Carregar tarefas com status
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('minhasTarefas');
    if (tarefasSalvas) {
        const tarefas = JSON.parse(tarefasSalvas);
        tarefas.forEach(({ texto, status }) => {
            criarItemTarefa(texto, status);
        });
        organizarListaPorStatus();
    }
}

// Organizar lista conforme status
function organizarListaPorStatus() {
    const itens = Array.from(lista.children);

    itens.sort((a, b) => {
        const statusA = a.querySelector('button').textContent;
        const statusB = b.querySelector('button').textContent;

        const ordem = {
            "Selecionar status": 0,
            "Pendente": 1,
            "Em andamento": 2,
            "Concluido": 3
        };

        return (ordem[statusA] ?? 99) - (ordem[statusB] ?? 99);
    });

    itens.forEach(item => lista.appendChild(item));
}

// Adicionar nova tarefa via botão
btn.addEventListener('click', () => {
    const texto = input.value.trim();
    if (texto === "") {
        alert('Digite uma tarefa!');
        return;
    }
    criarItemTarefa(texto);
    input.value = '';
    salvarTarefas();
    organizarListaPorStatus();
});

// Adicionar nova tarefa via Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btn.click();
    }
});

// Carregar tarefas ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
});
