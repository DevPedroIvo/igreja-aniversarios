import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Edit, Trash2, Calendar, User, Users, FileText } from 'lucide-react';

export default function MemberList({ membros, onEditMembro, onDeleteMembro, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' = A-Z, 'desc' = Z-A

  // Filtragem por Busca e Ordenação Alfabética
  const filteredAndSortedMembros = useMemo(() => {
    return membros
      .filter(m => {
        const term = searchTerm.toLowerCase();
        const matchesName = (m.nome || '').toLowerCase().includes(term);
        const matchesObs = (m.observacoes || '').toLowerCase().includes(term);

        return matchesName || matchesObs;
      })
      .sort((a, b) => {
        const nameA = (a.nome || '').toLowerCase();
        const nameB = (b.nome || '').toLowerCase();
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB, 'pt-BR');
        } else {
          return nameB.localeCompare(nameA, 'pt-BR');
        }
      });
  }, [membros, searchTerm, sortOrder]);

  // Função para formatar data (AAAA-MM-DD -> DD/MM/AAAA)
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Gerar iniciais para o avatar
  const getInitials = (name) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="animate-fade-in">
      {/* Barra de Controles e Filtros */}
      <div className="controls-bar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar membro por nome ou observações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          {/* Botão de alternar Ordem Alfabética */}
          <button 
            className="btn-secondary"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title="Alternar Ordem Alfabética"
          >
            <ArrowUpDown size={16} />
            <span>{sortOrder === 'asc' ? 'Ordem A-Z' : 'Ordem Z-A'}</span>
          </button>
        </div>
      </div>

      {/* Tabela Principal de Membros */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} style={{ color: 'var(--primary-gold)' }} />
            <span>Lista de Membros ({filteredAndSortedMembros.length})</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ordenado Alfabeticamente
          </span>
        </div>

        {filteredAndSortedMembros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <User size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nenhum membro encontrado</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {searchTerm ? 'Tente ajustar os termos de pesquisa.' : 'Cadastre seu primeiro membro no botão acima.'}
            </p>
            <button className="btn-primary" onClick={onOpenNewModal} style={{ margin: '0 auto' }}>
              Cadastrar Novo Membro
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome Completo</th>
                  <th>Data de Nascimento</th>
                  <th>Observações</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedMembros.map(membro => {
                  return (
                    <tr key={membro.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div className="member-avatar">
                            {getInitials(membro.nome)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{membro.nome}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="date-tag">
                          <Calendar size={14} style={{ color: 'var(--primary-gold)' }} />
                          <span>{formatDate(membro.data_nascimento)}</span>
                        </div>
                      </td>

                      <td>
                        {membro.observacoes ? (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <FileText size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                            <span>{membro.observacoes}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', italic: 'true' }}>Sem observações</span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '0.4rem 0.6rem' }}
                            onClick={() => onEditMembro(membro)}
                            title="Editar Dados"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn-secondary" 
                            style={{ padding: '0.4rem 0.6rem', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                            onClick={() => onDeleteMembro(membro.id, membro.nome)}
                            title="Excluir Membro"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
