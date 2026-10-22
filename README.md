# FilmLog

[Read in English](./README.en.md)

FilmLog é uma aplicação de busca e avaliação de filmes desenvolvida para o teste de Web Development Internship de 2026. É possível pesquisar filmes no The Movie Database (TMDB), consultar detalhes, dar notas de 1 a 5 e gerenciar uma lista de filmes avaliados.

A interface está atualmente em português do Brasil.

## Objetivo do projeto

O objetivo foi desenvolver uma aplicação web completa que conecta um frontend em React, um backend em Python, um provedor de dados de filmes e um banco de dados. O projeto também foi uma oportunidade para praticar integração de APIs, gerenciamento de estado, validação de dados e desenvolvimento com contêineres.

## Funcionalidades

### Implementadas

#### Página principal

- Buscar filmes no TMDB e exibir resultados com títulos, pôsteres e datas de lançamento.
- Navegar pelos resultados com paginação numerada, incluindo controles de página anterior/próxima e reticências para listas longas.
- Ordenar os resultados da página atual por relevância, data mais recente ou mais antiga; exibir o ano de lançamento nos pôsteres.
- Exibir estados de carregamento, resultados vazios e erros durante a busca.

#### Modal de detalhes do filme

- Exibir sinopse, data de lançamento, gêneros e até seis integrantes do elenco.
- Criar uma avaliação de 1 a 5, editá-la ou excluí-la.
- Exibir feedbacks de carregamento e erro ao buscar detalhes ou salvar alterações.

#### Página de filmes avaliados

- Listar filmes avaliados com pôster, título e nota.
- Navegar pelas avaliações usando páginas numeradas.
- Abrir os detalhes de um filme a partir da lista.
- Persistir as avaliações no MongoDB.

#### Entrega

- Executar frontend, backend e banco de dados juntos usando Docker Compose.

### Decisões sobre os bônus

O requisito opcional original é “Filter by Genre or Year”. Para atender à parte relacionada ao ano, optei por oferecer ordenação dos resultados por relevância, data mais recente ou mais antiga, em vez de exigir que a pessoa informe um ano específico. Os cards também exibem o ano de lançamento dos filmes. Essa abordagem permite explorar os resultados cronologicamente sem precisar conhecer previamente o ano exato. A ordenação é aplicada somente aos filmes da página atual; ela não equivale a filtrar por um ano específico nem implementa a filtragem por gênero.

Os demais recursos opcionais e melhorias que não entraram nesta versão ficaram para estudos e evolução futura. Considerando o prazo, priorizei a qualidade dos requisitos principais e dos recursos selecionados, reaproveitando a estrutura existente e mantendo uma experiência coesa.

A paginação numerada foi escolhida em vez de rolagem infinita porque uma busca no TMDB pode retornar muitos filmes. Os números deixam a navegação mais visual e organizada e permitem ir diretamente a uma página, em vez de depender do carregamento automático durante a rolagem. Na busca, o backend usa a paginação fornecida pelo TMDB. Na seção de filmes avaliados, o frontend divide as avaliações já recebidas do backend em páginas de oito cards.

### Decisões de escopo

Além dos requisitos obrigatórios, implementei alguns dos recursos opcionais propostos no teste, como a paginação numerada e a ordenação dos resultados por data de lançamento. Com o prazo, precisei priorizar quais funcionalidades bônus desenvolver, buscando entregar uma aplicação coesa, com os recursos implementados funcionando bem e integrados à experiência do usuário. Outras melhorias ficaram para uma possível evolução futura do projeto, que também pretendo utilizar para continuar estudando e colocando novos conhecimentos em prática.

## O que está sendo avaliado

- **Consumo da API do TMDB:** o backend consulta os dados dos filmes no TMDB e os adapta aos campos usados pelo frontend.
- **Criação da API do backend:** os endpoints do Django REST Framework permitem buscar filmes e consultar detalhes, além de listar, criar/atualizar e excluir avaliações.
- **Gerenciamento de estado no React:** o frontend controla a página e o filme selecionados, os resultados da busca, as avaliações e o estado das requisições.
- **Carregamento e tratamento de erros:** a interface informa o progresso e apresenta feedbacks para falhas nas requisições e resultados vazios.
- **Uso do banco de dados:** o MongoDB persiste avaliações validadas, com uma avaliação por ID de filme do TMDB.

## Tecnologias utilizadas

| Área | Tecnologia | Como é utilizada |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | React e TypeScript atendem à stack solicitada e são usados para construir a interface e controlar estados e interações. Vite oferece o servidor de desenvolvimento e o processo de build da aplicação frontend. |
| Estilização | Tailwind CSS | Estiliza a interface responsiva com classes utilitárias diretamente nos componentes, reduzindo a necessidade de manter vários arquivos CSS separados. Também foi escolhido como oportunidade de estudo. |
| Backend | Python, Django, Django REST Framework | Python atende à stack solicitada. Django fornece a estrutura do backend e Django REST Framework é usado para criar endpoints JSON e validar/serializar avaliações. Django também foi escolhido por ser uma tecnologia utilizada pela empresa e por ser uma oportunidade de estudá-lo na prática. |
| Banco de dados | MongoDB 8, Django MongoDB Backend | Armazena as avaliações usando a integração de modelos e banco de dados do Django. |
| Dados de filmes | API do TMDB | Fornece resultados de busca, detalhes, pôsteres, gêneros e informações do elenco. |
| Infraestrutura | Docker, Docker Compose, Nginx | Docker atende ao requisito de infraestrutura do teste. Docker Compose coordena frontend, backend e MongoDB em um único comando; Nginx serve os arquivos do frontend compilado. |

### Por que escolhi MongoDB?

Escolhi o MongoDB porque é um banco de dados que estou estudando bastante na faculdade. Usá-lo no FilmLog foi uma forma prática de aprofundar meus estudos e desenvolver mais conhecimento com ele em diferentes situações. A avaliação é representada por um modelo Django e persistida no MongoDB por meio do Django MongoDB Backend.

### Por que escolhi React, TypeScript e Vite?

React e TypeScript fazem parte dos requisitos do teste. Escolhi Vite por oferecer um servidor de desenvolvimento rápido, atualização da interface durante o desenvolvimento e um processo direto para gerar os arquivos de produção. Ele se integra bem ao frontend React deste projeto e atende às necessidades de desenvolvimento e build sem acrescentar complexidade desnecessária.

## Como a aplicação funciona

1. O React envia as requisições de busca e detalhes de filmes para a API Django.
2. O backend consulta o TMDB usando uma chave mantida no servidor e retorna apenas os campos necessários para a interface.
3. As avaliações são validadas pelo Django REST Framework e salvas no MongoDB.
4. No Docker Compose, o backend se conecta ao MongoDB pelo nome interno do serviço `mongo`.

## Executar a aplicação com Docker Compose

### Pré-requisitos

- Git
- Docker Desktop com Docker Compose
- Uma chave de API do TMDB. Crie uma conta e solicite uma chave pela [documentação para desenvolvedores do TMDB](https://developer.themoviedb.org/docs/getting-started).

### Passo a passo

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/biancadiebe/film-log.git
   cd film-log
   ```

2. Copie o arquivo `.env.example` para `.env`.

   No Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   No macOS, Linux ou Git Bash:

   ```bash
   cp .env.example .env
   ```

3. Abra o novo arquivo `.env` e informe sua chave do TMDB:

   ```dotenv
   TMDB_API_KEY=sua_chave_tmdb
   ```

   Substitua `sua_chave_tmdb` pela sua própria chave. Mantenha o `.env` privado; ele é ignorado pelo Git.

4. Construa as imagens e inicie a aplicação com um único comando:

   ```bash
   docker compose up --build
   ```

5. Acesse **http://localhost:3000** no navegador. A API Django fica disponível em **http://localhost:8000/api**.

Na primeira execução, o processo pode levar alguns minutos enquanto o Docker baixa as imagens-base e instala as dependências.

### O que significam `-d` e `--build`?

- `-d` (*detached*) inicia os contêineres em segundo plano e libera o terminal. Sem `-d`, os logs ficam visíveis no terminal; pressione `Ctrl+C` para parar os serviços.
- `--build` reconstrói as imagens antes de iniciar os contêineres. Use-o quando alterar o código incluído nas imagens ou os Dockerfiles.

Para construir as imagens e deixar a aplicação rodando em segundo plano:

```bash
docker compose up --build -d
```

Se as imagens já estiverem atualizadas e você só quiser iniciar os serviços em segundo plano:

```bash
docker compose up -d
```

Para parar e remover os contêineres, execute:

```bash
docker compose down
```

## API REST

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `GET` | `/api/movies/search/?query=<título>` | Buscar filmes no TMDB. O backend também aceita o parâmetro opcional `page`. |
| `GET` | `/api/movies/<tmdb_id>/` | Consultar detalhes do filme, incluindo gêneros e elenco. |
| `GET` | `/api/ratings/` | Listar avaliações salvas. |
| `GET` | `/api/ratings/<tmdb_id>/` | Consultar a avaliação salva de um filme. |
| `PUT` | `/api/ratings/<tmdb_id>/` | Criar ou atualizar uma avaliação. |
| `DELETE` | `/api/ratings/<tmdb_id>/` | Excluir uma avaliação. |

## O que aprendi

Desenvolver o FilmLog me ajudou a praticar a conexão de uma interface React/TypeScript com uma API REST em Django, a organização do estado do frontend para requisições assíncronas e a apresentação de feedbacks úteis de carregamento e erro. Também ganhei experiência prática com a integração do TMDB, configuração de chaves no servidor, validação e persistência de avaliações no MongoDB e execução de serviços relacionados com Docker Compose.

## Inteligência artificial e ferramentas de design

- **Claude:** ajudou a estruturar o projeto como um todo e também contribuiu com a parte do backend.
- **GitHub Copilot:** ajudou na montagem do frontend e na correção de eventuais bugs.
- **Figma Make:** ajudou a criar uma base inicial de design para as telas.

Essas ferramentas apoiaram o processo de desenvolvimento; revisei e testei a aplicação resultante e sou responsável por compreender a implementação e as decisões técnicas.

## Atribuição

O FilmLog utiliza a API do TMDB e imagens de filmes do TMDB. Este produto utiliza a API do TMDB, mas não é endossado nem certificado pelo TMDB.
