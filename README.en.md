# FilmLog

[Leia em português](./README.md)

FilmLog is a movie search and rating application built for the 2026 Web Development Internship test. You can search The Movie Database (TMDB), inspect movie details, rate movies from 1 to 5, and manage your rated-movie list.

The interface is currently in Brazilian Portuguese.

## Project goal

The goal was to build a complete web application that connects a React frontend, a Python backend, a movie data provider, and a database. The project also provided an opportunity to practice API integration, application state, data validation, and containerized development.

## Features

### Implemented

#### Main page

- Search for movies using TMDB and display results with titles, posters, and release dates.
- Navigate search results with numbered pagination, including previous/next controls and ellipses for long page lists.
- Show loading, empty, and error states during search.

#### Movie details modal

- Show a movie's synopsis, release date, genres, and up to six cast members.
- Create a rating from 1 to 5, update it, or delete it.
- Show loading and error feedback while retrieving details or saving changes.

#### Rated Movies page

- List rated movies with their posters, titles, and scores.
- Navigate rated movies using numbered pages.
- Open a movie's details from the list.
- Persist ratings in MongoDB.

#### Delivery

- Run the frontend, backend, and database together with Docker Compose.

### Not implemented

The following optional features from the assignment are not implemented in this version:

- **Genre or year filters:** searches use a text query only.
- **Authentication:** ratings are not associated with individual accounts; the list is shared by anyone using the same application and database.
- **Caching:** movie data is requested from TMDB when needed and is not cached by the application.
- **Automated application tests:** the backend test modules are still Django's default placeholders.

Search results use numbered pagination provided by TMDB. The rated-movies list also uses numbered pagination, implemented in the frontend with eight cards per page from the ratings loaded by the backend.

## What is being evaluated

- **TMDB API consumption:** the backend requests movie data from TMDB and maps it to the fields used by the frontend.
- **Backend API creation:** Django REST Framework endpoints support movie search and details as well as rating list, create/update, and delete operations.
- **React state management:** the frontend tracks the selected page and movie, search results, current ratings, and request states.
- **Loading and error handling:** the interface displays progress and useful feedback for failed requests and empty results.
- **Database usage:** MongoDB persists validated ratings, with one rating per TMDB movie ID.

## Technology stack

| Area | Technology | How it is used |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | Builds the search, movie details, and rated-movies interfaces. React state manages requests, loading and error feedback, and rating changes. |
| Styling | Tailwind CSS | Styles the responsive interface and its reusable components. |
| Backend | Python, Django, Django REST Framework | Exposes the application's REST API, validates rating data, and coordinates requests to TMDB. |
| Database | MongoDB 8, Django MongoDB Backend | Stores movie ratings through Django's model and database integration. |
| Movie data | TMDB API | Provides movie search results, details, posters, genres, and cast information. |
| Infrastructure | Docker, Docker Compose, Nginx | Builds and serves the frontend and starts the backend and MongoDB services. |

### Why MongoDB?

I chose MongoDB because it is a database I have been studying extensively at university. Using it in FilmLog gave me a practical way to deepen that knowledge and work with it in a different kind of application. The rating is represented by a Django model and persisted in MongoDB through Django MongoDB Backend.

## Application flow

1. The React application sends movie-search and detail requests to the Django API.
2. The backend calls TMDB with the API key kept on the server and returns only the fields the interface needs.
3. Rating requests are validated by Django REST Framework and saved to MongoDB.
4. With Docker Compose, the backend connects to MongoDB using the internal service name `mongo`.

## Run the application with Docker Compose

### Requirements

- Git
- Docker Desktop with Docker Compose
- A TMDB API key. Create an account and request a key through the [TMDB developer documentation](https://developer.themoviedb.org/docs/getting-started).

### Step-by-step

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/biancadiebe/film-log.git
   cd film-log
   ```

2. Copy `.env.example` to `.env`.

   In Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   In macOS, Linux, or Git Bash:

   ```bash
   cp .env.example .env
   ```

3. Open the new `.env` file and add your TMDB key:

   ```dotenv
   TMDB_API_KEY=your_tmdb_api_key
   ```

   Replace `your_tmdb_api_key` with your own key. Keep `.env` private; it is excluded from Git.

4. Build the images and start the application with one command:

   ```bash
   docker compose up --build
   ```

5. Open **http://localhost:3000** in your browser. The Django API is available at **http://localhost:8000/api**.

The first run may take a few minutes while Docker downloads base images and installs dependencies. Without `-d`, logs are shown in the terminal; keep it open while using the application and press `Ctrl+C` to stop the services.

To start the containers in the background, use `docker compose up --build -d`. The `-d` option releases the terminal, but does not rebuild the images. To include recent code or Dockerfile changes, add `--build`, for example: `docker compose up --build -d`. If nothing has changed, use `docker compose up -d` to start the services again. To stop and remove the containers, run `docker compose down`.

## REST API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/movies/search/?query=<title>` | Search movies in TMDB. The backend also accepts an optional `page` query parameter. |
| `GET` | `/api/movies/<tmdb_id>/` | Get movie details, including genres and cast. |
| `GET` | `/api/ratings/` | List saved ratings. |
| `GET` | `/api/ratings/<tmdb_id>/` | Get a saved rating for a movie. |
| `PUT` | `/api/ratings/<tmdb_id>/` | Create or update a movie rating. |
| `DELETE` | `/api/ratings/<tmdb_id>/` | Delete a movie rating. |

## What I learned

Building FilmLog helped me practice how to connect a React/TypeScript interface to a Django REST API, organize frontend state around asynchronous requests, and provide useful loading and error feedback. I also gained hands-on experience with TMDB integration, server-side API-key configuration, rating validation and persistence with MongoDB, and running related services with Docker Compose.

## AI and design tools

- **Claude:** helped me structure the backend project.
- **GitHub Copilot (this assistant):** helped me assemble the frontend and address potential bugs.
- **Figma Make:** helped create an initial visual design base for the screens.

These tools supported the development process; I reviewed and tested the resulting application and am responsible for understanding the implementation and its technical decisions.

## Attribution

FilmLog uses the TMDB API and movie images from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
