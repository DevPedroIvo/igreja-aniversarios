import React from 'react';
import { LayoutDashboard, Users, Cake, Settings, UserPlus } from 'lucide-react';
import DunamisLogo from './DunamisLogo';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  membrosCount, 
  aniversariantesCount, 
  onOpenConfigModal, 
  onOpenNewMemberModal 
}) {
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

        {/* Botão de Cadastrar Membro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-primary"
            onClick={onOpenNewMemberModal}
          >
            <UserPlus size={18} />
            <span>Cadastrar Membro</span>
          </button>
        </div>
      </div>
    </header>
  );
}
