<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">E-commerce Maria Francine - Vestidos de Festa Infantis</h1>

<p align="center">Projeto de e-commerce para venda de vestidos de festa junina e fantasias para o público infantil.</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Configuração Inicial do Projeto

1.  **Clone o repositório (se ainda não o fez):**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd ecommerce-maria-francine
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    *   Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
        ```bash
        # No Windows (CMD ou PowerShell)
        copy .env.example .env
        # No Linux/macOS
        # cp .env.example .env
        ```
    *   Abra o arquivo `.env` e preencha com as suas credenciais do banco de dados MySQL e outras configurações necessárias:
        ```env
        DATABASE_HOST=seu_host_mysql
        DATABASE_PORT=3306
        DATABASE_USER=seu_usuario_mysql
        DATABASE_PASSWORD=sua_senha_mysql
        DATABASE_NAME=seu_banco_de_dados
        PORT=3000
        NODE_ENV=development
        ```
    *   **IMPORTANTE:** Certifique-se de que o arquivo `.env` está listado no seu `.gitignore` para não versionar suas credenciais.

4.  **Crie o banco de dados:** Certifique-se de que o banco de dados especificado em `DATABASE_NAME` exista no seu servidor MySQL.

## Rodando o Projeto

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Próximos Passos Sugeridos

1.  **Definir Entidades do Banco de Dados (TypeORM):**
    *   Criar entidades para `Produto`, `Categoria`, `Usuario`, `Pedido`, `ItemPedido`, etc., na pasta `src/database/entities` (ou onde preferir).
    *   Exemplo de entidade `Produto`: `src/produto/entities/produto.entity.ts`

2.  **Criar Módulos, Controllers e Services para cada funcionalidade principal:**
    *   **Módulo de Produtos:** Para gerenciar o CRUD de produtos, listagem, busca, etc.
        *   `nest g module produto`
        *   `nest g controller produto --no-spec`
        *   `nest g service produto --no-spec`
    *   **Módulo de Categorias:** Para gerenciar categorias de produtos.
    *   **Módulo de Autenticação/Usuários:** Para login, registro de clientes.
    *   **Módulo de Carrinho:** Para gerenciar o carrinho de compras.
    *   **Módulo de Pedidos:** Para finalizar compras e gerenciar pedidos.

3.  **Implementar as Views (EJS):**
    *   Criar arquivos `.ejs` na pasta `views` para as páginas do e-commerce (home, produto, carrinho, checkout, etc.).
    *   Utilizar os controllers para renderizar essas views com os dados necessários.

4.  **Estilização e Frontend:**
    *   Adicionar arquivos CSS, JavaScript (para interatividade no cliente) e imagens na pasta `public`.
    *   Considerar o uso de um framework CSS como Bootstrap ou Tailwind CSS para agilizar a estilização.

5.  **Integrações:**
    *   Meios de pagamento (Stripe, MercadoPago).
    *   Cálculo de frete (Correios).

## Estrutura de Pastas Principal

```
ecommerce-maria-francine/
├── public/             # Arquivos estáticos (CSS, JS cliente, imagens)
├── src/
│   ├── app.controller.ts # Controller principal da aplicação
│   ├── app.module.ts     # Módulo principal da aplicação
│   ├── app.service.ts    # Service principal da aplicação
│   ├── config/           # Arquivos de configuração (ex: typeorm.config.ts)
│   ├── database/         # Entidades, migrações, seeds do TypeORM
│   ├── main.ts           # Arquivo de inicialização da aplicação
│   └── [outros_modulos]/ # Módulos específicos (ex: produto, usuario)
├── test/
├── views/              # Arquivos de template EJS
├── .env.example        # Exemplo de arquivo de variáveis de ambiente
├── .gitignore          # Arquivos e pastas ignorados pelo Git
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json
```
