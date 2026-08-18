import React, { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff, ShieldCheck, Sun, Moon } from 'lucide-react';
import DunamisLogo from './DunamisLogo';

export default function LoginView({ onLogin, theme = 'dark', onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Por favor, informe seu usuário ou e-mail.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Por favor, informe sua senha.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      const isValid = (u === 'admin' || u === 'dunamis') && (p === 'ministerio[' || p === 'ministerio' || p === 'dunamis123');

      if (isValid) {
        onLogin({
          name: u === 'admin' ? 'Administrador' : username,
          role: 'Líder / Administrador',
          loggedAt: new Date().toISOString()
        });
      } else {
        setErrorMsg('Usuário ou senha incorretos.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main, #0b0f19)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Botão de Tema no Topo Direito da Tela de Login */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button
          type="button"
          onClick={() => onToggleTheme && onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--bg-subcard)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} style={{ color: 'var(--primary-gold)' }} />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon size={16} style={{ color: '#38bdf8' }} />
              <span>Modo Escuro</span>
            </>
          )}
        </button>
      </div>

      {/* Card Principal de Login */}
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-gold)',
        textAlign: 'center'
      }}>
        
        {/* Logo Dunamis Oficial */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <DunamisLogo height={64} />
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          Ministério Dunamis
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Gestão de Membros & Aniversariantes
        </p>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            textAlign: 'left'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          {/* Campo Usuário / E-mail */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} style={{ color: 'var(--primary-gold)' }} />
              <span>Usuário ou E-mail</span>
            </label>
            <input 
              type="text" 
              placeholder="Digite seu usuário (Ex: admin)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          {/* Campo Senha */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} style={{ color: 'var(--primary-gold)' }} />
              <span>Senha</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Digite sua senha (Ex: admin)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 1rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Dica de Acesso Oficial */}
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-subcard)',
            padding: '0.6rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            🔑 <strong>Acesso do Sistema:</strong> Usuário <code>admin</code> | Senha <code>ministerio[</code>
          </div>

          {/* Botão de Entrar */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justify: 'center',
              padding: '0.875rem',
              fontSize: '1rem',
              marginTop: '0.5rem'
            }}
          >
            <LogIn size={20} />
            <span>{loading ? 'Entrando...' : 'Entrar no Sistema'}</span>
          </button>
        </form>
      </div>

      {/* Rodapé da Tela de Login */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <ShieldCheck size={16} style={{ color: '#10b981' }} />
        <span>Conexão Criptografada • © {new Date().getFullYear()} Ministério Dunamis</span>
      </div>
    </div>
  );
}
