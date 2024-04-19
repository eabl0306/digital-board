# Tablero Digital

este es un tablero digital completamente libre, donde poder desarrollar tus ideas y hacer mapas mentales, diagramas etc.

El tablero consta de tres partes

1.  la interface de usuario (React)
2.  la api (rust)
3.  la aplicación/ejecutable (rust)

## ¿Como iniciar el entorno de desarrollo?

primero levantamos la ui

    yarn run web

seguido de la api

    yarn run api

y por ultimo iniciamos la ventana

    yarn run desktop

> este comando es opcional ya que podemos ver la aplicación directamente desde el navegador

## ¿Como compilamos la aplicación?

primero compilamos la ui

    yarn run web:build

compilamos la api

    yarn run api:build

y finalmente compilamos la aplicación

    yarn run tauri build

> me queda pendiente crear un script que empaquete todo en un mismo sitio
