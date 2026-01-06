'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCw, LayoutTemplate, BookOpen, GraduationCap, Settings, X, Save, Key } from 'lucide-react';
import { groqService, type CentelhaResponse } from '../lib/groq-service';

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
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) setApiKey(savedKey);
    setAno(ANOS_POR_NIVEL[nivel][0]);
  }, [nivel]);

  // Função para salvar a chave
  const handleSaveKey = () => {
    localStorage.setItem('groq_api_key', apiKey);
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

    try {
      // Configurar a chave API no serviço
      groqService.setApiKey(apiKey);
      
      // Gerar centelha usando o serviço
      const result = await groqService.generateCentelha(topico, disciplina, ano, nivel);
      setResult(result);

    } catch (error) {
      console.error(error);
      alert("Erro ao gerar: Verifique sua chave API ou conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto font-sans relative">
      
      {/* BOTÃO DE CONFIGURAÇÃO (ENGRENAGEM) */}
      <button 
        onClick={() => setShowModal(true)}
        className="absolute top-6 right-6 p-3 text-slate-400 hover:text-blue-600 transition-all hover:bg-white/50 rounded-xl"
        title="Configurar API Key"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* --- CABEÇALHO --- */}
      <div className="w-full mb-12 text-center space-y-4 mt-8">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mb-4 text-white shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
          Centelha Pedagógica
        </h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          O ponto de partida para aulas inesquecíveis e transformadoras.
        </p>
      </div>

      {/* --- FORMULÁRIO --- */}
      {!result && (
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 space-y-8 fade-in-up">
          
          <div className="space-y-3">
            <label className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              O que você quer ensinar?
            </label>
            <input 
              type="text" 
              value={topico}
              onChange={(e) => setTopico(e.target.value)}
              placeholder="Ex: Frações, Guerra Fria, Verbos, Fotossíntese..." 
              className="w-full p-5 rounded-2xl text-xl bg-slate-50/50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-lg font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                Nível de Ensino
              </label>
              <select 
                value={nivel}
                onChange={(e) => setNivel(e.target.value as NivelEnsino)}
                className="w-full p-4 rounded-2xl text-lg bg-slate-50/50 border-2 border-slate-200 focus:border-purple-500 focus:bg-white transition-all cursor-pointer text-slate-700"
              >
                <option value="fund1">Fundamental I</option>
                <option value="fund2">Fundamental II</option>
                <option value="medio">Ensino Médio</option>
                <option value="eja">EJA</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-slate-800">Ano / Série</label>
              <select 
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full p-4 rounded-2xl text-lg bg-slate-50/50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all cursor-pointer text-slate-700"
              >
                {ANOS_POR_NIVEL[nivel].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-slate-800">Disciplina</label>
              <select 
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full p-4 rounded-2xl text-lg bg-slate-50/50 border-2 border-slate-200 focus:border-green-500 focus:bg-white transition-all cursor-pointer text-slate-700"
              >
                <option value="" disabled>Selecione...</option>
                {DISCIPLINAS.map((disc) => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 text-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-7 h-7 animate-spin" />
                Gerando Centelha...
              </>
            ) : (
              <>
                <Sparkles className="w-7 h-7" /> Acender Centelha
              </>
            )}
          </button>
        </div>
      )}

      {/* --- RESULTADO --- */}
      {result && (
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden fade-in-up relative">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
             <span className="relative z-10 inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-sm font-bold uppercase tracking-wider rounded-2xl border border-white/30">
                {result.tipo}
              </span>
            <h2 className="relative z-10 text-3xl md:text-4xl font-bold mt-4 leading-tight">{result.titulo}</h2>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500">
              <p className="text-slate-700 text-xl leading-relaxed font-medium">
                <span className="text-blue-600 font-bold text-2xl">✨ Que tal... </span>
                {result.centelha.replace(/Que tal\.{3}|Que tal/i, "").trim()}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* LINK EXTERNO PARA O PLANEJADOR */}
              <a 
                href="https://escolasergio4-lang.github.io/planejadorai/" 
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group text-xl"
              >
                <LayoutTemplate className="w-6 h-6" /> 
                Criar Plano Completo
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button 
                onClick={() => setResult(null)}
                className="w-full py-4 text-slate-600 font-semibold hover:text-blue-600 transition-colors flex items-center justify-center gap-3 text-lg border-2 border-slate-200 hover:border-blue-300 rounded-2xl"
              >
                <RefreshCw className="w-5 h-5" />
                Gerar Outra Ideia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIGURAÇÃO (API KEY) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                Configurar IA
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-slate-700 leading-relaxed">
                  Para usar a Centelha, insira sua chave da API Groq. Ela ficará salva apenas no seu navegador de forma segura.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Sua Chave API Groq</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_your_api_key_here..." 
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-slate-800 font-mono text-lg bg-slate-50/50 focus:bg-white transition-all"
                />
                <p className="text-xs text-slate-500">
                  Obtenha sua chave em <a href="https://console.groq.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">console.groq.com</a>
                </p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSaveKey}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
                >
                  <Save className="w-5 h-5" /> Salvar Chave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-slate-500 text-sm">
        <p>© 2026 Escola Sérgio • Apoio Docente</p>
        <p className="mt-2 text-xs text-slate-400">Desenvolvido com ❤️ para educadores</p>
      </footer>

    </main>
  );
}