import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';

export default function MemberFormModal({ isOpen, onClose, onSave, memberToEdit }) {
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    observacoes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        nome: memberToEdit.nome || '',
        data_nascimento: memberToEdit.data_nascimento || '',
        observacoes: memberToEdit.observacoes || ''
      });
    } else {
      setFormData({
        nome: '',
        data_nascimento: '',
        observacoes: ''
      });
    }
    setErrorMsg('');
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      setErrorMsg('Por favor, informe o nome completo do membro.');
      return;
    }
    if (!formData.data_nascimento) {
      setErrorMsg('Por favor, informe a data de nascimento.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await onSave(formData, memberToEdit?.id);
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
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Data de Nascimento *</label>
                <input 
                  type="date"
                  value={formData.data_nascimento}
                  onChange={e => setFormData({ ...formData, data_nascimento: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Observações</label>
                <textarea 
                  rows={4}
                  placeholder="Observações ou informações adicionais sobre o membro..."
                  value={formData.observacoes}
                  onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
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
