import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Filter, Edit, Trash2, Phone, Calendar, User, Users, Shield, Sparkles } from 'lucide-react';

export default function MemberList({ membros, onEditMembro, onDeleteMembro, onOpenNewModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' = A-Z, 'desc' = Z-A
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');

  // Obter lista única de ministérios
  const ministerios = useMemo(() => {
    const set = new Set(membros.map(m => m.ministerio).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [membros]);

  // Filtragem e Ordenação Alfabética
  const filteredAndSortedMembros = useMemo(() => {
    return membros
      .filter(m => {
        const matchesSearch = 
          (m.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.telefone || '').includes(searchTerm) ||
          (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (m.ministerio || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMinistry = selectedMinistry === 'ALL' || m.ministerio === selectedMinistry;

        return matchesSearch && matchesMinistry;
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
  }, [membros, searchTerm, sortOrder, selectedMinistry]);

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

  // Formatar número para link direto do WhatsApp
  const getWhatsAppLink = (phoneStr, nameStr) => {
    if (!phoneStr) return null;
    const cleanNum = phoneStr.replace(/\D/g, '');
    const numWithCountry = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
    const msg = encodeURIComponent(`A paz do Senhor, ${nameStr}!`);
    return `https://wa.me/${numWithCountry}?text=${msg}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Métricas Principais */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-val">{membros.length}</div>
            <div className="stat-label">Membros Cadastrados</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <ArrowUpDown size={24} />
          </div>
          <div>
            <div className="stat-val">{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</div>
            <div className="stat-label">Ordem Alfabética</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Shield size={24} />
          </div>
          <div>
            <div className="stat-val">{ministerios.length > 1 ? ministerios.length - 1 : 1}</div>
            <div className="stat-label">Ministérios / Cargos</div>
          </div>
        </div>
      </div>

      {/* Barra de Controles e Filtros */}
      <div className="controls-bar">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou ministério..."
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

          {/* Filtro de Ministério */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select 
              value={selectedMinistry} 
              onChange={(e) => setSelectedMinistry(e.target.value)}
              style={{ width: 'auto', paddingRight: '2rem' }}
            >
              <option value="ALL">Todos os Ministérios</option>
              {ministerios.filter(m => m !== 'ALL').map(min => (
                <option key={min} value={min}>{min}</option>
              ))}
            </select>
          </div>
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
                  <th>Membro</th>
                  <th>Data de Nascimento</th>
                  <th>Contato / WhatsApp</th>
                  <th>Ministério / Cargo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedMembros.map(membro => {
                  const waLink = getWhatsAppLink(membro.telefone, membro.nome);
                  return (
                    <tr key={membro.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                          <div className="member-avatar">
                            {getInitials(membro.nome)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{membro.nome}</div>
                            {membro.email && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{membro.email}</div>
                            )}
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
                        {membro.telefone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>{membro.telefone}</span>
                            {waLink && (
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn-whatsapp"
                                title="Enviar mensagem no WhatsApp"
                              >
                                <Phone size={12} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Não informado</span>
                        )}
                      </td>

                      <td>
                        <span className="ministry-tag">
                          {membro.ministerio || 'Membro'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
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
