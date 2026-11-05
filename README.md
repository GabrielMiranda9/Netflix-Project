# Netflix Project

Sistema acadêmico (Disciplina 16 – Análise e Desenvolvimento de Sistemas) para pesquisa, avaliação e favoritos de filmes e séries.
Aplicação web estática (HTML + CSS + JavaScript), sem servidor e sem banco de dados remoto: os dados ficam no `localStorage` do navegador.

## Funcionalidades

**Iteração 1:** cadastro, login, pesquisa por título, detalhes, avaliação, favoritos e área administrativa simples.

**Iteração 2:**
- Filtros por tipo (Filme/Série) e gênero, e ordenação por título, ano ou nota média.
- Nota média calculada a partir das avaliações dos usuários (uma avaliação por usuário por título, editável).
- Tela de perfil: alterar nome e senha.
- Administração: adicionar, editar e excluir conteúdos; promover/rebaixar e excluir usuários; restaurar dados de demonstração.
- Validações de formulário e proteção contra injeção de HTML nos textos exibidos.
- Código organizado em `index.html`, `css/` e `js/`.

## Pré-requisitos

- Um navegador atual (Chrome, Edge, Firefox).
- Git (para clonar o repositório).
- Opcional: Python 3 ou Node.js, apenas para abrir via servidor local.

## Como executar no seu computador

1. Clone o repositório e entre na pasta:
   ```
   git clone https://github.com/GabrielMiranda9/Netflix-Project.git
   cd Netflix-Project
   ```
2. Para usar o código da Iteração 2, vá para a versão marcada:
   ```
   git checkout v2
   ```
   (Para voltar à última versão: `git checkout main`.)
3. Abra a aplicação de **uma** destas formas:
   - **Direto no navegador:** dê dois cliques em `index.html`.
   - **Servidor local (opcional):** na pasta do projeto, rode `python -m http.server 8000` (ou `npx serve .`) e acesse `http://localhost:8000`.

## Contas de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@netflix.com | 1234 |
| Usuário | user@netflix.com | 1234 |

Também é possível criar uma conta nova na tela inicial (senha com no mínimo 4 caracteres).

## Roteiro rápido de verificação

1. Entre como usuário, filtre por "Série" e ordene por nota média.
2. Abra um título, envie uma avaliação e confira a nota média; edite a avaliação depois.
3. Favorite um título e veja-o em "Favoritos".
4. Em "Perfil", altere o nome.
5. Entre como administrador, adicione um conteúdo, edite-o e exclua-o.

## Estrutura do projeto

```
Netflix-Project/
├── index.html      # estrutura das telas
├── css/style.css   # estilos
├── js/app.js       # lógica da aplicação e acesso ao localStorage
└── README.md
```

## Dados e limitações

- Os dados são gravados no navegador (chaves `np2_*` do `localStorage`) e não são compartilhados entre navegadores ou computadores.
- Para limpar tudo: use "Restaurar dados de demonstração" na área administrativa ou limpe os dados do site no navegador.
- Senhas são guardadas em texto simples apenas porque este é um protótipo acadêmico; um sistema real usaria servidor, banco de dados e senhas com hash.

## Controle de versão

- `v1`: entrega da Iteração 1.
- `iteracao2`: branch de trabalho da Iteração 2 (mantida no repositório).
- `v2`: entrega da Iteração 2.
- A branch principal deste repositório se chama `main`.
