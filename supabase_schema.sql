-- ========================================================
-- SCRIPT DE CRIAÇÃO DA TABELA DE MEMBROS NO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase
-- ========================================================

-- 1. Criar a tabela 'membros' se não existir
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone TEXT,
    email TEXT,
    ministerio TEXT DEFAULT 'Membro',
    status TEXT DEFAULT 'Ativo',
    data_batismo DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar a Segurança por Linha (RLS)
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- 3. Criar Política permitindo leitura pública (Anon)
CREATE POLICY "Permitir leitura anonima" 
ON public.membros 
FOR SELECT 
USING (true);

-- 4. Criar Política permitindo inserção pública (Anon)
CREATE POLICY "Permitir insercao anonima" 
ON public.membros 
FOR INSERT 
WITH CHECK (true);

-- 5. Criar Política permitindo atualização pública (Anon)
CREATE POLICY "Permitir atualizacao anonima" 
ON public.membros 
FOR UPDATE 
USING (true);

-- 6. Criar Política permitindo exclusão pública (Anon)
CREATE POLICY "Permitir exclusao anonima" 
ON public.membros 
FOR DELETE 
USING (true);

-- 7. Inserir dados iniciais de exemplo (Opcional)
INSERT INTO public.membros (nome, data_nascimento, telefone, email, ministerio, status, observacoes)
VALUES 
    ('Ana Clara Silva', '1995-08-15', '(11) 98765-4321', 'ana.clara@email.com', 'Louvor', 'Ativo', 'Vocalista'),
    ('Carlos Eduardo Souza', '1988-08-03', '(11) 91234-5678', 'carlos.souza@email.com', 'Diaconato', 'Ativo', 'Equipe de apoio'),
    ('Beatriz Lima', '2001-01-20', '(11) 97777-8888', 'beatriz.lima@email.com', 'Jovens', 'Ativo', 'Líder dos jovens'),
    ('David Oliveira', '1975-11-12', '(11) 99999-0000', 'david.oliveira@email.com', 'Presbitério', 'Ativo', 'Presbítero'),
    ('Elena Pereira', '1992-08-28', '(11) 94444-3333', 'elena.p@email.com', 'Infantil', 'Ativo', 'Professora EBD'),
    ('Fernando Santos', '1982-03-10', '(11) 95555-6666', 'fernando.s@email.com', 'Mídia & Som', 'Ativo', 'Mesa de Som')
ON CONFLICT DO NOTHING;
