/* Curso: Análise e Desenvolvimento de Sistemas 
    Aluno: Saulo Torres de Oliveira Assis
    Professora: Tarciana Maria de Sena Katter 
    Projeto: MarkTask - Gestão de Fluxo e Prioridades
*/

var lista = document.getElementById('lista-tarefas');
var form = document.getElementById('formulario');
var totalTxt = document.getElementById('total');

var tarefas = JSON.parse(localStorage.getItem('marktask_db')) || [];
var filtroAtual = 'todas';

function salvarNoLocal() {
    localStorage.setItem('marktask_db', JSON.stringify(tarefas));
}

function pegarDataHora() {
    var agora = new Date();
    return agora.toLocaleDateString() + " às " + agora.toLocaleTimeString();
}

function desenharTarefas() {
    lista.innerHTML = '';
    
    for (var i = 0; i < tarefas.length; i++) {
        var t = tarefas[i];

        if (filtroAtual === 'pendentes' && t.feita) continue;
        if (filtroAtual === 'concluidas' && !t.feita) continue;

        var li = document.createElement('li');
        li.className = 'item-tarefa ' + (t.feita ? 'concluido' : '');

        var textoData = t.feita ? "Concluído em: " + t.dataFim : "Criado em: " + t.dataInicio;

        li.innerHTML = `
            <div class="item-conteudo">
                <input type="checkbox" ${t.feita ? 'checked' : ''} onclick="alternar(${i})">
                <b class="badge ${t.prioridade}">${t.prioridade}</b>
                <span>${t.nome}</span>
                <button class="btn-remover" onclick="remover(${i})">x</button>
            </div>
            <div class="data-registro">${textoData}</div>
        `;
        lista.appendChild(li);
    }
    totalTxt.innerText = "Total de registros: " + tarefas.length;
}

form.onsubmit = function(event) {
    event.preventDefault();
    var novaTarefa = {
        nome: document.getElementById('entrada-tarefa').value,
        prioridade: document.getElementById('prioridade').value,
        feita: false,
        dataInicio: pegarDataHora(),
        dataFim: null
    };
    tarefas.push(novaTarefa);
    salvarNoLocal();
    form.reset();
    desenharTarefas();
};

function alternar(indice) {
    tarefas[indice].feita = !tarefas[indice].feita;
    tarefas[indice].dataFim = tarefas[indice].feita ? pegarDataHora() : null;
    salvarNoLocal();
    desenharTarefas();
}

function remover(indice) {
    tarefas.splice(indice, 1);
    salvarNoLocal();
    desenharTarefas();
}

function filtrar(tipo) {
    filtroAtual = tipo;

    var botoes = document.querySelectorAll('.filtros button');
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove('ativo');
    }

    if (tipo === 'todas') document.getElementById('btn-todas').classList.add('ativo');
    if (tipo === 'pendentes') document.getElementById('btn-pendentes').classList.add('ativo');
    if (tipo === 'concluidas') document.getElementById('btn-concluidas').classList.add('ativo');

    desenharTarefas();
}

desenharTarefas();
