import React, { useState } from 'react';
import { Database, ShieldCheck, Copy, Check, Save, RefreshCw, HardDrive } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from '../lib/supabase';

const SQL_SCRIPT = `-- SCRIPT DE CRIAÇÃO DA TABELA DE MEMBROS NO SUPABASE
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura publica" ON public.membros FOR SELECT USING (true);
CREATE POLICY "Permitir insercao publica" ON public.membros FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualizacao publica" ON public.membros FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusao publica" ON public.membros FOR DELETE USING (true);`;

export default function ConfigView({ onConfigSaved }) {
  const [urlInput, setUrlInput] = useState(supabaseUrl);
  const [keyInput, setKeyInput] = useState(supabaseAnonKey);
  const [copied, setCopied] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (urlInput) localStorage.setItem('IGREJA_SUPABASE_URL', urlInput.trim());
    if (keyInput) localStorage.setItem('IGREJA_SUPABASE_ANON_KEY', keyInput.trim());

    setSavedMsg(true);
    setTimeout(() => {
      if (onConfigSaved) onConfigSaved();
      window.location.reload();
    }, 1000);
  };

  const handleResetLocal = () => {
    if (window.confirm('Deseja restaurar as configurações padrão de armazenamento local?')) {
      localStorage.removeItem('IGREJA_SUPABASE_URL');
      localStorage.removeItem('IGREJA_SUPABASE_ANON_KEY');
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Cabeçalho */}
      <div className="card-panel">
        <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          <Database size={22} style={{ color: 'var(--primary-gold)' }} />
          <span>Configurações do Sistema & Banco de Dados</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Gerencie a conexão do banco de dados Supabase na nuvem ou altere as preferências de armazenamento do sistema.
        </p>
      </div>

      {/* Status da Conexão */}
      <div className="card-panel">
        <div style={{
          background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <ShieldCheck size={28} style={{ color: isConnected ? '#34d399' : '#fbbf24', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: isConnected ? '#34d399' : '#fbbf24' }}>
              {isConnected ? 'Sistema Conectado ao Supabase (Nuvem SQL)' : 'Modo de Armazenamento Local (Offline)'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isConnected 
                ? 'Seus dados de membros e aniversariantes são sincronizados em tempo real no banco PostgreSQL do Supabase.' 
                : 'Os dados estão sendo salvos localmente no navegador. Insira a URL e a Anon Key abaixo para conectar ao Supabase.'}
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Conexão Supabase */}
      <div className="card-panel">
        <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Credenciais do Supabase
        </h3>

        {savedMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontWeight: 600 }}>
            Configurações salvas com sucesso! Reiniciando conexão...
          </div>
        )}

        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Supabase Project URL</label>
            <input 
              type="text" 
              placeholder="https://seu-projeto.supabase.co"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supabase Anon Key</label>
            <input 
              type="password" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={handleResetLocal}>
              <HardDrive size={16} />
              <span>Usar Armazenamento Local</span>
            </button>

            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Salvar e Conectar Supabase</span>
            </button>
          </div>
        </form>
      </div>

      {/* Bloco de Script SQL */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Script SQL de Inicialização no Supabase</h3>
          <button type="button" className="btn-secondary" onClick={handleCopySql} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar Código SQL'}</span>
          </button>
        </div>

        <pre style={{ 
          background: 'rgba(15, 23, 42, 0.8)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)', 
          fontSize: '0.8rem', 
          color: '#38bdf8', 
          overflowX: 'auto' 
        }}>
          {SQL_SCRIPT}
        </pre>
      </div>
    </div>
  );
}
