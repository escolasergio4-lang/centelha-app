import Groq from 'groq-sdk';

// Interface da resposta da IA
export interface CentelhaResponse {
  titulo: string;
  tipo: string;
  centelha: string;
}

// Configurações do modelo
const MODEL_CONFIG = {
  model: "llama-3.1-70b-versatile",
  temperature: 0.8,
  max_tokens: 1000
};

// Prompt do Sistema (O Cérebro Crítico/Sutil)
const SYSTEM_PROMPT = `Você é um assistente pedagógico criativo e sutilmente crítico. 
Gere um JSON com 3 campos: 'titulo' (curto), 'tipo' (Aula, Projeto, Oficina) e 'centelha' (máx 40 palavras).
A 'centelha' deve começar OBRIGATORIAMENTE com 'Que tal...' e conectar o tema à realidade social/material do aluno de forma instigante.`;

export class GroqService {
  private apiKey: string;
  private client: Groq;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.client = new Groq({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  // Atualizar a chave API
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  // Gerar centelha pedagógica
  async generateCentelha(topico: string, disciplina: string, ano: string, nivel: string): Promise<CentelhaResponse> {
    if (!this.apiKey) {
      throw new Error('Chave API não configurada');
    }

    const userPrompt = `Tema: ${topico}. Disciplina: ${disciplina}. Público: ${ano} (${nivel}).`;

    try {
      const response = await this.client.chat.completions.create({
        model: MODEL_CONFIG.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: MODEL_CONFIG.temperature,
        max_tokens: MODEL_CONFIG.max_tokens
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Resposta vazia da API');
      }

      return JSON.parse(content) as CentelhaResponse;
    } catch (error) {
      console.error('Erro na API Groq:', error);
      throw new Error('Erro ao gerar centelha. Verifique sua chave API ou conexão.');
    }
  }

  // Método alternativo usando fetch direto (fallback)
  async generateCentelhaFetch(topico: string, disciplina: string, ano: string, nivel: string): Promise<CentelhaResponse> {
    if (!this.apiKey) {
      throw new Error('Chave API não configurada');
    }

    const userPrompt = `Tema: ${topico}. Disciplina: ${disciplina}. Público: ${ano} (${nivel}).`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
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
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro na requisição');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    return JSON.parse(content) as CentelhaResponse;
  }
}

// Instância padrão do serviço
export const groqService = new GroqService();