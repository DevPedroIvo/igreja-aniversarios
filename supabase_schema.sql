-- ========================================================
-- SCRIPT DE CRIAÇÃO DA TABELA DE MEMBROS NO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase
-- ========================================================

-- 1. Criar a tabela 'membros' se não existir
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar a Segurança por Linha (RLS)
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- 3. Criar Políticas de acesso anônimo (Leitura, Inserção, Atualização, Exclusão)
DROP POLICY IF EXISTS "Permitir leitura anonima" ON public.membros;
DROP POLICY IF EXISTS "Permitir insercao anonima" ON public.membros;
DROP POLICY IF EXISTS "Permitir atualizacao anonima" ON public.membros;
DROP POLICY IF EXISTS "Permitir exclusao anonima" ON public.membros;

CREATE POLICY "Permitir leitura anonima" ON public.membros FOR SELECT USING (true);
CREATE POLICY "Permitir insercao anonima" ON public.membros FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualizacao anonima" ON public.membros FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusao anonima" ON public.membros FOR DELETE USING (true);

-- 4. Inserir membros iniciais de exemplo
INSERT INTO public.membros (nome, data_nascimento, observacoes)
VALUES 
    ('Ana Clara Silva', '1995-08-15', 'Vocalista principal do louvor'),
    ('Carlos Eduardo Souza', '1988-08-03', 'Coordenador de apoio e recepção'),
    ('Beatriz Lima', '2001-01-20', 'Líder da rede de jovens'),
    ('David Oliveira', '1975-11-12', 'Encarregado do ensino bíblico'),
    ('Elena Pereira', '1992-08-28', 'Professora da Escola Infantil'),
    ('Fernando Santos', '1982-03-10', 'Operador de transmissões ao vivo')
ON CONFLICT DO NOTHING;
