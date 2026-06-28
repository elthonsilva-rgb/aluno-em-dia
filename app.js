const professores = {
  1: "Marina Alcântara",
  2: "Maria Otília",
  3: "João Paulo",
  4: "Mariana Souza",
  5: "Mário Jorge",
  6: "Antônio Pereira",
  7: "Priscila Oliveira",
  8: "Jéssica Peres",
  9: "Arthur Gonçalves"
};


// ===============================
// GERAR ALUNOS AUTOMATICAMENTE
// ===============================
let alunos = [];

function gerarAlunos(){

  const nomes = ["João","Maria","Carlos","Ana","Pedro","Lucas","Fernanda","Bruno","Larissa","Julia","Rafael","Bianca","Gabriel","Camila"];
  const sobrenomes = ["Silva","Souza","Oliveira","Pereira","Almeida","Costa","Rodrigues","Martins"];

  let ra = 1000;

  for(let ano = 1; ano <= 9; ano++){
    ["A","B"].forEach(function(turma){

      for(let i = 0; i < 10; i++){

        let nome = nomes[Math.floor(Math.random()*nomes.length)] + " " +
                   sobrenomes[Math.floor(Math.random()*sobrenomes.length)];

        alunos.push({
          nome: nome,
          ra: (ra++).toString(),
          idade: 6 + ano,
          turma: ano + "º" + turma,
          notas: Array.from({length:6}, () => Math.random()*4+6)
        });

      }
    });
  }
}
gerarAlunos();

let aluno;


// ===============================
// LOGIN / NAVEGAÇÃO
// ===============================
function login(){
  let u = document.getElementById("usuario").value;
  let s = document.getElementById("senha").value;

if(
    (u === "admin" && s === "123") ||
    (u === "ananda" && s === "123") ||
    (u === "pai" && s === "123") ||
    (s === "123456") // ✅ QUALQUER USUÁRIO
){
    
    // salva usuário digitado
    localStorage.setItem("usuario", u);
	localStorage.setItem("senha", s);
    window.location.href = "menu.html";

} else {
    document.getElementById("erro").innerText = "Usuário inválido";
}
}

function voltar(){ window.location.href="menu.html"; }
function logout(){ window.location.href="index.html"; }


// ===============================
// TURMAS
// ===============================
function carregarTurmas(){

  let nivel = document.getElementById("selectNivel").value;
  let selectTurma = document.getElementById("selectTurma");
  let selectAluno = document.getElementById("selectAluno");

  // limpa turmas
  selectTurma.innerHTML = '<option value="">--Escolha--</option>';

  // limpa alunos
  selectAluno.innerHTML = '<option value="">--Escolha--</option>';

  let inicio = nivel === "FI" ? 1 : 6;
  let fim    = nivel === "FI" ? 5 : 9;

  for(let ano = inicio; ano <= fim; ano++){
    ["A","B"].forEach(t => {
      let opt = document.createElement("option");
      opt.value = ano + t;
      opt.textContent = ano + "º Ano - " + t;
      selectTurma.appendChild(opt);
    });
  }

  // ✅ VOLTA PARA O COORDENADOR
  let img = document.getElementById("fotoProfessor");
  let legenda = document.getElementById("legendaProfessor");

  if(img){
    img.src = "coordenador.jpg";
  }

  if(legenda){
    legenda.innerHTML = `
      <b>Coordenador(a)</b><br>
      Ensino Fundamental I e II
    `;
  }
}



// ===============================
// FILTRAR ALUNOS
// ===============================
function filtrarAlunos(){

  let turmaSel = document.getElementById("selectTurma").value;
  let select = document.getElementById("selectAluno");

  select.innerHTML = '<option value="">--Escolha--</option>';

  alunos.forEach((a,i)=>{
    let turma = a.turma.replace("º","").toUpperCase();

    if(turma === turmaSel.toUpperCase()){
      let opt = document.createElement("option");
      opt.value = i;
      opt.textContent = a.nome;
      select.appendChild(opt);
    }
  });

}


// ===============================
// ATUALIZAR PROFESSOR ✅ CORRETO
// ===============================
function atualizarProfessor(){

  let turmaSelecionada = document.getElementById("selectTurma").value;
  if(!turmaSelecionada) return;

  let ano = parseInt(turmaSelecionada[0]);
  let letra = turmaSelecionada[1].toUpperCase();

  let nomeImagem = "./" + ano + letra.toLowerCase() + ".jpg";

  let img = document.getElementById("fotoProfessor");
  let legenda = document.getElementById("legendaProfessor");

  // ✅ pega nome do professor
  let nomeProfessor = professores[ano];

  if(img){
    img.src = nomeImagem;
    img.style.display = "block";

    img.onerror = function(){
      this.src = "coordenador.jpg";
    };
  }

  if(legenda){
    legenda.style.display = "block";
    legenda.innerHTML = `
      <b>Professor(a)<br>
      ${nomeProfessor}<br>
      ${ano}º Ano - ${letra}</b>
    `;
  }
}


// ===============================
// SELECIONAR ALUNO
// ===============================
function selecionarAluno(){

  let i = document.getElementById("selectAluno").value;

  document.getElementById("menuAluno").style.display="none";
  document.querySelectorAll(".areaAluno").forEach(a => a.style.display="none");

  if(i==="") return;

  aluno = alunos[i];

  // ✅ limpa dados antigos
  delete aluno.desempenho;
  delete aluno.historico;

  document.getElementById("menuAluno").style.display="block";
  mostrarPerfil();
}


// ===============================
// PERFIL
// ===============================
function mostrarPerfil(){

  let ano = parseInt(aluno.turma);
  let nivel = ano <= 5 ? "Fundamental I" : "Fundamental II";

  let media = (aluno.notas.reduce((a,b)=>a+b)/aluno.notas.length).toFixed(2);
  let status = media>=8?"Excelente":media>=6?"Regular":"Atenção";

  document.getElementById("dadosPerfil").innerHTML = `
    <b>${aluno.nome}</b><br>
    RA: ${aluno.ra}<br>
    Turma: ${aluno.turma}<br>
    Nível: ${nivel}<br>
    Frequência: ${Math.floor(Math.random()*20+60)}%<br>
    
  `;
}


// ===============================
// SUBMENU
// ===============================
function abrirAluno(area){

  document.querySelectorAll(".areaAluno").forEach(e=>e.style.display="none");
  document.getElementById(area).style.display="block";

  if(area==="desempenho") gerarDesempenho();
  if(area==="historico") gerarHistorico();
}


// ===============================
// DESEMPENHO (FIXO)
// ===============================
function gerarDesempenho(){

  const materias = ["Português","Matemática","Ciências","História","Geografia","Inglês"];

  function indicador(n){
    if(n >= 8) return "🟢";
    if(n >= 6) return "🟡";
    return "🔴";
  }

  if(!aluno.desempenho){

    aluno.desempenho = materias.map(m => {

      let n1 = (Math.random()*4+4.3).toFixed(2);
      let n2 = (Math.random()*4+4.3).toFixed(2);
      let media = ((+n1 + +n2)/2).toFixed(2);

      return {materia:m,n1,n2,media};
    });
  }

  let html = `
    <div style="display:flex; font-weight:bold; border-bottom:2px solid #000; padding:8px 0;">
      <div style="width:20%"></div>
      <div style="width:12%; text-align:center;">1ºB</div>
      <div style="width:12%; text-align:center;">2ºB</div>
      <div style="width:12%; text-align:center;">3ºB</div>
      <div style="width:12%; text-align:center;">4ºB</div>
      <div style="width:16%; text-align:center;">Média  Parceial (2026)</div>
      <div style="width:16%; text-align:center;">Indicador</div>
    </div>
  `;

  aluno.desempenho.forEach(d => {

    html += `
      <div style="display:flex; padding:8px 0; border-bottom:1px solid #ccc;">
        <div style="width:20%"><b>${d.materia}</b></div>
        <div style="width:12%; text-align:center;"><b>${d.n1}</b></div>
        <div style="width:12%; text-align:center;"><b>${d.n2}</b></div>
        <div style="width:12%; text-align:center;"><b>—</b></div>
        <div style="width:12%; text-align:center;"><b>—</b></div>
        <div style="width:16%; text-align:center;"><b>${d.media}</b></div>
        <div style="width:16%; text-align:center;"><b>${indicador(d.media)}</b></div>
      </div>
    `;
  });

  document.getElementById("resumo").innerHTML="";
  document.getElementById("listaNotas").innerHTML=html;
}


// ===============================
// HISTÓRICO (FIXO + REGRA)
// ===============================
function gerarHistorico(){

  const materias = ["Português","Matemática","Ciências","História","Geografia","Inglês"];
  let anoAtual = parseInt(aluno.turma);

  if(!aluno.historico){

    aluno.historico = [];

    for(let i = 1; i < anoAtual; i++){

      let notas=[];
      let soma=0;

      for(let j=0;j<6;j++){
        let n=(Math.random()*4+4.3).toFixed(2);
        notas.push(n);
        soma+=+n;
      }

      let media=(soma/6).toFixed(2);

      aluno.historico.push({ano:i,notas,media});
    }
  }

  let html = `<div style="font-weight:bold;margin-bottom:10px">${aluno.nome}</div>`;

  html += `<div style="display:flex;font-weight:bold;border-bottom:2px solid #000;padding:8px 0">
      <span style="flex:1">Ano</span>
      ${materias.map(m=>`<span style="flex:1;text-align:center">${m}</span>`).join("")}
      <span style="flex:1;text-align:right">Média</span>
      <span style="flex:1;text-align:right">Conselho</span>
  </div>`;

  aluno.historico.forEach(l => {

    let mediaNum = parseFloat(l.media);

    let mediaHTML = mediaNum < 6
      ? `<b><s>${l.media}</s></b>`
      : `<b>${l.media}</b>`;

    let conselho = mediaNum < 6 ? "<b>6.00</b>" : "<b>—</b>";

    html += `<div style="display:flex;border-bottom:1px solid #ccc;padding:6px 0">
      <span style="flex:1"><b>${l.ano}º</b></span>
      ${l.notas.map(n=>`<span style="flex:1;text-align:center"><b>${n}</b></span>`).join("")}
      <span style="flex:1;text-align:right">${mediaHTML}</span>
      <span style="flex:1;text-align:right">${conselho}</span>
    </div>`;
  });

  document.getElementById("historicoDados").innerHTML=html;
}

function irCadastro(){
  window.location.href = "cadastro.html";
}

function salvarAluno(){

  let nome = document.getElementById("nome").value;
  let idade = document.getElementById("idade").value;
  let email = document.getElementById("email").value;
  let ano = document.getElementById("ano").value;
  let turma = document.getElementById("turma").value;

  if(!nome || !idade || !email || !ano || !turma){
    alert("Preencha todos os campos!");
    return;
  }

  let raGerado = Math.floor(1000 + Math.random()*9000);

  const professores = {
    1: "Marina Alcântara",
    2: "Maria Otília",
    3: "João Paulo",
    4: "Mariana Souza",
    5: "Mário Jorge",
    6: "Antônio Fagundes",
    7: "Priscila Oliveira",
    8: "Jéssica Peres",
    9: "Arthur Gonçalves"
  };

  let nomeProfessor = professores[ano];

  // ✅ HTML correto (FECHADO)
  let html = `
    ✅ Aluno cadastrado com sucesso!<br><br>

    <b>Nome:</b> ${nome}<br>
    <b>Idade:</b> ${idade}<br>
    <b>E-mail:</b> ${email}<br>
    <b>Turma:</b> ${ano}º Ano - ${turma}<br>
    <b>Professor(a):</b> ${nomeProfessor}<br>
    <b>RA:</b> <span style="color:green;">${raGerado}</span><br><br>

    <b>Informações em validação.<br> Caso não haja inconcistência, o aluno estará disponível na turma em até 48h.<br>Acompanhe as devolutivas no e-mail informado.</b>
  `;

  document.getElementById("resultadoRA").innerHTML = html;

  // ✅ limpa corretamente
  document.getElementById("nome").value = "";
  document.getElementById("idade").value = "";
  document.getElementById("email").value = "";
  document.getElementById("ano").value = "";
  document.getElementById("turma").value = "";
}


function editarPerfil(){

  let novoNome = prompt("Nome:", aluno.nome);
  let novaIdade = prompt("Idade:", aluno.idade);
  let novaTurma = prompt("Turma:", aluno.turma);

  if(novoNome) aluno.nome = novoNome;
  if(novaIdade) aluno.idade = parseInt(novaIdade);
  if(novaTurma) aluno.turma = novaTurma;

  // atualiza a tela
  mostrarPerfil();
}


const videosPorMateria = {

  matematica: [
    "https://www.youtube.com/watch?v=8mAITcNt710", // frações
    "https://www.youtube.com/watch?v=Z3A3C4Y9g3k", // adição
    "https://www.youtube.com/watch?v=G0k3kHtyoqc", // subtração
    "https://www.youtube.com/watch?v=fC9GZ20U8eM", // multiplicação
    "https://www.youtube.com/watch?v=YompsDlEdtc",
    "https://www.youtube.com/watch?v=1vY2IHt9-3U",
    "https://www.youtube.com/watch?v=7d0A6dR5F-A",
    "https://www.youtube.com/watch?v=wZkkqHnL7nQ",
    "https://www.youtube.com/watch?v=3szU0E6p0E0",
    "https://www.youtube.com/watch?v=FJr8j9t0vXc"
  ],

  portugues: [
    "https://www.youtube.com/watch?v=KZ7-TgPRhUw",
    "https://www.youtube.com/watch?v=E5kY84i3n2s",
    "https://www.youtube.com/watch?v=rqX0h-9t4Xo",
    "https://www.youtube.com/watch?v=uyX2XNx6vFI",
    "https://www.youtube.com/watch?v=FihQJx4d9sA",
    "https://www.youtube.com/watch?v=Lg6k9mXG6bE",
    "https://www.youtube.com/watch?v=p1r0Bp1_SyM",
    "https://www.youtube.com/watch?v=yo0kPvPAA3g",
    "https://www.youtube.com/watch?v=4TLO4FvxCQ0",
    "https://www.youtube.com/watch?v=bU0sQd7_PsA"
  ],

  ciencias: [
    "https://www.youtube.com/watch?v=HhGz8DDvP3Q",
    "https://www.youtube.com/watch?v=Z7Cb2z7d0Wk",
    "https://www.youtube.com/watch?v=0ZLz7rL1fZk",
    "https://www.youtube.com/watch?v=5MgBikgcWnY",
    "https://www.youtube.com/watch?v=YdI4F1hXl40",
    "https://www.youtube.com/watch?v=9XWbV0G1uXU",
    "https://www.youtube.com/watch?v=hi1fNn0p1U0",
    "https://www.youtube.com/watch?v=E6p1P5M0hXU",
    "https://www.youtube.com/watch?v=2k9W6Z_Jn6U",
    "https://www.youtube.com/watch?v=U6v5cZ8iG8Y"
  ]

};
function mostrarMenuAno(ano){

  document.getElementById("conteudo").innerHTML = `
  
    <h2>${ano}º Ano</h2>

    <div style="display:flex; gap:20px; flex-wrap:wrap;">

      <div onclick="carregar(${ano})" style="
        min-width:220px;
        background:white;
        padding:20px;
        border-radius:10px;
        cursor:pointer;
      ">
        🎥 Videoaulas / Materiais
      </div>

      <div onclick="exercicios(${ano})" style="
        min-width:220px;
        background:white;
        padding:20px;
        border-radius:10px;
        cursor:pointer;
      ">
        🧠 Exercícios Interativos
      </div>

      <div onclick="simulados(${ano})" style="
        min-width:220px;
        background:white;
        padding:20px;
        border-radius:10px;
        cursor:pointer;
      ">
        📊 Simulados e Avaliações
      </div>

    </div>
  `;
}
function exercicios(ano){
  document.getElementById("conteudo").innerHTML = `
    <h2>Exercícios - ${ano}º Ano</h2>
    <p>Em desenvolvimento...</p>
  `;
}

function simulados(ano){
  document.getElementById("conteudo").innerHTML = `
    <h2>Simulados - ${ano}º Ano</h2>
    <p>Em desenvolvimento...</p>
  `;
}