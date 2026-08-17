import { createClient } from '@supabase/supabase-js';

// Credenciais padrão do Supabase (Conexão Automática Direta)
const DEFAULT_URL = 'https://aqughdyafqvzvqzmzljs.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdWdoZHlhZnF2enZxem16bGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjY4MzEsImV4cCI6MjEwMDQ0MjgzMX0.KtH_SbbkvB4QNwY5kxHfmXJLDWvW-4eOwOHttT2YYwk';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('IGREJA_SUPABASE_URL') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('IGREJA_SUPABASE_ANON_KEY') : null;

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || storedUrl || DEFAULT_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || storedKey || DEFAULT_KEY;

// Verificar se as credenciais são válidas
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://seu-projeto.supabase.co' &&
    supabaseAnonKey !== 'sua-chave-anonima-aqui'
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Dados iniciais de demonstração
const INITIAL_DEMO_MEMBERS = [
  {
    id: '1',
    nome: 'Ana Clara Silva',
    data_nascimento: '1995-08-15',
    observacoes: 'Vocalista principal do louvor',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Carlos Eduardo Souza',
    data_nascimento: '1988-08-03',
    observacoes: 'Coordenador de apoio e recepção',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Beatriz Lima',
    data_nascimento: '2001-01-20',
    observacoes: 'Líder da rede de jovens',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    nome: 'David Oliveira',
    data_nascimento: '1975-11-12',
    observacoes: 'Encarregado do ensino bíblico',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    nome: 'Elena Pereira',
    data_nascimento: '1992-08-28',
    observacoes: 'Professora da Escola Infantil',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    nome: 'Fernando Santos',
    data_nascimento: '1982-03-10',
    observacoes: 'Operador de transmissões ao vivo',
    created_at: new Date().toISOString()
  }
];

// Utilitário para salvar e buscar em LocalStorage
export const getLocalMembers = () => {
  const local = localStorage.getItem('IGREJA_MEMBROS_LOCAL');
  if (local === null) {
    localStorage.setItem('IGREJA_MEMBROS_LOCAL', JSON.stringify(INITIAL_DEMO_MEMBERS));
    return INITIAL_DEMO_MEMBERS;
  }
  try {
    const parsed = JSON.parse(local);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const setLocalMembers = (members) => {
  localStorage.setItem('IGREJA_MEMBROS_LOCAL', JSON.stringify(members));
};

// Funções CRUD Híbridas (Sincronização Infalível Supabase + LocalStorage)

export async function fetchMembros() {
  const localMembers = getLocalMembers();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('nome', { ascending: true });

      if (!error && data && data.length > 0) {
        const combined = [...data];
        const supabaseNames = new Set(data.map(m => (m.nome || '').toLowerCase().trim()));

        localMembers.forEach(lm => {
          if (lm && lm.nome && !supabaseNames.has(lm.nome.toLowerCase().trim())) {
            combined.push(lm);
          }
        });

        setLocalMembers(combined);
        return { data: combined, source: 'supabase', error: null };
      }
    } catch (err) {
      console.error('Exceção ao comunicar com Supabase:', err);
    }
  }

  return { data: localMembers, source: 'local', error: null };
}

export async function createMembro(novoMembro) {
  const payload = {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now() + Math.random()),
    ...novoMembro,
    created_at: new Date().toISOString()
  };

  const members = getLocalMembers();
  const updatedList = [payload, ...members];
  setLocalMembers(updatedList);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('membros').insert([{
        nome: payload.nome,
        data_nascimento: payload.data_nascimento || '',
        observacoes: payload.observacoes || '',
        created_at: payload.created_at
      }]);
    } catch (err) {
      console.error('Erro na sincronização em segundo plano no Supabase:', err);
    }
  }

  return { data: payload, source: 'local' };
}

export async function importBatchMembros(novosMembros) {
  const existing = getLocalMembers();
  const payloads = novosMembros
    .filter(m => m && m.nome && m.nome.trim())
    .map((m, idx) => ({
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now() + idx + Math.random()),
      nome: m.nome.trim(),
      data_nascimento: m.data_nascimento || '',
      observacoes: m.observacoes || '',
      created_at: new Date().toISOString()
    }));

  if (payloads.length === 0) return { data: existing, source: 'local' };

  const updatedList = [...payloads, ...existing];
  setLocalMembers(updatedList);

  if (isSupabaseConfigured() && supabase) {
    try {
      const dbPayloads = payloads.map(p => ({
        nome: p.nome,
        data_nascimento: p.data_nascimento,
        observacoes: p.observacoes,
        created_at: p.created_at
      }));
      await supabase.from('membros').insert(dbPayloads);
    } catch (err) {
      console.error('Erro na inserção em lote com Supabase:', err);
    }
  }

  return { data: updatedList, source: 'local' };
}

export async function updateMembro(id, dadosAtualizados) {
  const members = getLocalMembers();
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...dadosAtualizados };
    setLocalMembers(members);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('membros').update(dadosAtualizados).eq('id', id);
    } catch (err) {
      console.error('Erro ao atualizar no Supabase:', err);
    }
  }

  return { success: true };
}

export async function deleteMembro(id) {
  const members = getLocalMembers();
  const filtered = members.filter(m => m.id !== id);
  setLocalMembers(filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('membros').delete().eq('id', id);
    } catch (err) {
      console.error('Erro ao excluir no Supabase:', err);
    }
  }

  return { success: true };
}

export async function clearAllMembros() {
  localStorage.setItem('IGREJA_MEMBROS_LOCAL', JSON.stringify([]));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('membros').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      console.error('Erro ao apagar membros no Supabase:', err);
    }
  }

  return { success: true };
}
