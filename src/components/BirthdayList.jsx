import React, { useState, useEffect, useMemo } from 'react';
import { Cake, Calendar, Phone, Sparkles, Gift, Heart, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const MESES = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' }
];

export default function BirthdayList({ membros }) {
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const currentDayNum = new Date().getDate();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthNum);

  // Aniversariantes do Mês Selecionado
  const birthdayMembers = useMemo(() => {
    return membros
      .filter(m => {
        if (!m.data_nascimento) return false;
        const parts = m.data_nascimento.split('-');
        if (parts.length < 2) return false;
        const month = parseInt(parts[1], 10);
        return month === selectedMonth;
      })
      .sort((a, b) => {
        const dayA = parseInt(a.data_nascimento.split('-')[2], 10);
        const dayB = parseInt(b.data_nascimento.split('-')[2], 10);
        return dayA - dayB;
      });
  }, [membros, selectedMonth]);

  // Verificar se há aniversariantes hoje
  const todaysBirthdays = useMemo(() => {
    return birthdayMembers.filter(m => {
      const parts = m.data_nascimento.split('-');
      const day = parseInt(parts[2], 10);
      return selectedMonth === currentMonthNum && day === currentDayNum;
    });
  }, [birthdayMembers, selectedMonth, currentMonthNum, currentDayNum]);

  // Soltar confete caso haja aniversariante hoje
  useEffect(() => {
    if (todaysBirthdays.length > 0 && selectedMonth === currentMonthNum) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  }, [todaysBirthdays, selectedMonth, currentMonthNum]);

  // Calcular a idade que a pessoa completará/completou neste ano
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const year = parseInt(birthDateStr.split('-')[0], 10);
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  // WhatsApp Link Festivo
  const getBirthdayWhatsAppLink = (phoneStr, nameStr) => {
    if (!phoneStr) return null;
    const cleanNum = phoneStr.replace(/\D/g, '');
    const numWithCountry = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
    const msg = encodeURIComponent(`A paz do Senhor, ${nameStr}! 🎉🎂 Feliz Aniversário! Que Deus continue abençoando rica e grandemente a sua vida, família e ministério! 📜✨`);
    return `https://wa.me/${numWithCountry}?text=${msg}`;
  };

  const selectedMonthLabel = MESES.find(m => m.value === selectedMonth)?.label;

  return (
    <div className="animate-fade-in">
      {/* Banner Destaque Aniversariantes do Mês */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(21, 28, 46, 0.8))', borderColor: 'var(--border-highlight)' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-gold)', color: 'var(--text-dark)' }}>
            <Cake size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--primary-gold)' }}>{birthdayMembers.length}</div>
            <div className="stat-label">Aniversariantes em {selectedMonthLabel}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <PartyPopper size={24} />
          </div>
          <div>
            <div className="stat-val">{todaysBirthdays.length}</div>
            <div className="stat-label">Aniversariantes de Hoje</div>
          </div>
        </div>
      </div>

      {/* Seletor de Mês */}
      <div className="month-selector">
        {MESES.map(m => (
          <button
            key={m.value}
            className={`month-btn ${selectedMonth === m.value ? 'active' : ''}`}
            onClick={() => setSelectedMonth(m.value)}
          >
            {m.label} {m.value === currentMonthNum ? ' (Atual)' : ''}
          </button>
        ))}
      </div>

      {/* Título e Lista de Cartões */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Gift size={22} style={{ color: 'var(--primary-gold)' }} />
            <span>Mêsversários de {selectedMonthLabel}</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Organizado por dia do mês
          </span>
        </div>

        {birthdayMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Cake size={56} style={{ opacity: 0.25, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.15rem', fontWeight: 600 }}>Nenhum aniversariante em {selectedMonthLabel}</p>
            <p style={{ fontSize: '0.9rem' }}>Nenhum membro cadastrado faz aniversário neste mês.</p>
          </div>
        ) : (
          <div className="birthday-grid">
            {birthdayMembers.map(membro => {
              const day = parseInt(membro.data_nascimento.split('-')[2], 10);
              const age = calculateAge(membro.data_nascimento);
              const isToday = selectedMonth === currentMonthNum && day === currentDayNum;
              const waLink = getBirthdayWhatsAppLink(membro.telefone, membro.nome);

              return (
                <div key={membro.id} className={`birthday-card ${isToday ? 'today' : ''}`}>
                  {isToday && <div className="today-banner">É Hoje!</div>}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="day-badge">
                      <span className="day-number">{day}</span>
                      <span className="day-month">{selectedMonthLabel.substring(0, 3)}</span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        {membro.nome}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {membro.ministerio || 'Membro'} • {age ? `${age} anos` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} />
                      <span>{membro.data_nascimento.split('-').reverse().join('/')}</span>
                    </div>

                    {waLink ? (
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-whatsapp"
                      >
                        <Heart size={14} />
                        <span>Parabenizar</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sem telefone</span>
                    )}
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
