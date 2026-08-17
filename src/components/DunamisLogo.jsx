import React from 'react';
import logoUrl from '../assets/logo-dunamis.png';

export default function DunamisLogo({ height = 48, showSubtitle = true, className = "" }) {
  return (
    <div className={`dunamis-logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.875rem' }}>
      <img 
        src={logoUrl} 
        alt="Ministério Dunamis - Poder e Graça" 
        style={{ 
          height: `${height}px`, 
          width: 'auto', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.2))'
        }} 
      />
    </div>
  );
}

export function DunamisLogoVector({ height = 50, className = "" }) {
  return (
    <svg 
      viewBox="0 0 500 200" 
      height={height} 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradiente da Chama Dunamis */}
        <linearGradient id="dunamisFlameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="45%" stopColor="#FF3300" />
          <stop offset="85%" stopColor="#D32F2F" />
          <stop offset="100%" stopColor="#B71C1C" />
        </linearGradient>
        <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF5722" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Ícone de Chama Vetorial */}
      <g filter="url(#flameGlow)">
        {/* Chama Externa Base */}
        <path 
          d="M 65,160 C 35,150 15,120 15,90 C 15,65 30,50 40,35 C 45,45 50,55 45,70 C 55,50 70,25 80,5 C 85,35 100,55 115,70 C 125,80 135,95 130,115 C 125,135 110,155 85,162 C 78,164 71,162 65,160 Z" 
          fill="url(#dunamisFlameGradient)" 
        />
        {/* Recorte Curvo Interno (Espaço Negativo S-Curve) */}
        <path 
          d="M 58,155 C 80,140 90,115 85,85 C 82,65 72,48 78,25 C 68,45 52,70 58,100 C 62,120 50,140 58,155 Z" 
          fill="#0B0F19" 
        />
        {/* Chama Interna Brilho Laranja */}
        <path 
          d="M 75,145 C 95,130 102,110 98,85 C 105,98 108,115 95,135 C 88,143 80,146 75,145 Z" 
          fill="#FFA726" 
          opacity="0.8" 
        />
      </g>

      {/* Tipografia Vetorial: Ministério Dunamis */}
      <g fill="currentColor">
        {/* Texto "Ministério" */}
        <text 
          x="150" 
          y="65" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="800" 
          fontSize="36" 
          letterSpacing="0.02em"
          fill="#FFFFFF"
        >
          Ministério
        </text>

        {/* Texto "Dunamis" */}
        <text 
          x="148" 
          y="125" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="56" 
          letterSpacing="0.04em"
          fill="#FFFFFF"
        >
          Dunamis
        </text>

        {/* Subtítulo "Poder e Graça" */}
        <text 
          x="260" 
          y="160" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="800" 
          fontSize="22" 
          letterSpacing="0.05em"
          fill="var(--primary-gold, #F59E0B)"
        >
          Poder e Graça
        </text>
      </g>
    </svg>
  );
}
