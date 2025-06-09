# Sugeridor de Películas

Esta es una aplicación web creada con React que te ayuda a decidir qué película ver. La aplicación se conecta a la API de The Movie Database (TMDb) para obtener sugerencias de películas basadas en filtros de género y año de estreno.

## Características

* **Sugerencias Aleatorias:** Obtén una película al azar que cumpla con tus criterios.
* **Filtros Personalizables:** Filtra las películas por género y rango de años de estreno.
* **Información Detallada:** Muestra el póster, título original y en inglés, año, géneros y calificación de TMDb.
* **Enlaces Externos:** Incluye enlaces directos a las páginas de IMDb y Letterboxd.
* **Agendar en Calendario:** Permite crear un evento en Google Calendar para agendar la película sugerida.

---

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### Prerrequisitos

* [Node.js](https://nodejs.org/) (versión 16 o superior recomendada)
* `npm` o `yarn`

### Pasos

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    cd tu-repositorio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
    O si usas `yarn`:
    ```bash
    yarn install
    ```

3.  **Crea tu archivo de variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade tu clave de API de TMDb.
    ```
    REACT_APP_TMDB_API_KEY=aquí_va_tu_clave_real_de_tmdb
    ```
    > **Importante:** Este archivo no debe ser subido a tu repositorio. Asegúrate de que `.env` esté en tu archivo `.gitignore`.

4.  **Ejecuta la aplicación:**
    ```bash
    npm start
    ```
    La aplicación se abrirá automáticamente en tu navegador en `http://localhost:3000`.

---

## 🛠️ Build para Producción

Para crear una versión optimizada de la aplicación para producción, ejecuta:
```bash
npm run build