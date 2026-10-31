# BINOVASOFT — Inicio visual

## Archivos incluidos
- `index.html`: estructura de la página de inicio.
- `Css/style.css`: estilos principales y efectos visuales.
- `Css/responsive.css`: ajustes para tabletas y celulares.
- `Js/main.js`: menú, año automático y animaciones de entrada.

## Cómo integrarlo
1. Haz una copia de seguridad de tu proyecto actual.
2. Copia el contenido de estos archivos en los archivos equivalentes de tu proyecto.
3. Conserva tu logo en `Img/Logo/LogotipoSB.png`.
4. Abre `index.html` con Live Server en Visual Studio Code.
5. Comprueba el menú tanto en escritorio como en móvil.

## Importante
- El menú permanece visible porque `.navbar-fija` usa `position: fixed`.
- Los enlaces de páginas internas apuntan a la estructura `Pages/` descrita en el proyecto.
- El dashboard y las tarjetas de portafolio son ilustrativos. Cambia los textos y ejemplos para reflejar únicamente servicios y trabajos reales.
- Bootstrap, Bootstrap Icons y Google Fonts se cargan desde CDN, por lo que requieren conexión a internet.
- Si `LogotipoSB.png` ya contiene el nombre BINOVASOFT completo, puedes ocultar el texto duplicado con `.marca-texto { display: none; }`.
