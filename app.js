// --- CONSTANTS ---
const ANOS_POR_NIVEL = {
    fund1: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"],
    fund2: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
    medio: ["1ª Série", "2ª Série", "3ª Série"],
    eja: ["EJA - Anos Iniciais", "EJA - Anos Finais", "EJA - Ensino Médio"]
};

const DISCIPLINAS = [
    "Artes", "Biologia", "Ciências", "Educação Física",
    "Ensino Religioso", "Filosofia", "Física", "Geografia",
    "História", "Língua Inglesa", "Língua Portuguesa",
    "LPT (Leitura e Prod. Textual)", "Matemática", "Química", "Sociologia"
];

// --- GROQ API CONFIG ---
const MODEL_CONFIG = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 1000
};

const SYSTEM_PROMPT = `Você é um consultor pedagógico sênior, especialista em Metodologias Ativas e Pensamento Crítico. Sua missão é desbloquear a criatividade de professores com ideias breves e impactantes.

Quando o usuário enviar um TEMA, DISCIPLINA e SÉRIE, você deve devolver uma resposta curta formatada em JSON com:

'titulo': Um nome cativante para a aula.

'tipo': Escolha o melhor formato (Aula Única, Sequência Didática, Projeto Interdisciplinar ou Oficina Prática).

'centelha': Um parágrafo curto (máximo 40 palavras) que comece OBRIGATORIAMENTE com a frase 'Que tal...'.

Regra de Ouro (A Sutileza): A ideia deve, sutilmente, conectar o conteúdo técnico à realidade material, social ou histórica do aluno. Evite jargões acadêmicos. Use uma linguagem convidativa, curiosa e provocadora. Faça o professor enxergar o conteúdo 'chato' sob uma nova ótica reveladora.`;

// --- STATE ---
let state = {
    apiKey: localStorage.getItem('groq_api_key') || '',
    deferredPrompt: null
};

// --- DOM ELEMENTS ---
const els = {
    inputTopico: document.getElementById('input-topico'),
    selectNivel: document.getElementById('select-nivel'),
    selectAno: document.getElementById('select-ano'),
    selectDisciplina: document.getElementById('select-disciplina'),

    btnGenerate: document.getElementById('btn-generate'),
    btnText: document.getElementById('btn-text'),
    btnLoading: document.getElementById('btn-loading'),

    formSection: document.getElementById('form-section'),
    resultSection: document.getElementById('result-section'),

    resultType: document.getElementById('result-type'),
    resultTitle: document.getElementById('result-title'),
    resultContent: document.getElementById('result-content'),

    btnReset: document.getElementById('btn-reset'),
    btnRetry: document.getElementById('btn-retry'),

    btnSettings: document.getElementById('btn-settings'),
    modalConfig: document.getElementById('modal-config'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    inputApiKey: document.getElementById('input-api-key'),
    btnSaveKey: document.getElementById('btn-save-key'),

    btnInstall: document.getElementById('btn-install'),
    btnInstallMobile: document.getElementById('btn-install-mobile')
};

// --- INITIALIZATION ---
function init() {
    populateSelects();
    updateAnos();

    // Set saved API key in input
    if (state.apiKey) {
        els.inputApiKey.value = state.apiKey;
    }

    // Event Listeners
    els.selectNivel.addEventListener('change', updateAnos);
    els.btnGenerate.addEventListener('click', handleGenerate);

    els.btnReset.addEventListener('click', resetForm);
    els.btnRetry.addEventListener('click', resetForm);

    els.btnSettings.addEventListener('click', () => toggleModal(true));
    els.btnCloseModal.addEventListener('click', () => toggleModal(false));
    els.btnSaveKey.addEventListener('click', saveApiKey);

    els.btnInstall.addEventListener('click', installPwa);
    els.btnInstallMobile.addEventListener('click', installPwa);

    // Close modal on outside click
    els.modalConfig.addEventListener('click', (e) => {
        if (e.target === els.modalConfig) toggleModal(false);
    });

    // PWA Install Event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        state.deferredPrompt = e;
        els.btnInstall.style.display = 'flex';
        els.btnInstallMobile.style.display = 'inline-flex';
    });
}

// --- LOGIC ---

function populateSelects() {
    // Populate Disciplinas
    DISCIPLINAS.forEach(disc => {
        const option = document.createElement('option');
        option.value = disc;
        option.textContent = disc;
        els.selectDisciplina.appendChild(option);
    });
}

function updateAnos() {
    const nivel = els.selectNivel.value;
    const anos = ANOS_POR_NIVEL[nivel];

    els.selectAno.innerHTML = '';
    anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        els.selectAno.appendChild(option);
    });
}

function toggleModal(show) {
    if (show) {
        els.modalConfig.classList.remove('hidden');
    } else {
        els.modalConfig.classList.add('hidden');
    }
}

function saveApiKey() {
    const key = els.inputApiKey.value.trim();
    if (key) {
        state.apiKey = key;
        localStorage.setItem('groq_api_key', key);
        toggleModal(false);
    } else {
        alert('Por favor, insira uma chave válida.');
    }
}

async function handleGenerate() {
    if (!state.apiKey) {
        toggleModal(true);
        return;
    }

    const topico = els.inputTopico.value.trim();
    const nivel = els.selectNivel.value;
    const ano = els.selectAno.value;
    const disciplina = els.selectDisciplina.value;

    if (!topico || !disciplina) {
        alert("Por favor, preencha o tema e a disciplina.");
        return;
    }

    setLoading(true);

    try {
        const result = await generateCentelhaFetch(topico, disciplina, ano, nivel);
        showResult(result);
    } catch (error) {
        console.error(error);
        alert(`Erro: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

async function generateCentelhaFetch(topico, disciplina, ano, nivel) {
    const userPrompt = `Tema: ${topico}. Disciplina: ${disciplina}. Público: ${ano} (${nivel}).`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
        },
        body: JSON.stringify({
            model: MODEL_CONFIG.model,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: MODEL_CONFIG.temperature,
            max_tokens: MODEL_CONFIG.max_tokens
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Erro na requisição à API');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        throw new Error('Resposta vazia da API');
    }

    return JSON.parse(content);
}

function showResult(result) {
    els.resultType.textContent = result.tipo;
    els.resultTitle.textContent = result.titulo;
    els.resultContent.textContent = result.centelha.replace(/Que tal\.{3}|Que tal/i, "").trim();

    els.formSection.classList.add('hidden');
    els.resultSection.classList.remove('hidden');

    // Scroll to result
    els.resultSection.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    els.resultSection.classList.add('hidden');
    els.formSection.classList.remove('hidden');
}

function setLoading(isLoading) {
    els.btnGenerate.disabled = isLoading;
    if (isLoading) {
        els.btnText.classList.add('hidden');
        els.btnLoading.classList.remove('hidden');
        els.btnLoading.style.display = 'flex';
    } else {
        els.btnText.classList.remove('hidden');
        els.btnLoading.classList.add('hidden');
        els.btnLoading.style.display = 'none';
    }
}

async function installPwa() {
    if (!state.deferredPrompt) return;

    state.deferredPrompt.prompt();
    const { outcome } = await state.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        els.btnInstall.style.display = 'none';
        els.btnInstallMobile.style.display = 'none';
    }

    state.deferredPrompt = null;
}

// --- RUN ---
init();

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW registrado:', reg))
            .catch(err => console.log('SW erro:', err));
    });
}
