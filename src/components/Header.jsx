import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Cake, 
  Settings, 
  UserPlus, 
  MoreVertical, 
  X,
  ChevronRight
} from 'lucide-react';
import DunamisLogo from './DunamisLogo';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  membrosCount, 
  aniversariantesCount, 
  onOpenNewMemberModal 
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Logo Oficial do Ministério Dunamis */}
        <div className="brand" onClick={() => handleSelectTab('dashboard')} style={{ cursor: 'pointer' }}>
          <DunamisLogo height={52} />
        </div>

        {/* Abas de Navegação no Desktop */}
        <nav className="nav-tabs nav-tabs-desktop">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSelectTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'membros' ? 'active' : ''}`}
            onClick={() => handleSelectTab('membros')}
          >
            <Users size={18} />
            <span>Lista de Membros</span>
            <span className="tab-badge">{membrosCount}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'aniversariantes' ? 'active' : ''}`}
            onClick={() => handleSelectTab('aniversariantes')}
          >
            <Cake size={18} />
            <span>Aniversariantes</span>
            <span className="tab-badge">{aniversariantesCount}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'configuracoes' ? 'active' : ''}`}
            onClick={() => handleSelectTab('configuracoes')}
          >
            <Settings size={18} />
            <span>Configuração</span>
          </button>
        </nav>

        {/* Ações do Header */}
        <div className="header-actions">
          <button 
            className="btn-primary desktop-only-btn"
            onClick={onOpenNewMemberModal}
          >
            <UserPlus size={18} />
            <span>Cadastrar Membro</span>
          </button>

          {/* Botão 3 Pontinhos para Dispositivos Mobile */}
          <button 
            className="btn-menu-dots"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir Menu de Navegação"
            title="Menu do Sistema"
          >
            <MoreVertical size={24} />
          </button>
        </div>
      </div>

      {/* Drawer Lateral Mobile (Abre na direita ao apertar os 3 pontinhos) */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <DunamisLogo height={32} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Menu Dunamis</span>
              </div>
              <button className="mobile-drawer-close" onClick={() => setDrawerOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <div className="mobile-menu-section-title">Navegação Principal</div>

              <button 
                className={`mobile-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleSelectTab('dashboard')}
              >
                <div className="mobile-menu-left">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </div>
                <ChevronRight size={16} className="chevron" />
              </button>

              <button 
                className={`mobile-menu-item ${activeTab === 'membros' ? 'active' : ''}`}
                onClick={() => handleSelectTab('membros')}
              >
                <div className="mobile-menu-left">
                  <Users size={20} />
                  <span>Lista de Membros</span>
                </div>
                <div className="mobile-menu-right">
                  <span className="tab-badge">{membrosCount}</span>
                  <ChevronRight size={16} className="chevron" />
                </div>
              </button>

              <button 
                className={`mobile-menu-item ${activeTab === 'aniversariantes' ? 'active' : ''}`}
                onClick={() => handleSelectTab('aniversariantes')}
              >
                <div className="mobile-menu-left">
                  <Cake size={20} />
                  <span>Aniversariantes</span>
                </div>
                <div className="mobile-menu-right">
                  <span className="tab-badge">{aniversariantesCount}</span>
                  <ChevronRight size={16} className="chevron" />
                </div>
              </button>

              <button 
                className={`mobile-menu-item ${activeTab === 'configuracoes' ? 'active' : ''}`}
                onClick={() => handleSelectTab('configuracoes')}
              >
                <div className="mobile-menu-left">
                  <Settings size={20} />
                  <span>Configuração</span>
                </div>
                <ChevronRight size={16} className="chevron" />
              </button>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenNewMemberModal();
                  }}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                >
                  <UserPlus size={20} />
                  <span>Cadastrar Novo Membro</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
