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
- Exibir estados de carregamento, resultados vazios e erros durante a busca.

#### Modal de detalhes do filme

- Exibir sinopse, data de lançamento, gêneros e até seis integrantes do elenco.
- Criar uma avaliação de 1 a 5, editá-la ou excluí-la.
- Exibir feedbacks de carregamento e erro ao buscar detalhes ou salvar alterações.

#### Página de filmes avaliados

- Listar filmes avaliados com pôster, título e nota.
- Abrir os detalhes de um filme a partir da lista.
- Persistir as avaliações no MongoDB.

#### Entrega

- Executar frontend, backend e banco de dados juntos usando Docker Compose.

### Não implementadas

As funcionalidades opcionais abaixo foram deixadas de fora para manter o foco na implementação completa dos recursos obrigatórios:

- **Paginação ou rolagem infinita:** os resultados exibem a primeira página retornada pelo TMDB; não há controles para carregar mais resultados.
- **Filtros por gênero ou ano:** a busca usa apenas um termo de texto.
- **Autenticação:** as avaliações não são associadas a contas individuais; qualquer pessoa que use a mesma aplicação e o mesmo banco de dados verá a mesma lista.
- **Cache:** os dados dos filmes são consultados no TMDB quando necessário e não são armazenados em cache pela aplicação.
- **Testes automatizados da aplicação:** os módulos de teste do backend ainda são os arquivos padrão do Django, sem testes específicos do projeto.

## O que está sendo avaliado

- **Consumo da API do TMDB:** o backend consulta os dados dos filmes no TMDB e os adapta aos campos usados pelo frontend.
- **Criação da API do backend:** os endpoints do Django REST Framework permitem buscar filmes e consultar detalhes, além de listar, criar/atualizar e excluir avaliações.
- **Gerenciamento de estado no React:** o frontend controla a página e o filme selecionados, os resultados da busca, as avaliações e o estado das requisições.
- **Carregamento e tratamento de erros:** a interface informa o progresso e apresenta feedbacks para falhas nas requisições e resultados vazios.
- **Uso do banco de dados:** o MongoDB persiste avaliações validadas, com uma avaliação por ID de filme do TMDB.

## Tecnologias utilizadas

| Área | Tecnologia | Como é utilizada |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | Constrói as telas de busca, detalhes e filmes avaliados. O estado do React controla as requisições, os feedbacks de carregamento e erro e as mudanças nas avaliações. |
| Estilização | Tailwind CSS | Estiliza a interface responsiva e seus componentes reutilizáveis. |
| Backend | Python, Django, Django REST Framework | Disponibiliza a API REST da aplicação, valida os dados das avaliações e coordena as requisições ao TMDB. |
| Banco de dados | MongoDB 8, Django MongoDB Backend | Armazena as avaliações usando a integração de modelos e banco de dados do Django. |
| Dados de filmes | API do TMDB | Fornece resultados de busca, detalhes, pôsteres, gêneros e informações do elenco. |
| Infraestrutura | Docker, Docker Compose, Nginx | Constrói e serve o frontend e inicia os serviços do backend e do MongoDB. |

### Por que escolhi MongoDB?

Escolhi o MongoDB porque é um banco de dados que estou estudando bastante na faculdade. Usá-lo no FilmLog foi uma forma prática de aprofundar meus estudos e desenvolver mais conhecimento com ele em diferentes situações. A avaliação é representada por um modelo Django e persistida no MongoDB por meio do Django MongoDB Backend.

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

Na primeira execução, o processo pode levar alguns minutos enquanto o Docker baixa as imagens-base e instala as dependências. Mantenha o terminal aberto enquanto usa a aplicação. Pressione `Ctrl+C` para parar os serviços; execute `docker compose down` para parar e remover os contêineres.

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

- **Claude:** ajudou a estruturar o projeto do backend.
- **GitHub Copilot (este assistente):** ajudou na montagem do frontend e na correção de eventuais bugs.
- **Figma Make:** ajudou a criar uma base inicial de design para as telas.

Essas ferramentas apoiaram o processo de desenvolvimento; revisei e testei a aplicação resultante e sou responsável por compreender a implementação e as decisões técnicas.

## Atribuição

O FilmLog utiliza a API do TMDB e imagens de filmes do TMDB. Este produto utiliza a API do TMDB, mas não é endossado nem certificado pelo TMDB.
