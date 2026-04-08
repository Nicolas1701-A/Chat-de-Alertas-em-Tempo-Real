// 1. CONFIGURAÇÃO (Substitua pelos dados do SEU painel do Supabase)
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_KEY = 'SUA_CHAVE_ANON_AQUI';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// Referências do HTML
const listaHTML = document.getElementById('listaDeAlertas');
// --- FUNÇÃO 1: ENVIAR (Simulando API POST) ---
async function enviarParaBanco() {
const msg = document.getElementById('campoMensagem').value;
const nivel = document.getElementById('campoNivel').value;
if (!msg) return alert("Escreva algo!");
// Grava no banco de dados
const { error } = await supabaseClient
.from('alertas')
.insert([{ mensagem: msg, nivel: nivel }]);
if (error) console.error("Erro ao enviar:", error.message);
document.getElementById('campoMensagem').value = ""; // Limpa campo
}

// --- FUNÇÃO 2: ESCUTAR (WebSocket / Real-time) ---
function ligarMonitoramento() {
supabaseClient
.channel('public:alertas') // Escuta o canal da tabela alertas
.on('postgres_changes', { event: 'INSERT', schema: 'public', table:
'alertas' }, (payload) => {
// Quando um novo dado chegar, renderiza na tela
mostrarNaTela(payload.new);
})
.subscribe();
}
// --- FUNÇÃO 3: RENDERIZAR NA TELA ---
function mostrarNaTela(alerta) {
const item = document.createElement('div');
// Cores baseadas no nível
let corDestaque = "border-primary";

if(alerta.nivel === 'critico') corDestaque = "border-danger bg-danger bg- opacity-10";

if(alerta.nivel === 'aviso') corDestaque = "border-warning bg-warning bg- opacity-10";

item.className = `list-group-item bg-dark text-white mb-2 shadow-sm
border-start border-4 ${corDestaque} animate__animated animate__fadeInLeft`;
item.innerHTML = `
<div class="d-flex justify-content-between align-items-center">
<div>
<strong class="text-uppercase small">${alerta.nivel}</strong>
<p class="mb-0">${alerta.mensagem}</p>
</div>
<small class="text-muted">${new
Date(alerta.criado_em).toLocaleTimeString()}</small>
</div>
`;
listaHTML.prepend(item); // Novo alerta sempre no topo
}
// Inicializa o WebSocket e carrega dados existentes
ligarMonitoramento();