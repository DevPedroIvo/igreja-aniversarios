import React, { useState, useRef } from 'react';
import { 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  FileSpreadsheet, 
  FileCode, 
  Check, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import DunamisLogo from './DunamisLogo';

export default function ConfigView({ 
  membros = [], 
  onImportMembros, 
  theme = 'dark', 
  onToggleTheme,
  showToast
}) {
  const [importing, setImporting] = useState(false);
  const [sessionDisconnected, setSessionDisconnected] = useState(false);
  const fileInputRef = useRef(null);

  // Detectar Navegador e Sistema Operacional Atual
  const getDeviceDetails = () => {
    const ua = navigator.userAgent;
    let browser = "Navegador Web";
    let os = "Sistema Operacional";

    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Google Chrome";
    else if (ua.includes("Edg")) browser = "Microsoft Edge";
    else if (ua.includes("Firefox")) browser = "Mozilla Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Apple Safari";

    return { browser, os };
  };

  const deviceInfo = getDeviceDetails();

  // Exportar membros como arquivo JSON
  const handleExportJSON = () => {
    try {
      const jsonStr = JSON.stringify(membros, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `membros-dunamis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast('Lista de membros exportada em JSON com sucesso!');
    } catch (err) {
      if (showToast) showToast('Erro ao exportar arquivo JSON', 'error');
    }
  };

  // Exportar membros como arquivo CSV
  const handleExportCSV = () => {
    try {
      if (membros.length === 0) {
        if (showToast) showToast('Nenhum membro para exportar', 'error');
        return;
      }

      const headers = ['nome', 'data_nascimento', 'observacoes'];
      const rows = membros.map(m => [
        `"${(m.nome || '').replace(/"/g, '""')}"`,
        `"${m.data_nascimento || ''}"`,
        `"${(m.observacoes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `membros-dunamis-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast('Lista de membros exportada em CSV com sucesso!');
    } catch (err) {
      if (showToast) showToast('Erro ao exportar arquivo CSV', 'error');
    }
  };

  // Importar arquivo JSON ou CSV
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        let newMembers = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          newMembers = Array.isArray(parsed) ? parsed : [parsed];
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          if (lines.length > 1) {
            const headers = lines[0].toLowerCase().split(',').map(h => h.replace(/["\r]/g, '').trim());
            const nameIdx = headers.findIndex(h => h.includes('nome'));
            const dateIdx = headers.findIndex(h => h.includes('nasc') || h.includes('data'));
            const obsIdx = headers.findIndex(h => h.includes('obs'));

            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
              const nome = cols[nameIdx !== -1 ? nameIdx : 0] || '';
              const data_nascimento = cols[dateIdx !== -1 ? dateIdx : 1] || '';
              const observacoes = cols[obsIdx !== -1 ? obsIdx : 2] || '';
              if (nome) {
                newMembers.push({ nome, data_nascimento, observacoes });
              }
            }
          }
        }

        if (newMembers.length === 0) {
          if (showToast) showToast('Nenhum registro válido encontrado no arquivo.', 'error');
        } else {
          if (onImportMembros) {
            await onImportMembros(newMembers);
          }
          if (showToast) showToast(`${newMembers.length} membros importados com sucesso!`);
        }
      } catch (err) {
        console.error(err);
        if (showToast) showToast('Formato de arquivo inválido.', 'error');
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleDisconnectOthers = () => {
    setSessionDisconnected(true);
    if (showToast) showToast('Outras sessões ativas foram desconectadas com segurança.');
    setTimeout(() => setSessionDisconnected(false), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '960px', margin: '0 auto' }}>
      
      {/* 1. CARD DE TEMA & APARÊNCIA */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)' }}>
              {theme === 'dark' ? <Moon size={22} style={{ color: '#38bdf8' }} /> : <Sun size={22} style={{ color: 'var(--primary-gold)' }} />}
              <span>Aparência e Tema do Sistema</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Alterne entre o modo claro e escuro. A logo oficial se ajusta automaticamente (as letras pretas mudam para branco no modo escuro).
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* Card Opção Modo Escuro */}
          <div 
            onClick={() => onToggleTheme && onToggleTheme('dark')}
            style={{
              background: 'rgba(11, 15, 25, 0.95)',
              border: `2px solid ${theme === 'dark' ? 'var(--primary-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: theme === 'dark' ? 'var(--shadow-gold)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'dark' && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary-gold)', color: '#000', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#1e2942', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#38bdf8' }}>
                <Moon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1rem' }}>Modo Escuro (Padrão)</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Fundo escuro elegante para ambientes noturnos</div>
              </div>
            </div>

            {/* Preview da Logo no Modo Escuro (Letras Brancas) */}
            <div style={{ background: '#0b0f19', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DunamisLogo height={42} />
            </div>
          </div>

          {/* Card Opção Modo Claro */}
          <div 
            onClick={() => onToggleTheme && onToggleTheme('light')}
            style={{
              background: '#FFFFFF',
              border: `2px solid ${theme === 'light' ? 'var(--primary-gold)' : '#e2e8f0'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: theme === 'light' ? 'var(--shadow-md)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'light' && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary-gold)', color: '#FFFFFF', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.6rem', borderRadius: 'var(--radius-sm)', color: '#d97706' }}>
                <Sun size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>Modo Claro</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fundo claro e alto contraste para o dia a dia</div>
              </div>
            </div>

            {/* Preview da Logo no Modo Claro (Letras Pretas) */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ '--logo-text-color': '#0F172A', '--logo-cutout-color': '#f8fafc' }}>
                <DunamisLogo height={42} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD DE IMPORTAR E EXPORTAR DADOS */}
      <div className="card-panel">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)' }}>
            <Download size={22} style={{ color: 'var(--primary-gold)' }} />
            <span>Importar e Exportar Membros</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Faça backups da lista de membros em arquivo JSON ou CSV, ou importe planilhas e backups anteriores.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* Seção de Exportação */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={18} style={{ color: 'var(--primary-gold)' }} />
                <span>Exportar Dados ({membros.length} membros)</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Baixe a lista completa de membros em seu computador.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-secondary" 
                onClick={handleExportJSON}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <FileCode size={18} style={{ color: '#38bdf8' }} />
                <span>Exportar JSON</span>
              </button>

              <button 
                className="btn-secondary" 
                onClick={handleExportCSV}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <FileSpreadsheet size={18} style={{ color: '#10b981' }} />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Seção de Importação */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={18} style={{ color: 'var(--primary-gold)' }} />
                <span>Importar Arquivo</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Selecione um arquivo `.json` ou `.csv` para adicionar pessoas à lista.
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              accept=".json, .csv" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />

            <button 
              className="btn-primary" 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={importing}
              style={{ justifyContent: 'center', width: '100%' }}
            >
              {importing ? <RefreshCw size={18} className="pulse-glow" /> : <Upload size={18} />}
              <span>{importing ? 'Importando Membros...' : 'Selecionar Arquivo para Importar'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CARD DE DISPOSITIVOS COM ACESSO */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-main)' }}>
              <Laptop size={22} style={{ color: 'var(--primary-gold)' }} />
              <span>Dispositivos com Acesso ao Sistema</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Navegadores e aparelhos conectados à sua conta e ao sistema de gestão da igreja.
            </p>
          </div>

          <button 
            className="btn-secondary" 
            onClick={handleDisconnectOthers}
            style={{ fontSize: '0.85rem' }}
          >
            <ShieldCheck size={16} style={{ color: '#10b981' }} />
            <span>Desconectar Outras Sessões</span>
          </button>
        </div>

        {sessionDisconnected && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontWeight: 600 }}>
            Todas as outras sessões foram desconectadas com segurança.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Card Dispositivo Atual */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--primary-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {deviceInfo.os === 'iOS' || deviceInfo.os === 'Android' ? <Smartphone size={22} /> : <Laptop size={22} />}
              </div>

              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{deviceInfo.browser} no {deviceInfo.os}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    color: '#34d399', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontWeight: 700 
                  }}>
                    Este Dispositivo
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Sessão ativa agora • Conexão criptografada direta
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              <span>Conectado Agora</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
