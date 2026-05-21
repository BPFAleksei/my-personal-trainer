# Mi Guía de Gym — Estructura inicial

Proyecto simple para organizar ejercicios por máquina y músculo.

Cómo está estructurado ahora:

- `index.html` — Página principal (referencia a CSS y JS externos)
- `styles/style.css` — Estilos extraídos
- `scripts/main.js` — Lógica de filtrado extraída
- `assets/images/` — carpeta de imágenes ya usada y ahora organizada en subcarpetas por máquina/equipo.
- `assets/images/freemotion/triceps/` — nueva carpeta lista para tus GIFs de triceps.

Siguientes pasos recomendados:

- Guardar nuevas imágenes de la máquina `freemotion` en `assets/images/freemotion/triceps/`.
- Actualizar `image` en `data/exercises.json` con la ruta al GIF nuevo.
- Inicializar `npm` y añadir un servidor de desarrollo si lo deseas (`live-server`, `vite`, etc.).
- Añadir tests y/o una estructura de datos para gestionar ejercicios dinámicamente (JSON/MD).
