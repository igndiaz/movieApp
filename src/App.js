import React, { useState, useEffect, useCallback } from 'react';

// --- Iconos ---
const FilmIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
);
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const CalendarPlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="16" x2="12" y2="22"></line><line x1="9" y1="19" x2="15" y2="19"></line></svg>
);
const HomeIcon = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const ListIcon = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
);

function App() {
  const [currentPage, setCurrentPage] = useState('suggester');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="mb-8 text-center w-full max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-4 flex items-center justify-center">
            <FilmIcon className="w-10 h-10 mr-3 text-sky-400" />
            <span>Sugeridor de Películas</span>
        </h1>
        <nav className="flex justify-center gap-4 bg-slate-800 p-2 rounded-xl">
            <button 
                onClick={() => setCurrentPage('suggester')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${currentPage === 'suggester' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                <HomeIcon className="w-5 h-5"/>
                Sugeridor
            </button>
            <button 
                onClick={() => setCurrentPage('recommendations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${currentPage === 'recommendations' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                <ListIcon className="w-5 h-5"/>
                Recomendaciones
            </button>
        </nav>
      </header>
      
      <main className="w-full max-w-4xl">
        {currentPage === 'suggester' && <SuggesterPage />}
        {currentPage === 'recommendations' && <RecommendationsPage />}
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500"><p>Creado para ayudarte a encontrar tu próxima película favorita.</p><p>Datos y posters provistos por <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">TMDb</a>.</p></footer>
      <style>{`.animate-fadeIn { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } ::-webkit-scrollbar { height: 8px; } ::-webkit-scrollbar-track { background: #1e293b; } ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }`}</style>
    </div>
  );
}

// --- Componente para la página del Sugeridor ---
const SuggesterPage = () => {
    const API_KEY = 'c580d4653f4683e1df9473b6a8016355'; 
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [startYear, setStartYear] = useState(1980);
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    const [suggestedMovie, setSuggestedMovie] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchGenres = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
            if (!response.ok) throw new Error('Respuesta de red no fue exitosa.');
            const data = await response.json();
            setGenres(data.genres || []);
          } catch (error) {
            setErrorMessage("No se pudieron cargar los géneros.");
          }
        };
        fetchGenres();
    }, [API_KEY]);

    const getMovieDetails = useCallback(async (movieId, language) => {
        try {
          const response = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}`);
          return await response.json();
        } catch (error) {
          return null;
        }
    }, [API_KEY]);

    const handleSuggestion = async () => {
        setSuggestedMovie(null);
        setErrorMessage('');
        setIsLoading(true);

        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
            setErrorMessage("Por favor, introduce un rango de años válido.");
            setIsLoading(false);
            return;
        }

        let apiUrl = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31&vote_average.gte=7&vote_count.gte=500`;
        if (selectedGenre) apiUrl += `&with_genres=${selectedGenre}`;

        try {
            const initialResponse = await fetch(apiUrl);
            const initialData = await initialResponse.json();
            if (!initialData.results || initialData.results.length === 0) {
                setErrorMessage("No se encontraron películas con esos criterios.");
                setIsLoading(false);
                return;
            }
            
            const totalPages = Math.min(initialData.total_pages, 500);
            const pageToFetch = Math.floor(Math.random() * totalPages) + 1;
            const pageResponse = await fetch(`${apiUrl}&page=${pageToFetch}`);
            const pageData = await pageResponse.json();
            
            if (pageData.results && pageData.results.length > 0) {
                const randomMovieFromList = pageData.results[Math.floor(Math.random() * pageData.results.length)];
                const [detailsEs, detailsEn] = await Promise.all([getMovieDetails(randomMovieFromList.id, 'es-ES'), getMovieDetails(randomMovieFromList.id, 'en-US')]);

                if (detailsEs && detailsEn) {
                    const letterboxdSlug = detailsEs.original_title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').replace(/--+/g, '-');
                    const letterboxdUrl = `https://letterboxd.com/film/${letterboxdSlug}/`;
                    const finalMovieObject = {
                        id: detailsEs.id,
                        englishTitle: detailsEn.title,
                        originalTitle: detailsEs.original_title,
                        originalLanguage: detailsEs.original_language,
                        year: detailsEs.release_date ? new Date(detailsEs.release_date).getFullYear() : 'N/A',
                        genres: detailsEs.genres.map(g => g.name),
                        tmdbRating: detailsEs.vote_average,
                        imdbLink: detailsEs.imdb_id ? `https://www.imdb.com/title/${detailsEs.imdb_id}/` : '',
                        letterboxdLink: letterboxdUrl,
                        posterUrl: detailsEs.poster_path ? `${IMAGE_BASE_URL}${detailsEs.poster_path}` : 'https://placehold.co/500x750/1e293b/94a3b8?text=Sin+Imagen',
                        runtime: detailsEs.runtime || 120
                    };
                    setSuggestedMovie(finalMovieObject);
                } else {
                     setErrorMessage("No se pudieron obtener los detalles de la película.");
                }
            } else {
                setErrorMessage("No se encontraron películas en la página aleatoria.");
            }
        } catch (error) {
            setErrorMessage("Ocurrió un error al buscar.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="animate-fadeIn">
            <section className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 space-y-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="genre" className="text-sm font-medium text-sky-300">Género:</label>
                    <select id="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                      <option value="">Cualquier Género</option>
                      {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="startYear" className="text-sm font-medium text-sky-300">Desde el Año:</label>
                    <input type="number" id="startYear" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value, 10))} min="1900" max={new Date().getFullYear()} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="endYear" className="text-sm font-medium text-sky-300">Hasta el Año:</label>
                    <input type="number" id="endYear" value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value, 10))} min="1900" max={new Date().getFullYear()} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" />
                  </div>
                </div>
                <div className="text-xs text-slate-400 text-center px-2"><p>Criterio de calificación: TMDb ≥ 7.0</p></div>
                <button onClick={handleSuggestion} disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 disabled:bg-slate-500 disabled:cursor-not-allowed">
                  {isLoading ? 'Buscando...' : <><FilmIcon className="w-5 h-5" /><span>Sugerir Película</span></>}
                </button>
            </section>

            {errorMessage && <div className="p-4 bg-red-700/50 border border-red-500 text-red-300 rounded-lg text-center mb-12"><p>{errorMessage}</p></div>}
            
            {suggestedMovie && (
              <section className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 animate-fadeIn mb-12">
                <h2 className="text-2xl font-bold text-sky-300 border-b border-slate-600 pb-3 mb-6">Tu Sugerencia</h2>
                <MovieCard movie={suggestedMovie} />
              </section>
            )}
        </div>
    );
}

// --- Componente para la página de Recomendaciones (Ahora carga desde Gist) ---
const RecommendationsPage = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [startYear, setStartYear] = useState(1980);
    const [endYear, setEndYear] = useState(new Date().getFullYear());

    const GIST_URL = 'https://gist.githubusercontent.com/igndiaz/9be7507b0fd5e120eaff7126f59d637f/raw/c8406e446f66bb63c3164b2dc8de6fdbd83df809/recommendation.json';

    // Cargar películas desde Gist y géneros desde TMDb
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch genres
                const genreResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=c580d4653f4683e1df9473b6a8016355&language=es-ES`);
                if (!genreResponse.ok) throw new Error('No se pudieron cargar los géneros.');
                const genreData = await genreResponse.json();
                setGenres(genreData.genres || []);

                // Fetch recommendations
                const movieResponse = await fetch(GIST_URL);
                if (!movieResponse.ok) throw new Error('No se pudo obtener la lista de recomendaciones.');
                const movieData = await movieResponse.json();
                setAllMovies(movieData);
                setFilteredMovies(movieData);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [GIST_URL]);
    
    // Aplicar filtros cuando cambien
    useEffect(() => {
        let movies = [...allMovies];
        
        if (startYear && endYear) {
            movies = movies.filter(m => m.year >= startYear && m.year <= endYear);
        }

        // **NUEVO**: Filtrado por género habilitado
        if (selectedGenre) {
            movies = movies.filter(movie => 
                movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
            );
        }

        setFilteredMovies(movies);

    }, [selectedGenre, startYear, endYear, allMovies]);


    if (isLoading) {
        return <div className="text-center text-slate-400 p-10">Cargando recomendaciones...</div>;
    }

    if (error) {
        return <div className="p-4 bg-red-700/50 border border-red-500 text-red-300 rounded-lg text-center"><p>{error}</p></div>;
    }

    return (
        <section className="space-y-6 animate-fadeIn">
          <h2 className="text-3xl font-bold text-sky-300 border-b border-slate-700 pb-3">Nuestras Recomendaciones</h2>
          
          <div className="bg-slate-800/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="rec-genre" className="text-sm font-medium text-sky-300">Filtrar por Género</label>
                <select id="rec-genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5">
                  <option value="">Todos los Géneros</option>
                  {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="rec-startYear" className="text-sm font-medium text-sky-300">Desde el Año</label>
                <input type="number" id="rec-startYear" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="rec-endYear" className="text-sm font-medium text-sky-300">Hasta el Año</label>
                <input type="number" id="rec-endYear" value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5" />
              </div>
          </div>

          <div className="space-y-8">
            {filteredMovies.length > 0 ? (
                filteredMovies.map(movie => (
                    <FeaturedMovieCard key={movie.id} movie={movie} />
                ))
            ) : (
                <p className="text-slate-400 text-center py-4">No hay recomendaciones que coincidan con tus filtros.</p>
            )}
          </div>
        </section>
    );
}


// --- Componente reutilizable para la tarjeta de película sugerida ---
const MovieCard = ({ movie }) => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('20:00');
    
    useEffect(() => {
        const today = new Date();
        setScheduleDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    }, []);

    const handleSchedule = (movieToSchedule) => {
        if (!movieToSchedule || !scheduleDate || !scheduleTime) return;
        const [year, month, day] = scheduleDate.split('-').map(Number);
        const [hours, minutes] = scheduleTime.split(':').map(Number);
        const startDate = new Date(year, month - 1, day, hours, minutes);
        
        const movieDuration = movieToSchedule.runtime || 120;
        const endDate = new Date(startDate.getTime() + movieDuration * 60 * 1000);

        const toGoogleFormat = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
        const eventTitle = `Ver película: ${movieToSchedule.englishTitle}`;
        const eventDetails = `Película sugerida por la app.\n\n${movieToSchedule.imdbLink ? `Ver en IMDB: ${movieToSchedule.imdbLink}\n` : ''}Ver en Letterboxd: ${movieToSchedule.letterboxdLink}`;
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${toGoogleFormat(startDate)}/${toGoogleFormat(endDate)}&details=${encodeURIComponent(eventDetails)}`;
        window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 w-full md:w-1/3 mx-auto md:mx-0">
              <img src={movie.posterUrl} alt={`Póster de ${movie.englishTitle}`} className="w-full h-auto object-cover rounded-lg shadow-md" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x750/1e293b/94a3b8?text=Sin+Imagen'; }} />
            </div>
            <div className="flex-grow flex flex-col">
                <h3 className="text-2xl sm:text-3xl font-semibold text-sky-300 mb-2 text-center md:text-left">{movie.englishTitle}</h3>
                {movie.originalLanguage && movie.originalLanguage !== 'en' && <p className="text-md text-slate-400 -mt-1 mb-4 text-center md:text-left italic">({movie.originalTitle})</p>}
                <div className="grid grid-cols-1 gap-4 mb-4 text-sm"><div className="flex items-center space-x-2 bg-slate-600/30 p-3 rounded-md"><CalendarIcon className="w-5 h-5 text-sky-400"/><p><span className="font-semibold">Año:</span> {movie.year}</p></div><div className="flex items-center space-x-2 bg-slate-600/30 p-3 rounded-md"><FilmIcon className="w-5 h-5 text-sky-400"/><p><span className="font-semibold">Géneros:</span> {movie.genres.join(', ')}</p></div></div>
                <div className="grid grid-cols-1 gap-4 mb-6"><div className="bg-slate-600/30 p-3 rounded-md text-center"><p className="font-semibold mb-1">TMDb Rating:</p><p className="text-2xl font-bold text-yellow-400 flex items-center justify-center"><StarIcon className="w-6 h-6 mr-1 text-yellow-400"/> {movie.tmdbRating.toFixed(1)} <span className="text-sm text-slate-400">/ 10</span></p></div></div>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                  {movie.imdbLink && <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-center transition duration-150 w-full sm:w-auto">Ver en IMDB</a>}
                  <a href={movie.letterboxdLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-center transition duration-150 w-full sm:w-auto">Ver en Letterboxd</a>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-600"><h3 className="text-lg font-semibold text-sky-300 mb-3 text-center md:text-left">Agendar en Calendario</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"><div><label htmlFor="schedule-date" className="block text-sm font-medium text-slate-300 mb-1">Fecha</label><input type="date" id="schedule-date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"/></div><div><label htmlFor="schedule-time" className="block text-sm font-medium text-slate-300 mb-1">Hora</label><input type="time" id="schedule-time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"/></div></div><button onClick={() => handleSchedule(movie)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center space-x-2"><CalendarPlusIcon className="size-5"/><span>Agendar en Google Calendar</span></button></div>
            </div>
        </div>
    );
}


// --- Componente reutilizable para la tarjeta de película destacada ---
const FeaturedMovieCard = ({ movie }) => {
    // **NUEVO**: Añadimos estado para fecha y hora
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('20:00');

    useEffect(() => {
        const today = new Date();
        setScheduleDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    }, []);

    const handleSchedule = () => {
        if (!movie || !scheduleDate || !scheduleTime) return;
        const [year, month, day] = scheduleDate.split('-').map(Number);
        const [hours, minutes] = scheduleTime.split(':').map(Number);
        const startDate = new Date(year, month - 1, day, hours, minutes);
        
        // **CORRECCIÓN**: Usar la duración de la película para calcular la fecha de fin
        const movieDuration = movie.runtime || 120; // fallback de 120 min
        const endDate = new Date(startDate.getTime() + movieDuration * 60 * 1000);

        const toGoogleFormat = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
        const eventTitle = `Ver película: ${movie.englishTitle}`;
        const eventDetails = `Película recomendada.\n\n${movie.imdbLink ? `Ver en IMDB: ${movie.imdbLink}\n` : ''}Ver en Letterboxd: ${movie.letterboxdLink}`;
        const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${toGoogleFormat(startDate)}/${toGoogleFormat(endDate)}&details=${encodeURIComponent(eventDetails)}`;
        window.open(calendarUrl, '_blank', 'noopener,noreferrer');
    };
    
    const posterSrc = movie.posterUrl || 'https://placehold.co/200x300/1e293b/94a3b8?text=Sin+Imagen';

    return (
        <div className="bg-slate-800 shadow-2xl rounded-xl p-4 flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 w-48 mx-auto sm:mx-0">
                <img 
                    src={posterSrc}
                    alt={`Póster de ${movie.englishTitle}`} 
                    className="w-full h-auto rounded-lg" 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/1e293b/94a3b8?text=Sin+Imagen'; }}
                />
            </div>
            <div className="flex flex-col flex-grow">
                <h3 className="font-bold text-2xl text-white mb-2">{movie.englishTitle}</h3>
                <p className="text-slate-400 mb-4 flex-grow">{movie.review}</p>
                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                    <a href={movie.imdbLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-sm transition">Ver en IMDB</a>
                    <a href={movie.letterboxdLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-green-500 hover:bg-green-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-sm transition">Ver en Letterboxd</a>
                    <button onClick={handleSchedule} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition flex items-center justify-center gap-2">
                        <CalendarPlusIcon className="w-4 h-4" /> <span>Agendar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
