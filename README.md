


### Setup

-   Tener Python3 y [uv](https://docs.astral.sh/uv/getting-started/installation/) instalados.
-   Ir a la carpeta `tools`.

    ```bash
    cd tools
    ```

-   Instalar las dependencias de python con uv.

    ```bash
    uv add -r requirements.txt
    ```

### Generar el sitio
Para generar el sitio hay que correr el script ssg.py con
	```
	uv run
	```

### Levantar servidor local

-   En la carpeta base del proyecto:

    ```bash
    python3 -m http.server
    ```

-   Y en el navegador abris `http://localhost:8000`.
