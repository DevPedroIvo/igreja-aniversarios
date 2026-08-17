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

// Dados iniciais de demonstração (caso o banco ainda esteja sendo conectado)
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

// Utilitário para salvar e buscar em LocalStorage caso Supabase não esteja configurado
const getLocalMembers = () => {
  const local = localStorage.getItem('IGREJA_MEMBROS_LOCAL');
  if (!local) {
    localStorage.setItem('IGREJA_MEMBROS_LOCAL', JSON.stringify(INITIAL_DEMO_MEMBERS));
    return INITIAL_DEMO_MEMBERS;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return INITIAL_DEMO_MEMBERS;
  }
};

const setLocalMembers = (members) => {
  localStorage.setItem('IGREJA_MEMBROS_LOCAL', JSON.stringify(members));
};

// Funções CRUD Abstratas (Supabase com fallback LocalStorage)

export async function fetchMembros() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar membros no Supabase:', error);
        return { data: getLocalMembers(), source: 'local', error };
      }

      return { data: data || [], source: 'supabase', error: null };
    } catch (err) {
      console.error('Exceção ao comunicar com Supabase:', err);
      return { data: getLocalMembers(), source: 'local', error: err };
    }
  }

  return { data: getLocalMembers(), source: 'local', error: null };
}

export async function createMembro(novoMembro) {
  const payload = {
    ...novoMembro,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('membros')
        .insert([payload])
        .select();

      if (error) {
        console.error('Erro ao cadastrar membro no Supabase:', error);
        throw error;
      }
      return { data: data[0], source: 'supabase' };
    } catch (err) {
      console.error('Falha no Supabase, salvando localmente:', err);
    }
  }

  // Fallback LocalStorage
  const members = getLocalMembers();
  const createdMember = {
    ...payload,
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now())
  };
  const updatedList = [createdMember, ...members];
  setLocalMembers(updatedList);
  return { data: createdMember, source: 'local' };
}

export async function updateMembro(id, dadosAtualizados) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('membros')
        .update(dadosAtualizados)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data: data[0], source: 'supabase' };
    } catch (err) {
      console.error('Erro ao atualizar no Supabase:', err);
    }
  }

  // LocalStorage fallback
  const members = getLocalMembers();
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...dadosAtualizados };
    setLocalMembers(members);
    return { data: members[index], source: 'local' };
  }
  throw new Error('Membro não encontrado');
}

export async function deleteMembro(id) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, source: 'supabase' };
    } catch (err) {
      console.error('Erro ao excluir no Supabase:', err);
    }
  }

  // LocalStorage fallback
  const members = getLocalMembers();
  const filtered = members.filter(m => m.id !== id);
  setLocalMembers(filtered);
  return { success: true, source: 'local' };
}
