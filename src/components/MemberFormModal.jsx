import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Calendar } from 'lucide-react';

export default function MemberFormModal({ isOpen, onClose, onSave, memberToEdit }) {
  const [nome, setNome] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Converter data ISO (AAAA-MM-DD ou 2000-MM-DD) para texto digitável (DD/MM/AAAA ou DD/MM)
  const formatIsoToTypedDate = (isoStr) => {
    if (!isoStr) return '';
    const parts = isoStr.split(/[-/]/);
    if (parts.length === 3) {
      const [y, m, d] = parts;
      if (y === '2000') return `${d.padStart(2, '0')}/${m.padStart(2, '0')}`;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    if (parts.length === 2) {
      return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
    }
    return isoStr;
  };

  // Converter texto digitado (DD/MM/AAAA ou DD/MM) para formato ISO interno
  const parseTypedDateToIso = (typed) => {
    if (!typed) return '';
    const clean = typed.trim();
    const parts = clean.split(/[-/.]/);

    if (parts.length === 3) {
      const [d, m, y] = parts;
      const day = d.padStart(2, '0');
      const month = m.padStart(2, '0');
      let year = y;
      if (year.length === 2) year = `20${year}`;
      return `${year}-${month}-${day}`;
    }

    if (parts.length === 2) {
      const [d, m] = parts;
      const day = d.padStart(2, '0');
      const month = m.padStart(2, '0');
      return `2000-${month}-${day}`;
    }

    return clean;
  };

  useEffect(() => {
    if (memberToEdit) {
      setNome(memberToEdit.nome || '');
      setDateInput(formatIsoToTypedDate(memberToEdit.data_nascimento || ''));
      setObservacoes(memberToEdit.observacoes || '');
    } else {
      setNome('');
      setDateInput('');
      setObservacoes('');
    }
    setErrorMsg('');
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  // Máscara automática enquanto o usuário digita a data
  const handleDateChange = (e) => {
    let val = e.target.value.replace(/[^\d/]/g, ''); // Permitir apenas dígitos e /
    
    // Se digitou apenas números seguidos, aplicar máscara DD/MM/AAAA
    const numbersOnly = val.replace(/\D/g, '');
    if (numbersOnly.length > 8) {
      val = numbersOnly.slice(0, 8);
    }
    
    if (!val.includes('/') && numbersOnly.length > 0) {
      if (numbersOnly.length >= 5) {
        val = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4)}`;
      } else if (numbersOnly.length >= 3) {
        val = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
      } else {
        val = numbersOnly;
      }
    }

    setDateInput(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('Por favor, informe o nome completo do membro.');
      return;
    }
    if (!dateInput.trim()) {
      setErrorMsg('Por favor, informe a data de nascimento (ex: 15/08/1995 ou 03/10).');
      return;
    }

    const isoDate = parseTypedDateToIso(dateInput);

    setLoading(true);
    setErrorMsg('');

    try {
      await onSave({
        nome: nome.trim(),
        data_nascimento: isoDate,
        observacoes: observacoes.trim()
      }, memberToEdit?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar membro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <UserPlus size={20} style={{ color: 'var(--primary-gold)' }} />
            <span>{memberToEdit ? 'Editar Dados do Membro' : 'Cadastrar Novo Membro'}</span>
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Nome Completo *</label>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva Santos"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} style={{ color: 'var(--primary-gold)' }} />
                  <span>Data de Nascimento ou Aniversário *</span>
                </label>
                <input 
                  type="text"
                  placeholder="Digite a data. Ex: 15/08/1995 ou 03/10"
                  value={dateInput}
                  onChange={handleDateChange}
                  maxLength={10}
                  required
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Digite o dia, mês e ano (ex: 15/08/1995) ou apenas o dia e mês (ex: 03/10).
                </span>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Observações</label>
                <textarea 
                  rows={4}
                  placeholder="Observações ou informações adicionais sobre o membro..."
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : (
                <>
                  <Save size={16} />
                  <span>{memberToEdit ? 'Atualizar Membro' : 'Salvar Cadastro'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
