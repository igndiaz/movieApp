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

function App() {
  // Clave de API de The Movie Database (TMDb)
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
  
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('20:00');

  // Cargar la lista de géneros desde la API al montar el componente
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
        if (!response.ok) {
            throw new Error('Respuesta de red no fue exitosa. Verifica tu API Key.');
        }
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setErrorMessage("No se pudieron cargar los géneros. Revisa la consola o tu API key.");
      }
    };
    fetchGenres();
  }, [API_KEY]);

  // Función para obtener detalles de una película en un idioma específico
  const getMovieDetails = useCallback(async (movieId, language) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${language}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie details in ${language}:`, error);
      return null;
    }
  }, [API_KEY]);

  // Lógica principal para obtener la sugerencia
  const handleSuggestion = async () => {
    setSuggestedMovie(null);
    setErrorMessage('');
    setIsLoading(true);

    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
      setErrorMessage("Por favor, introduce un rango de años válido.");
      setIsLoading(false);
      return;
    }

    let apiUrl = `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc`;
    apiUrl += '&include_adult=false&include_video=false';
    apiUrl += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    apiUrl += `&vote_average.gte=7&vote_count.gte=500`;
    if (selectedGenre) {
      apiUrl += `&with_genres=${selectedGenre}`;
    }

    try {
      const initialResponse = await fetch(apiUrl);
      const initialData = await initialResponse.json();

      if (!initialData.results || initialData.results.length === 0) {
        setErrorMessage("No se encontraron películas que cumplan con todos los criterios. ¡Intenta ampliar tu búsqueda!");
        setIsLoading(false);
        return;
      }
      
      const totalPages = Math.min(initialData.total_pages, 500);
      const pageToFetch = Math.floor(Math.random() * totalPages) + 1;

      const pageResponse = await fetch(`${apiUrl}&page=${pageToFetch}`);
      const pageData = await pageResponse.json();
      
      if (pageData.results && pageData.results.length > 0) {
        const randomMovieFromList = pageData.results[Math.floor(Math.random() * pageData.results.length)];
        
        const [detailsEs, detailsEn] = await Promise.all([
            getMovieDetails(randomMovieFromList.id, 'es-ES'),
            getMovieDetails(randomMovieFromList.id, 'en-US')
        ]);

        if(detailsEs && detailsEn){
            const letterboxdSlug = detailsEs.original_title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-');
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
                posterUrl: detailsEs.poster_path ? `${IMAGE_BASE_URL}${detailsEs.poster_path}` : 'https://placehold.co/500x750/1e293b/94a3b8?text=Sin+Imagen'
            };
            setSuggestedMovie(finalMovieObject);
            const today = new Date();
            setScheduleDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
        } else {
             setErrorMessage("No se pudieron obtener los detalles de la película sugerida.");
        }
      } else {
        setErrorMessage("No se encontraron películas en la página aleatoria. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error fetching movie suggestion:", error);
      setErrorMessage("Ocurrió un error al buscar películas. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSchedule = () => {
    if (!suggestedMovie || !scheduleDate || !scheduleTime) return;
    const [year, month, day] = scheduleDate.split('-').map(Number);
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const toGoogleFormat = (date) => date.toISOString().replace(/-|:|\.\d{3}/g, '');
    const googleStartDate = toGoogleFormat(startDate);
    const googleEndDate = toGoogleFormat(endDate);
    const eventTitle = `Ver película: ${suggestedMovie.englishTitle}`;
    const eventDetails = `Película sugerida por la app.\nAño: ${suggestedMovie.year}\nGéneros: ${suggestedMovie.genres.join(', ')}\n\n${suggestedMovie.imdbLink ? `Ver en IMDB: ${suggestedMovie.imdbLink}\n` : ''}Ver en Letterboxd: ${suggestedMovie.letterboxdLink}`;
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(eventDetails)}`;
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-2 flex items-center justify-center"><FilmIcon className="w-10 h-10 mr-3 text-sky-400" />Sugeridor de Películas</h1>
        <p className="text-slate-400 text-lg">¿No sabes qué ver? ¡Te ayudamos a decidir!</p>
      </header>
      <main className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 space-y-6">
        <>
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
        </>
        {errorMessage && <div className="mt-6 p-4 bg-red-700/50 border border-red-500 text-red-300 rounded-lg text-center"><p>{errorMessage}</p></div>}
        
        {suggestedMovie && (
          <div className="mt-8 p-6 bg-slate-700/50 rounded-xl shadow-lg animate-fadeIn flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 w-full md:w-1/3">
              <img 
                  src={suggestedMovie.posterUrl} 
                  alt={`Póster de ${suggestedMovie.englishTitle}`} 
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x750/1e293b/94a3b8?text=Sin+Imagen'; }}
              />
            </div>

            <div className="flex-grow flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-semibold text-sky-300 mb-2 text-center md:text-left">{suggestedMovie.englishTitle}</h2>
                {suggestedMovie.originalLanguage !== 'en' && (
                  <p className="text-md text-slate-400 -mt-1 mb-4 text-center md:text-left italic">({suggestedMovie.originalTitle})</p>
                )}
                <div className="grid grid-cols-1 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2 bg-slate-600/30 p-3 rounded-md"><CalendarIcon className="w-5 h-5 text-sky-400"/><p><span className="font-semibold">Año:</span> {suggestedMovie.year}</p></div>
                  <div className="flex items-center space-x-2 bg-slate-600/30 p-3 rounded-md"><FilmIcon className="w-5 h-5 text-sky-400"/><p><span className="font-semibold">Géneros:</span> {suggestedMovie.genres.join(', ')}</p></div>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-6">
                   <div className="bg-slate-600/30 p-3 rounded-md text-center"><p className="font-semibold mb-1">TMDb Rating:</p><p className="text-2xl font-bold text-yellow-400 flex items-center justify-center"><StarIcon className="w-6 h-6 mr-1 text-yellow-400"/> {suggestedMovie.tmdbRating.toFixed(1)} <span className="text-sm text-slate-400">/ 10</span></p></div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                  {suggestedMovie.imdbLink && <a href={suggestedMovie.imdbLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-center transition duration-150 w-full sm:w-auto">Ver en IMDB</a>}
                  <a href={suggestedMovie.letterboxdLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 hover:bg-green-600 text-slate-900 font-semibold py-2 px-4 rounded-lg text-center transition duration-150 w-full sm:w-auto">Ver en Letterboxd</a>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h3 className="text-lg font-semibold text-sky-300 mb-3 text-center md:text-left">Agendar en Calendario</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div><label htmlFor="schedule-date" className="block text-sm font-medium text-slate-300 mb-1">Fecha</label><input type="date" id="schedule-date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"/></div>
                    <div><label htmlFor="schedule-time" className="block text-sm font-medium text-slate-300 mb-1">Hora</label><input type="time" id="schedule-time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"/></div>
                  </div>
                  <button onClick={handleSchedule} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center justify-center space-x-2"><CalendarPlusIcon className="w-5 h-5"/><span>Agendar en Google Calendar</span></button>
                </div>
            </div>
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-slate-500"><p>Creado para ayudarte a encontrar tu próxima película favorita.</p><p>Datos y posters provistos por <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-400">TMDb</a>.</p></footer>
      <style>{`.animate-fadeIn { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #1e293b; } ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }`}</style>
    </div>
  );
}

export default App;