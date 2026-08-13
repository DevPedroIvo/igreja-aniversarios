# Sistema Interno da Igreja — Gestão de Membros & Aniversariantes

Sistema web moderno, responsivo e de alta performance desenvolvido para gestão eclesiástica interna, cadastro de membros, ordenação alfabética e acompanhamento dos aniversariantes por mês ("Mêsversários").

---

## 🌟 Funcionalidades Principais

- 📋 **Lista de Membros Alfabética (A-Z e Z-A)**: Visualização em tabela responsiva com ordenação instantânea, busca rápida (nome, telefone, e-mail, ministério) e botão direto de mensagem para o WhatsApp.
- 🎂 **Aniversariantes do Mês ("Mêsversários")**: Aba dedicada aos aniversariantes agrupados por mês (Janeiro a Dezembro), com cálculo automático da idade a ser completada, destaque com chuva de confetes para aniversariantes de hoje e atalho pré-formatado para felicitações no WhatsApp!
- ➕ **Cadastro & Edição de Membros**: Formulário modal rápido para cadastrar novos membros com nome, data de nascimento, telefone, e-mail, ministério/cargo e observações.
- ⚡ **Integração com Supabase**: Conexão nativa com banco de dados relacional em nuvem Supabase.
- 🌐 **Hospedagem no GitHub**: Configuração pronta para implantação automática e gratuita no GitHub Pages via GitHub Actions.

---

## 🚀 Como Executar o Projeto Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar no navegador**:
   Abra o link exibido no terminal (geralmente `http://localhost:3000`).

---

## 🗄️ Configuração do Banco de Dados Supabase

1. Crie uma conta ou acesse o seu projeto no [Supabase](https://supabase.com).
2. Vá no **SQL Editor** do seu painel Supabase.
3. Execute o script contido no arquivo [`supabase_schema.sql`](./supabase_schema.sql) (ou copie diretamente pelo botão dentro do próprio app).
4. Obtenha a **URL do Projeto** e a **Chave Anon (Public)** nas configurações de API do Supabase.
5. Crie um arquivo `.env` na raiz do projeto com o seguinte formato (ou cole diretamente no modal de configurações da aplicação):
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

---

## 📦 Como Publicar no GitHub (GitHub Pages)

1. Crie um repositório no GitHub para sua igreja (ex: `sistema-igreja`).
2. Envie os arquivos do projeto para a branch principal (`main`):
   ```bash
   git init
   git add .
   git commit -m "Inicializar Sistema da Igreja"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/sistema-igreja.git
   git push -u origin main
   ```
3. No repositório do GitHub, vá em **Settings** > **Pages** e selecione **Source: GitHub Actions**.
4. Em **Settings** > **Secrets and variables** > **Actions**, adicione os Segredos:
   - `VITE_SUPABASE_URL`: Sua URL do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Sua Chave Anon do Supabase.
5. O site será compilado e publicado automaticamente em minutos!

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Vite
- **Estilização**: CSS Vanilla com Design System customizado (Dark Mode, Glassmorphism, Gold & Navy Palette)
- **Ícones**: Lucide React
- **Efeitos**: Canvas Confetti
- **Banco de Dados**: Supabase (PostgreSQL)
