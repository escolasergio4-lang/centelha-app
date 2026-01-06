'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  LayoutTemplate, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  X, 
  Save, 
  Key,
  Download,
  Menu,
  CheckCircle2
} from 'lucide-react';
import { groqService, type CentelhaResponse } from '../lib/groq-service';

// --- TYPES & CONSTANTS ---

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

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
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CentelhaResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  
  // Form State
  const [topico, setTopico] = useState('');
  const [nivel, setNivel] = useState<NivelEnsino>('fund2');
  const [ano, setAno] = useState(ANOS_POR_NIVEL['fund2'][0]);
  const [disciplina, setDisciplina] = useState('');

  // --- EFFECTS ---

  useEffect(() => {
    const savedKey = localStorage.getItem('groq_api_key');
    if (savedKey) setApiKey(savedKey);
    setAno(ANOS_POR_NIVEL[nivel][0]);
  }, [nivel]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // --- HANDLERS ---

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleSaveKey = () => {
    localStorage.setItem('groq_api_key', apiKey);
    setShowModal(false);
  };

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
      groqService.setApiKey(apiKey);
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg text-white shadow-md shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Centelha<span className="text-indigo-600">.ai</span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {showInstallButton && (
                <button 
                  onClick={handleInstallClick}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Instalar App
                </button>
              )}
              
              <button 
                onClick={() => setShowModal(true)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50 rounded-full transition-all"
                title="Configurações"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 text-balance">
            Planeje aulas <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">inesquecíveis</span>
          </h1>
          <p className="text-lg text-slate-600 text-balance leading-relaxed">
            Dê o primeiro passo para transformar sua sala de aula. Gere ideias criativas e alinhadas ao currículo em segundos.
          </p>
          
          {/* Mobile Install Button (Visible only on small screens if standard button is generic) */}
          {showInstallButton && (
            <button 
              onClick={handleInstallClick}
              className="mt-6 md:hidden inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Instalar App
            </button>
          )}
        </div>

        {/* --- FORM SECTION --- */}
        {!result && (
          <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Topic Input - Full Width on Mobile, Left Col on Desktop */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  O que vamos ensinar hoje?
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={topico}
                    onChange={(e) => setTopico(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg"
                    placeholder="Ex: Revolução Industrial, Frações, Verbo To Be..."
                  />
                </div>
              </div>

              {/* Selects Grid */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Nível & Ano</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      value={nivel}
                      onChange={(e) => setNivel(e.target.value as NivelEnsino)}
                      className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="fund1">Fund. I</option>
                      <option value="fund2">Fund. II</option>
                      <option value="medio">Ensino Médio</option>
                      <option value="eja">EJA</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      {ANOS_POR_NIVEL[nivel].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Disciplina</label>
                <div className="relative">
                  <select
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Selecione a disciplina...</option>
                    {DISCIPLINAS.map((disc) => (
                      <option key={disc} value={disc}>{disc}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Gerando Ideias Fabulosas...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    Acender Centelha Criativa
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* --- RESULT SECTION --- */}
        {result && (
          <div className="w-full animate-slide-up space-y-6">
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100/50 border border-slate-100 ring-1 ring-slate-200/50">
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
                      {result.tipo}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {result.titulo}
                  </h2>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setResult(null)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                   <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6 md:p-10">
                <div className="prose prose-indigo max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                    {result.centelha.replace(/Que tal\.{3}|Que tal/i, "").trim()}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row gap-4 justify-end">
                 <button 
                  onClick={() => setResult(null)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all"
                >
                  Tentar Outra Ideia
                </button>
                <a 
                  href="https://escolasergio4-lang.github.io/planejadorai/" 
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
                >
                  <LayoutTemplate className="w-5 h-5" />
                  Criar Plano Completo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center border-t border-slate-200 mt-auto bg-white/50 backdrop-blur-sm">
        <p className="text-slate-500 font-medium">Escola Sérgio • Apoio Docente</p>
        <p className="text-slate-400 text-sm mt-1">Desenvolvido para inspirar o futuro.</p>
      </footer>

      {/* --- MODAL (API KEY) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 relative">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Configurar Acesso</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Para utilizar a inteligência artificial, você precisa de uma chave API da Groq. Ela será salva apenas no seu navegador.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Chave API (Groq)
                </label>
                <div className="relative">
                   <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-mono text-sm"
                    placeholder="gsk_..."
                  />
                </div>
              </div>
              
              <div className="text-xs text-slate-500 flex justify-between items-center">
                <span>Não tem uma chave?</span>
                <a href="https://console.groq.com" target="_blank" rel="noopener" className="text-indigo-600 hover:underline font-medium">
                  Gerar chave grátis
                </a>
              </div>

              <button
                onClick={handleSaveKey}
                className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Configuração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}