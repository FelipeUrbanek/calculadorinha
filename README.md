# Calculadora de Tempo

Uma aplicação web para cálculos de tempo, desenvolvida com React, TypeScript e Tailwind CSS.

## Tecnologias Utilizadas

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- EmailJS (Sistema de Feedback)
- Google Analytics (Métricas de Uso)

## Funcionalidades

- Cálculos precisos de tempo
- Sistema de feedback integrado
- Análise de uso em tempo real
- Interface moderna e responsiva

## Como Executar o Projeto

### Pré-requisitos

- Node.js & npm - [Instale usando nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Configuração do Ambiente

```sh
# 1. Clone o repositório
git clone <URL_DO_REPOSITÓRIO>

# 2. Entre na pasta do projeto
cd calculadorinha

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente (crie um arquivo .env)
VITE_EMAILJS_PUBLIC_KEY=sua_chave_publica
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_GA_TRACKING_ID=seu_id_do_google_analytics

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

## Analytics e Métricas

### Google Analytics

O projeto utiliza Google Analytics para rastrear:

- Número de usuários diários
- Localização dos usuários
- Páginas mais visitadas
- Tempo médio de uso
- Eventos personalizados (envios de feedback, cálculos realizados)

Para acessar as métricas:

1. Acesse o [Google Analytics](https://analytics.google.com)
2. Navegue até o projeto
3. No menu lateral, encontre:
   - Relatórios em tempo real (usuários ativos)
   - Aquisição > Visão geral (origem dos usuários)
   - Público-alvo > Localização (distribuição geográfica)
   - Comportamento > Eventos (interações específicas)

### Sistema de Feedback

O sistema de feedback utiliza EmailJS para:

- Coletar sugestões dos usuários
- Limitar envios (1 por usuário a cada 10 minutos)
- Notificar administradores por email
- Rastrear origem do feedback (página/URL)

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Formas de Editar o Código

### Usando IDE Local

1. Clone o repositório
2. Abra o projeto em sua IDE preferida
3. Faça as alterações necessárias
4. Commit e push das alterações

### Editando Diretamente no GitHub

1. Navegue até o arquivo desejado
2. Clique no botão "Edit" (ícone de lápis)
3. Faça suas alterações
4. Commit das alterações

### Usando GitHub Codespaces

1. Na página principal do repositório, clique no botão "Code"
2. Selecione a aba "Codespaces"
3. Clique em "New codespace"
4. Edite os arquivos diretamente no ambiente Codespace
5. Faça commit e push das alterações
