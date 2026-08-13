import React from 'react';
import { Church, Github, Heart } from 'lucide-react';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Church size={18} style={{ color: 'var(--primary-gold)' }} />
          <span>Sistema Interno da Igreja • Gestão de Membros & Aniversariantes</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Hospedado via <Github size={14} /> GitHub Pages
          </span>
        </div>
      </div>
    </footer>
  );
}
