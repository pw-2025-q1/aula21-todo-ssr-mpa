# ToDo! - Aplicação SSR MPA

Este projeto é uma aplicação de lista de tarefas (ToDo) desenvolvida utilizando o padrão de projeto **MVC** (Model-View-Controller). A aplicação utiliza renderização no servidor (SSR - Server-Side Rendering) e segue o conceito de MPA (Multi-Page Application).

## Estrutura do Projeto

O projeto está organizado de acordo com o padrão MVC, no qual cada camada tem uma preocupação específica:

- **Model (Modelo)**: Gerencia a lógica de negócios e a interação com o banco de dados.
  - Localizado em `src/models/`.
  - Classes principais: `TodoRepository`, `Database`, `Config`.

- **View (Visão)**: Responsável pela interface com o usuário.
  - Localizado em `views/`.
  - Utiliza templates Handlebars para renderizar as páginas.
  - Exemplos: `newest.handlebars`, `add.handlebars`, `error.handlebars`.

- **Controller (Controlador)**: Atua como intermediário entre o modelo e a visão.
  - Localizado em `src/controllers/`.
  - Classes principais: `TodoController`, `ErrorController`.

## Funcionalidades

- Adicionar, editar e remover tarefas.
- Listar tarefas mais recentes ou mais antigas.
- Agrupar tarefas por tags.
- Exibir mensagens de erro e sucesso.

## Devcontainer

Este projeto é compatível com o [Devcontainer](https://code.visualstudio.com/docs/remote/devcontainer-overview) do Visual Studio Code. Você pode utilizá-lo no ambiente GitHub Codespaces ou localmente, desde que tenha o Docker instalado.
O arquivo `devcontainer.json` contém as configurações necessárias para criar um ambiente de desenvolvimento isolado.

O container inclui as seguintes dependências:

- Node.js
- TypeScript
- MongoDB (servidor e cliente)
- ts-node
- nodemon

## Estrutura de Arquivos

```plaintext
/workspaces/todo-ssr-mpa
├── src/
│   ├── server.ts              # Ponto de entrada da aplicação
│   ├── controllers/           # Controladores (C no MVC)
│   │   ├── todoController.ts  # Lida com rotas relacionadas a tarefas
│   │   ├── errorController.ts # Lida com erros da aplicação
│   ├── models/                # Modelos (M no MVC)
│   │   ├── model.ts           # Repositório e lógica de dados
│   │   ├── database.ts        # Conexão com o banco de dados
├── views/                     # Visões (V no MVC)
│   ├── add.handlebars         # Página para adicionar tarefas
│   ├── error.handlebars       # Página de erros
│   ├── newest.handlebars      # Página de tarefas mais recentes
│   ├── oldest.handlebars      # Página de tarefas mais antigas
│   ├── tags.handlebars        # Página de agrupamento por tags
│   ├── layouts/               # Layouts reutilizáveis
│   └── partials/              # Partials reutilizáveis
├── static/                    # Arquivos estáticos (CSS, imagens, etc.)
│   ├── style.css              # Estilos personalizados
│   └── bootstrap.min.css      # Estilos do Bootstrap
├── package.json               # Configuração do projeto Node.js
├── tsconfig.json              # Configuração do TypeScript
└── README.md                  # Documentação do projeto
```

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework para criação de servidores web.
- **Handlebars**: Motor de templates para renderização de páginas.
- **TypeScript**: Superset do JavaScript para tipagem estática.
- **Bootstrap**: Framework CSS para estilização.

## Como executar o projeto

1. Inicie o container do Devcontainer.
2. Abra o terminal integrado no Visual Studio Code.
3. Execute o comando `npm install` para instalar as dependências.
4. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento.
5. Acesse a aplicação no navegador em `http://localhost:3000`.


