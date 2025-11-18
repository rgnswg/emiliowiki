### Setup

-   Tener Python3 y [uv](https://docs.astral.sh/uv/getting-started/installation/) instalados.
-   En la carpeta raiz del proyecto hacer un git-clone del repo de EOM-TRAITS
    ```
    git clone https://github.com/mnrrxyz/EOM_TRAITS
    ```
-   Ir a la carpeta `tools`.

    ```bash
    cd tools
    ```

-   Instalar las dependencias de python con uv.

    ```bash
    uv add -r requirements.txt
    ```

### Generar el sitio
- Para generar el sitio hay que correr el script ssg.py con

	```
	uv run
	```
**Importante:** este script actualiza las entradas de la wiki y la lista de memes y audios, es decir, al agregar audios y/o memes debe ser ejecutado, los memes y audios se agregan en las respectivas carpetas dentro de media/
### Levantar servidor local

-   En la carpeta dist:

    ```bash
    python3 -m http.server
    ```

-   Y en el navegador abris `http://localhost:8000`.
