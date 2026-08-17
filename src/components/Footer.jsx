import React from 'react';
import { Heart } from 'lucide-react';
import DunamisLogo from './DunamisLogo';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 1.5rem',
      background: 'rgba(11, 15, 25, 0.95)',
      marginTop: 'auto',
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <DunamisLogo height={32} />
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>• Gestão de Membros & Aniversariantes</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
          <span>© {new Date().getFullYear()} Ministério Dunamis • Poder e Graça</span>
        </div>
      </div>
    </footer>
  );
}
