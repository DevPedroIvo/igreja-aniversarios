import React from 'react';
import { LayoutDashboard, Users, Cake, Settings, UserPlus, Database } from 'lucide-react';
import DunamisLogo from './DunamisLogo';
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
        {/* Logo Oficial do Ministério Dunamis (Fundo Removido & Vetorizado) */}
        <div className="brand" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <DunamisLogo height={52} />
        </div>

        {/* Abas de Navegação Separadas */}
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'membros' ? 'active' : ''}`}
            onClick={() => setActiveTab('membros')}
          >
            <Users size={18} />
            <span>Lista de Membros</span>
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

          <button 
            className={`tab-btn ${activeTab === 'configuracoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracoes')}
          >
            <Settings size={18} />
            <span>Configuração</span>
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
            onClick={() => setActiveTab('configuracoes')}
            title={isConnected ? "Conectado ao Supabase SQL Database" : "Modo de Teste Local - Clique para Configurar Supabase"}
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
