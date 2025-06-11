import requests
from bs4 import BeautifulSoup
import json
import time
import re

# --- CONFIGURACIÓN ---
# Reemplaza estos valores con los tuyos
LETTERBOXD_USERNAME = "igndiaz"
LETTERBOXD_LIST_SLUG = "destroyers-1" 
TMDB_API_KEY = "c580d4653f4683e1df9473b6a8016355"
WATCH_REGION = "CL"  # Código de país (ej: 'CL' para Chile, 'US' para USA, 'ES' para España)
GIST_URL = "https://gist.githubusercontent.com/igndiaz/9be7507b0fd5e120eaff7126f59d637f/raw/c8406e446f66bb63c3164b2dc8de6fdbd83df809/recommendation.json"

# --- URLs y Endpoints ---
LETTERBOXD_BASE_URL = f"https://letterboxd.com/{LETTERBOXD_USERNAME}/list/{LETTERBOXD_LIST_SLUG}/"
TMDB_API_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500"

def get_existing_recommendations(url):
    """
    Obtiene la lista actual de recomendaciones desde el Gist de GitHub.
    """
    print(f"Obteniendo recomendaciones existentes desde: {url}")
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  > Advertencia: No se pudo obtener el Gist. Se creará un archivo nuevo. Error: {e}")
        return []
    except json.JSONDecodeError:
        print("  > Advertencia: El contenido del Gist no es un JSON válido. Se creará un archivo nuevo.")
        return []

def get_movies_from_letterboxd(base_url):
    """
    Hace web scraping a una lista de Letterboxd, manejando la paginación para obtener
    títulos y años de todas las películas de la lista.
    """
    all_movies = []
    page_number = 1
    
    while True:
        paginated_url = f"{base_url}page/{page_number}/"
        print(f"Obteniendo películas desde: {paginated_url}")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(paginated_url, headers=headers)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error al acceder a Letterboxd en la página {page_number}: {e}")
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        
        film_posters = soup.select('ul.poster-list li div.film-poster')
        
        if not film_posters:
            if page_number == 1:
                print("No se encontraron películas. Verifica que el nombre de usuario y el SLUG de la lista sean correctos.")
            else:
                print("No se encontraron más películas. Fin del scraping.")
            break
        
        movies_found_on_page = 0
        for poster_div in film_posters:
            title = None
            year = 'N/A'
            
            img_tag = poster_div.find('img')
            if img_tag and img_tag.get('alt'):
                title = img_tag['alt']
            else:
                continue

            release_year_attr = poster_div.get('data-film-release-year')
            if release_year_attr:
                year = release_year_attr
            else:
                slug = poster_div.get('data-film-slug')
                film_name_for_check = poster_div.get('data-film-name', title)
                if slug:
                    match = re.search(r'-(\d{4})$', slug)
                    if match:
                        potential_year = match.group(1)
                        if potential_year not in film_name_for_check:
                            year = potential_year
                            print(f"  > Año ({year}) para '{title}' obtenido del slug.")
                        else:
                            print(f"  > '{potential_year}' es parte del título '{title}', se ignora como año de estreno.")

            all_movies.append({'title': title, 'year': year})
            movies_found_on_page += 1

        print(f"Se procesaron {movies_found_on_page} películas en la página {page_number}.")
        
        if movies_found_on_page == 0:
            print("No se encontraron más películas procesables. Fin del scraping.")
            break

        page_number += 1
        time.sleep(1)
        
    print(f"\nTotal de películas encontradas en Letterboxd: {len(all_movies)}")
    return all_movies

def get_streaming_providers(movie_id):
    """
    Obtiene solo la información de streaming para un ID de película dado.
    """
    print(f"Actualizando streaming para el ID: {movie_id}...")
    providers_url = f"{TMDB_API_URL}/movie/{movie_id}/watch/providers?api_key={TMDB_API_KEY}"
    try:
        response = requests.get(providers_url)
        response.raise_for_status()
        data = response.json()
        
        providers = data.get('results', {}).get(WATCH_REGION, {})
        flatrate_providers = []
        if 'flatrate' in providers:
            flatrate_providers = [
                {"provider_name": p.get("provider_name"), "logo_path": f"{TMDB_IMAGE_URL}{p.get('logo_path')}"} 
                for p in providers['flatrate']
            ]
        return flatrate_providers
    except requests.exceptions.RequestException as e:
        print(f"  Error actualizando streaming para ID {movie_id}: {e}")
        return []

def get_movie_details_from_tmdb(movie_id):
    """
    Obtiene los detalles completos de una película usando su ID de TMDb.
    """
    print(f"Obteniendo detalles completos para el ID: {movie_id}...")
    details_url = f"{TMDB_API_URL}/movie/{movie_id}"
    params_en = {'api_key': TMDB_API_KEY, 'language': 'en-US'}
    params_es = {'api_key': TMDB_API_KEY, 'language': 'es-ES'}
    
    try:
        response_en = requests.get(details_url, params=params_en)
        response_en.raise_for_status()
        details_en = response_en.json()

        response_es = requests.get(details_url, params=params_es)
        response_es.raise_for_status()
        details_es = response_es.json()
        
        # Obtenemos los proveedores de streaming en una llamada separada para mantener la lógica limpia
        streaming_providers = get_streaming_providers(movie_id)

    except requests.exceptions.RequestException as e:
        print(f"  Error en la API de TMDb (detalles): {e}")
        return None

    return {
        "id": f"featured-{details_en['id']}",
        "englishTitle": details_en.get('title', 'Título no disponible'),
        "year": int(details_en.get('release_date', '0000').split('-')[0]) if details_en.get('release_date') else "N/A",
        "runtime": details_en.get('runtime', 120),
        "genre_ids": [genre['id'] for genre in details_en.get('genres', [])],
        "posterUrl": f"{TMDB_IMAGE_URL}{details_en.get('poster_path', '')}" if details_en.get('poster_path') else None,
        "review": details_es.get('overview', 'Sin reseña disponible.')[:1000],
        "imdbLink": f"https://www.imdb.com/title/{details_en.get('imdb_id')}/" if details_en.get('imdb_id') else "",
        "letterboxdLink": f"https://letterboxd.com/film/{details_en.get('title', '').lower().replace(' ', '-')}/",
        "streaming_providers": streaming_providers
    }

def get_tmdb_id_for_movie(title, year):
    """
    Busca una película en TMDb y devuelve solo su ID.
    """
    print(f"Verificando ID para: '{title}' ({year})...")
    search_url = f"{TMDB_API_URL}/search/movie"
    params = {'api_key': TMDB_API_KEY, 'query': title}
    if year and year != 'N/A':
        params['primary_release_year'] = year
    
    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        search_results = response.json()
        if search_results.get('results'):
            return search_results['results'][0]['id']
    except requests.exceptions.RequestException as e:
        print(f"  Error en la API de TMDb (búsqueda de ID): {e}")
    
    print(f"  No se encontró ID para '{title}' ({year}).")
    return None

def main():
    """
    Función principal que orquesta el proceso de scraping y creación del JSON.
    """
    # 1. Obtener recomendaciones existentes
    existing_recs = get_existing_recommendations(GIST_URL)
    
    # 2. Actualizar el streaming para las películas existentes
    print("\n--- Actualizando proveedores de streaming para películas existentes ---")
    updated_existing_recs = []
    for rec in existing_recs:
        movie_id = rec['id'].replace('featured-', '')
        rec['streaming_providers'] = get_streaming_providers(movie_id)
        updated_existing_recs.append(rec)
        time.sleep(0.2)
    
    existing_titles = {rec['englishTitle'].lower() for rec in updated_existing_recs}
    existing_ids = {rec['id'].replace('featured-', '') for rec in updated_existing_recs}
    print(f"Se actualizaron {len(existing_titles)} recomendaciones existentes.")

    # 3. Obtener la lista actual de Letterboxd
    movies_from_letterboxd = get_movies_from_letterboxd(LETTERBOXD_BASE_URL)
    
    # 4. Identificar películas nuevas con doble verificación
    new_movies_to_process = []
    print("\n--- Comparando listas con doble verificación para encontrar películas nuevas ---")
    for movie in movies_from_letterboxd:
        if movie['title'].lower() not in existing_titles:
            tmdb_id = get_tmdb_id_for_movie(movie['title'], movie['year'])
            if tmdb_id and str(tmdb_id) not in existing_ids:
                print(f"  > '{movie['title']}' es una película genuinamente nueva. Agregando a la lista de procesamiento.")
                new_movies_to_process.append(tmdb_id)
                existing_ids.add(str(tmdb_id))
            else:
                print(f"  > '{movie['title']}' parece nueva por el título, pero su ID ya existe o no se encontró. Se omitirá.")
            time.sleep(0.2)

    if not new_movies_to_process:
        print("\nNo hay películas nuevas para agregar. El archivo 'recommendations.json' está actualizado.")
        # Aun así, guardamos el archivo por si se actualizó el streaming
        output_filename = 'recommendations.json'
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(updated_existing_recs, f, ensure_ascii=False, indent=2)
        print(f"\n¡Éxito! Se ha actualizado el archivo '{output_filename}' con la información de streaming más reciente.")
        return

    print(f"\nSe encontraron {len(new_movies_to_process)} película(s) nueva(s) para agregar.")
    
    # 5. Obtener detalles completos solo para las películas nuevas
    new_recommendations = []
    for tmdb_id in new_movies_to_process:
        details = get_movie_details_from_tmdb(tmdb_id)
        if details:
            new_recommendations.append(details)
        time.sleep(0.5)

    # 6. Combinar la lista existente (con streaming actualizado) con las nuevas recomendaciones
    final_recommendations = updated_existing_recs + new_recommendations

    # 7. Guardar la lista completa en el archivo
    output_filename = 'recommendations.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(final_recommendations, f, ensure_ascii=False, indent=2)

    print(f"\n¡Éxito! Se ha actualizado el archivo '{output_filename}'.")
    print(f"Se agregaron {len(new_recommendations)} nuevas películas. Total: {len(final_recommendations)}.")
    print("Ahora puedes subir este archivo a tu Gist de GitHub para actualizar las recomendaciones en tu web.")

if __name__ == "__main__":
    main()