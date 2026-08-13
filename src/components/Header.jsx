import React from 'react';
import { Church, Users, Cake, UserPlus, Database, Search } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  membrosCount, 
  aniversariantesCount, 
  onOpenConfigModal, 
  onOpenNewMemberModal 
}) {
  const isConnected = isSupabaseConfigured();

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo e Nome da Igreja */}
        <div className="brand">
          <div className="brand-icon">
            <Church size={24} />
          </div>
          <div>
            <h1 className="brand-title">Gestão Eclesiástica</h1>
            <p className="brand-subtitle">Sistema Interno de Membros & Aniversariantes</p>
          </div>
        </div>

        {/* Abas de Navegação */}
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'membros' ? 'active' : ''}`}
            onClick={() => setActiveTab('membros')}
          >
            <Users size={18} />
            <span>Membros (A-Z)</span>
            <span className="tab-badge">{membrosCount}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'aniversariantes' ? 'active' : ''}`}
            onClick={() => setActiveTab('aniversariantes')}
          >
            <Cake size={18} />
            <span>Aniversariantes</span>
            <span className="tab-badge">{aniversariantesCount}</span>
          </button>
        </nav>

        {/* Ações Rápidas & Indicador Supabase */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-primary"
            onClick={onOpenNewMemberModal}
          >
            <UserPlus size={18} />
            <span>Cadastrar Membro</span>
          </button>

          <div 
            className={`status-badge ${isConnected ? 'supabase' : 'local'}`}
            onClick={onOpenConfigModal}
            title={isConnected ? "Conectado ao Supabase SQL Database" : "Modo de Teste Local - Clique para Conectar Supabase"}
          >
            <Database size={14} />
            <span className="status-dot"></span>
            <span>{isConnected ? 'Supabase Ativo' : 'Supabase Config'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
