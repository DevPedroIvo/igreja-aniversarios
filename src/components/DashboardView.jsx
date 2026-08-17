import React from 'react';
import DashboardStats from './DashboardStats';
import { UserPlus, Users, Cake, Calendar, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function DashboardView({ 
  membros = [], 
  onOpenNewMemberModal, 
  setActiveTab 
}) {
  const currentDate = new Date();
  const currentMonthNum = currentDate.getMonth() + 1;
  const currentMonthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
  const formattedMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  // Membros aniversariantes do mês vigente
  const aniversariantesDoMes = membros.filter(m => {
    if (!m.data_nascimento) return false;
    const parts = m.data_nascimento.split(/[-/]/);
    if (parts.length < 2) return false;
    return parseInt(parts[1], 10) === currentMonthNum;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Grade de Cartões com as 3 Métricas Principais */}
      <DashboardStats membros={membros} />

      {/* 2. Ações Rápidas & Atalhos */}
      <div className="card-panel">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
          Ações Rápidas & Atalhos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <button 
            className="btn-primary" 
            onClick={onOpenNewMemberModal}
            style={{ justifyContent: 'center', padding: '1rem' }}
          >
            <UserPlus size={20} />
            <span>Cadastrar Novo Membro</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('membros')}
            style={{ justifyContent: 'center', padding: '1rem' }}
          >
            <Users size={20} style={{ color: 'var(--primary-gold)' }} />
            <span>Ver Lista de Membros</span>
            <ArrowRight size={16} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('aniversariantes')}
            style={{ justifyContent: 'center', padding: '1rem' }}
          >
            <Cake size={20} style={{ color: '#f59e0b' }} />
            <span>Ver Aniversariantes do Mês</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 3. Destaque dos Aniversariantes do Mês Atual */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cake size={20} style={{ color: 'var(--primary-gold)' }} />
            <span>Aniversariantes em {formattedMonthName} ({aniversariantesDoMes.length})</span>
          </h2>
          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('aniversariantes')}
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
          >
            <span>Ver Todos</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {aniversariantesDoMes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            Nenhum membro faz aniversário neste mês de {formattedMonthName}.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {aniversariantesDoMes.slice(0, 4).map(membro => {
              const parts = membro.data_nascimento.split(/[-/]/);
              const day = parts[2] || parts[0];
              return (
                <div 
                  key={membro.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div className="day-badge" style={{ width: '44px', height: '44px' }}>
                    <span className="day-number" style={{ fontSize: '1.1rem' }}>{day}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{membro.nome}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {membro.observacoes ? membro.observacoes : `Aniversariante de ${formattedMonthName}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
