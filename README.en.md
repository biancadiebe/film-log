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
- Sort the current page by relevance, newest release date, or oldest release date; display the release year on movie posters.
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

### Bonus feature decisions

The original optional requirement is “Filter by Genre or Year.” To address the year-related part, I chose to let users sort results by relevance, newest release date, or oldest release date rather than requiring them to enter a specific year. The cards also display each movie's release year. This approach makes it possible to explore results chronologically without knowing the exact year in advance. Sorting applies only to the movies on the current page; it is not the same as filtering by a specific year, and genre filtering is not available.

Other optional features and improvements were left for future study and development. Given the deadline, I prioritized the quality of the core requirements and selected features, reusing the existing structure and keeping the experience cohesive.

Numbered pagination was chosen over infinite scrolling because a TMDB search can return many movies. Page numbers make navigation more visible and organized and let users jump directly to a page instead of relying on automatic loading while scrolling. Search uses the pagination provided by TMDB. The rated-movies section divides the ratings already received from the backend into frontend pages of eight cards.

### Scope decisions

In addition to the mandatory requirements, I implemented some of the optional features proposed in the assignment, such as numbered pagination and sorting results by release date. Given the deadline, I had to prioritize which bonus features to develop, aiming to deliver a cohesive application with the implemented features working well and integrated into the user experience. Other improvements may be part of a future evolution of the project, which I also intend to use to keep studying and putting new knowledge into practice.

## What is being evaluated

- **TMDB API consumption:** the backend requests movie data from TMDB and maps it to the fields used by the frontend.
- **Backend API creation:** Django REST Framework endpoints support movie search and details as well as rating list, create/update, and delete operations.
- **React state management:** the frontend tracks the selected page and movie, search results, current ratings, and request states.
- **Loading and error handling:** the interface displays progress and useful feedback for failed requests and empty results.
- **Database usage:** MongoDB persists validated ratings, with one rating per TMDB movie ID.

## Technology stack

| Area | Technology | How it is used |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | React and TypeScript meet the requested stack and build the interface and its stateful interactions. Vite provides the frontend development server and production build process. |
| Styling | Tailwind CSS | Styles the responsive interface with utility classes in components, reducing the need to maintain many separate CSS files. It was also chosen as a learning opportunity. |
| Backend | Python, Django, Django REST Framework | Python meets the requested stack. Django provides the backend structure, while Django REST Framework creates JSON endpoints and validates/serializes ratings. Django was also chosen because it is used by the company and offered a chance to study it in practice. |
| Database | MongoDB 8, Django MongoDB Backend | Stores movie ratings through Django's model and database integration. |
| Movie data | TMDB API | Provides movie search results, details, posters, genres, and cast information. |
| Infrastructure | Docker, Docker Compose, Nginx | Docker meets the assignment's infrastructure requirement. Docker Compose coordinates the frontend, backend, and MongoDB with one command; Nginx serves the built frontend files. |

### Why MongoDB?

I chose MongoDB because it is a database I have been studying extensively at university. Using it in FilmLog gave me a practical way to deepen that knowledge and work with it in a different kind of application. The rating is represented by a Django model and persisted in MongoDB through Django MongoDB Backend.

### Why React, TypeScript, and Vite?

React and TypeScript are part of the assignment requirements. I chose Vite because it provides a fast development server, keeps the interface updated during development, and offers a straightforward production build. It integrates well with this React frontend and meets the project's development and build needs without adding unnecessary complexity.

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

The first run may take a few minutes while Docker downloads base images and installs dependencies.

### What do `-d` and `--build` mean?

- `-d` (*detached*) starts the containers in the background and releases the terminal. Without `-d`, logs remain visible in the terminal; press `Ctrl+C` to stop the services.
- `--build` rebuilds the images before starting the containers. Use it after changing code included in the images or the Dockerfiles.

To build the images and run the application in the background:

```bash
docker compose up --build -d
```

If the images are already up to date and you only want to start the services in the background:

```bash
docker compose up -d
```

To stop and remove the containers, run:

```bash
docker compose down
```

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

- **Claude:** helped structure the project as a whole and also contributed to the backend.
- **GitHub Copilot:** helped me assemble the frontend and fix potential bugs.
- **Figma Make:** helped create an initial visual design base for the screens.

These tools supported the development process; I reviewed and tested the resulting application and am responsible for understanding the implementation and its technical decisions.

## Attribution

FilmLog uses the TMDB API and movie images from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
