'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCw, LayoutTemplate, BookOpen, GraduationCap, Settings, X, Save, Key } from 'lucide-react';

// --- TIPAGENS E CONSTANTES ---

type NivelEnsino = 'fund1' | 'fund2' | 'medio' | 'eja';

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

// Interface da resposta da IA
interface CentelhaResponse {
  titulo: string;
  tipo: string;
  centelha: string;
}

export default function Home() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CentelhaResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Estados do Formulário
  const [topico, setTopico] = useState('');
  const [nivel, setNivel] = useState<NivelEnsino>('fund2');
  const [ano, setAno] = useState(ANOS_POR_NIVEL['fund2'][0]);
  const [disciplina, setDisciplina] = useState('');

  // --- EFEITOS ---

  // Carregar API Key salva e definir ano inicial correto
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) setApiKey(savedKey);
    setAno(ANOS_POR_NIVEL[nivel][0]);
  }, [nivel]);

  // Função para salvar a chave
  const handleSaveKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setShowModal(false);
    alert("Chave salva com sucesso no navegador!");
  };

  // --- INTEGRAÇÃO COM IA ---
  const handleGenerate = async () => {
    if (!apiKey) {
      setShowModal(true);
      return;
    }
    if (!topico || !disciplina) {
      alert("Por favor, preencha o tema e a disciplina.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Prompt do Sistema (O Cérebro Crítico/Sutil)
    const systemPrompt = `Você é um assistente pedagógico criativo e sutilmente crítico. 
    Gere um JSON com 3 campos: 'titulo' (curto), 'tipo' (Aula, Projeto, Oficina) e 'centelha' (máx 40 palavras).
    A 'centelha' deve começar OBRIGATORIAMENTE com 'Que tal...' e conectar o tema à realidade social/material do aluno de forma instigante.`;

    const userPrompt = `Tema: ${topico}. Disciplina: ${disciplina}. Público: ${ano} (${nivel}).`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Ou gpt-4o-mini se preferir
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }, // Garante JSON
          temperature: 0.8
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);
      
      const content = JSON.parse(data.choices[0].message.content);
      setResult(content);

    } catch (error) {
      console.error(error);
      alert("Erro ao gerar: Verifique sua chave API ou conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 max-w-2xl mx-auto font-sans relative">
      
      {/* BOTÃO DE CONFIGURAÇÃO (ENGRENAGEM) */}
      <button 
        onClick={() => setShowModal(true)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-600 transition-colors"
        title="Configurar API Key"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* --- CABEÇALHO --- */}
      <div className="w-full mb-8 text-center space-y-3 mt-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-2 text-blue-600 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          Centelha Pedagógica
        </h1>
        <p className="text-slate-500">
          O ponto de partida para aulas inesquecíveis.
        </p>
      </div>

      {/* --- FORMULÁRIO --- */}
      {!result && (
        <div className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 space-y-6 fade-in-up">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              O que você quer ensinar?
            </label>
            <input 
              type="text" 
              value={topico}
              onChange={(e) => setTopico(e.target.value)}
              placeholder="Ex: Frações, Guerra Fria, Verbos..." 
              className="w-full p-4 rounded-xl text-lg bg-slate-50 input-modern placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                Nível de Ensino
              </label>
              <select 
                value={nivel}
                onChange={(e) => setNivel(e.target.value as NivelEnsino)}
                className="w-full p-3 rounded-xl bg-slate-50 input-modern cursor-pointer text-slate-700"
              >
                <option value="fund1">Fundamental I (1º ao 5º)</option>
                <option value="fund2">Fundamental II (6º ao 9º)</option>
                <option value="medio">Ensino Médio</option>
                <option value="eja">EJA</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Ano / Série</label>
              <select 
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 input-modern cursor-pointer text-slate-700"
              >
                {ANOS_POR_NIVEL[nivel].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Disciplina</label>
              {/* CORREÇÃO DA LINHA 136: Select controlado por value */}
              <select 
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 input-modern cursor-pointer text-slate-700"
              >
                <option value="" disabled>Selecione a matéria...</option>
                {DISCIPLINAS.map((disc) => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Acender Centelha
              </>
            )}
          </button>
        </div>
      )}

      {/* --- RESULTADO --- */}
      {result && (
        <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden fade-in-up relative">
          
          <div className="bg-blue-600 p-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <span className="relative z-10 px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider rounded-lg border border-white/30">
                {result.tipo}
              </span>
            <h2 className="relative z-10 text-2xl font-bold mt-3 leading-tight">{result.titulo}</h2>
          </div>

          <div className="p-8">
            <div className="mb-8 p-4 bg-blue-50/50 rounded-xl border-l-4 border-blue-500">
              <p className="text-slate-700 text-lg leading-relaxed font-medium">
                <span className="text-blue-600 font-bold text-xl">Que tal... </span>
                {result.centelha.replace(/Que tal\.{3}|Que tal/i, "").trim()}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* LINK EXTERNO PARA O PLANEJADOR */}
              <a 
                href="https://escolasergio4-lang.github.io/planejadorai/" 
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 group text-lg"
              >
                <LayoutTemplate className="w-5 h-5" /> 
                Criar Plano Completo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 text-slate-500 font-semibold hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Gerar Outra Ideia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIGURAÇÃO (API KEY) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" /> Configurar IA
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Para usar a Centelha, insira sua chave da OpenAI (GPT). Ela ficará salva apenas no seu dispositivo.
              </p>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">API Key (OpenAI)</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..." 
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 outline-none text-slate-800 font-mono text-sm"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSaveKey}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Salvar Chave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2026 Escola Sérgio • Apoio Docente</p>
      </footer>

    </main>
  );
}