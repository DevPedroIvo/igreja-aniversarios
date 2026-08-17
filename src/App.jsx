import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import MemberList from './components/MemberList';
import BirthdayList from './components/BirthdayList';
import ConfigView from './components/ConfigView';
import MemberFormModal from './components/MemberFormModal';
import Footer from './components/Footer';

import { fetchMembros, createMembro, updateMembro, deleteMembro } from './lib/supabase';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'membros' | 'aniversariantes' | 'configuracoes'
  const [membros, setMembros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tema Claro / Escuro
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dunamis_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dunamis_theme', theme);
  }, [theme]);

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Controle de Modais
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Mensagem Toast de Notificação
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Carregar lista de membros
  const loadMembros = async () => {
    setLoading(true);
    try {
      const { data } = await fetchMembros();
      setMembros(data || []);
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
      showToast('Erro ao carregar lista de membros', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembros();
  }, []);

  // Aniversariantes do Mês Atual para o Contador do Header
  const currentMonthAniversariantesCount = useMemo(() => {
    const currentMonthNum = new Date().getMonth() + 1;
    return membros.filter(m => {
      if (!m.data_nascimento) return false;
      const parts = m.data_nascimento.split(/[-/]/);
      if (parts.length < 2) return false;
      return parseInt(parts[1], 10) === currentMonthNum;
    }).length;
  }, [membros]);

  // Salvar (Cadastrar ou Atualizar) Membro
  const handleSaveMember = async (formData, id) => {
    try {
      if (id) {
        await updateMembro(id, formData);
        showToast('Membro atualizado com sucesso!');
      } else {
        await createMembro(formData);
        showToast('Novo membro cadastrado com sucesso!');
      }
      await loadMembros();
    } catch (err) {
      showToast(err.message || 'Erro ao salvar membro', 'error');
      throw err;
    }
  };

  // Importar membros em lote (JSON/CSV)
  const handleImportMembros = async (importedList) => {
    try {
      for (const m of importedList) {
        if (m.nome) {
          await createMembro({
            nome: m.nome,
            data_nascimento: m.data_nascimento || '',
            observacoes: m.observacoes || ''
          });
        }
      }
      await loadMembros();
    } catch (err) {
      showToast('Erro ao importar membros', 'error');
    }
  };

  // Excluir Membro
  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o cadastro de "${name}"?`)) {
      try {
        await deleteMembro(id);
        showToast(`Membro "${name}" excluído.`);
        await loadMembros();
      } catch (err) {
        showToast('Erro ao excluir membro', 'error');
      }
    }
  };

  // Abrir modal de edição
  const handleEditMemberClick = (member) => {
    setEditingMember(member);
    setFormModalOpen(true);
  };

  // Abrir modal de novo cadastro
  const handleNewMemberClick = () => {
    setEditingMember(null);
    setFormModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: toast.type === 'error' ? '#f43f5e' : 'var(--primary-gold)',
          color: toast.type === 'error' ? '#fff' : 'var(--text-dark)',
          fontWeight: 600,
          padding: '0.875rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header com Navegação Separada de 4 Abas */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        membrosCount={membros.length}
        aniversariantesCount={currentMonthAniversariantesCount}
        onOpenNewMemberModal={handleNewMemberClick}
      />

      {/* Conteúdo Principal por Aba Separada */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
            <div className="pulse-glow" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-gold)' }}>
              Carregando sistema...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                membros={membros}
                onOpenNewMemberModal={handleNewMemberClick}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'membros' && (
              <MemberList
                membros={membros}
                onEditMembro={handleEditMemberClick}
                onDeleteMembro={handleDeleteMember}
                onOpenNewModal={handleNewMemberClick}
              />
            )}

            {activeTab === 'aniversariantes' && (
              <BirthdayList
                membros={membros}
              />
            )}

            {activeTab === 'configuracoes' && (
              <ConfigView
                membros={membros}
                onImportMembros={handleImportMembros}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal de Formulário de Membro */}
      <MemberFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveMember}
        memberToEdit={editingMember}
      />
    </div>
  );
}
