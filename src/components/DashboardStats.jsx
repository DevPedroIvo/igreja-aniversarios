import React, { useMemo } from 'react';
import { Users, Calendar, Cake } from 'lucide-react';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function DashboardStats({ membros = [] }) {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // 0 - 11
  const currentMonthName = MESES[currentMonthIndex];

  // Quantidade de aniversariantes do mês atual
  const aniversariantesDoMesCount = useMemo(() => {
    const currentMonthNum = currentMonthIndex + 1; // 1 - 12
    return membros.filter(m => {
      if (!m.data_nascimento) return false;
      const parts = m.data_nascimento.split(/[-/]/);
      if (parts.length < 2) return false;
      const month = parseInt(parts[1], 10);
      return month === currentMonthNum;
    }).length;
  }, [membros, currentMonthIndex]);

  return (
    <div className="stats-grid">
      {/* 1. Quantidade de Pessoas Cadastradas */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
          <Users size={24} />
        </div>
        <div>
          <div className="stat-val">{membros.length}</div>
          <div className="stat-label">Pessoas Cadastradas</div>
        </div>
      </div>

      {/* 2. O Mês Que Estamos */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <Calendar size={24} />
        </div>
        <div>
          <div className="stat-val">{currentMonthName}</div>
          <div className="stat-label">Mês Atual</div>
        </div>
      </div>

      {/* 3. Aniversariantes do Mês */}
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
          <Cake size={24} />
        </div>
        <div>
          <div className="stat-val">{aniversariantesDoMesCount}</div>
          <div className="stat-label">Aniversariantes em {currentMonthName}</div>
        </div>
      </div>
    </div>
  );
}
