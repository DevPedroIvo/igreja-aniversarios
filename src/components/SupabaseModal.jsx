import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from '../lib/supabase';

const SQL_SCRIPT = `-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO SUPABASE
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone TEXT,
    email TEXT,
    ministerio TEXT DEFAULT 'Membro',
    status TEXT DEFAULT 'Ativo',
    data_batismo DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura anonima" ON public.membros FOR SELECT USING (true);
CREATE POLICY "Permitir insercao anonima" ON public.membros FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualizacao anonima" ON public.membros FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusao anonima" ON public.membros FOR DELETE USING (true);`;

export default function SupabaseModal({ isOpen, onClose, onConfigSaved }) {
  const [urlInput, setUrlInput] = useState(supabaseUrl);
  const [keyInput, setKeyInput] = useState(supabaseAnonKey);
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (urlInput) localStorage.setItem('IGREJA_SUPABASE_URL', urlInput.trim());
    if (keyInput) localStorage.setItem('IGREJA_SUPABASE_ANON_KEY', keyInput.trim());

    if (onConfigSaved) onConfigSaved();
    onClose();
    window.location.reload(); // Recarrega para reinicializar o cliente Supabase
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} style={{ color: 'var(--primary-gold)' }} />
            <span>Conectar Banco de Dados Supabase</span>
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Atual */}
          <div style={{
            background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <ShieldCheck size={24} style={{ color: isConnected ? '#34d399' : '#fbbf24' }} />
            <div>
              <div style={{ fontWeight: 600, color: isConnected ? '#34d399' : '#fbbf24' }}>
                {isConnected ? 'Sistema conectado ao Supabase!' : 'Operando em modo local'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isConnected 
                  ? 'Os dados dos membros estão sendo salvos e lidos diretamente da nuvem Supabase.' 
                  : 'Insira suas credenciais abaixo ou no arquivo .env para sincronizar na nuvem.'}
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveConfig}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Supabase URL</label>
              <input 
                type="text" 
                placeholder="https://xxxx.supabase.co"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Supabase Anon Key</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
              />
            </div>

            {/* Script SQL para Copiar */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Script SQL de Criação das Tabelas:</span>
                <button type="button" className="btn-secondary" onClick={handleCopySql} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copiado!' : 'Copiar SQL'}</span>
                </button>
              </div>
              <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflowX: 'auto', maxHeight: '100px' }}>
                {SQL_SCRIPT}
              </pre>
            </div>

            <div className="modal-footer" style={{ padding: 0 }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Fechar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Credenciais
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
