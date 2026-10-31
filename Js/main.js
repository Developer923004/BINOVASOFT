
/* =============================================================
   BINOVASOFT - FUNCIONES PRINCIPALES
   ============================================================= */

/*
   Funcionalidades:
   1. Actualización automática del año del footer.
   2. Sombra de navegación al desplazarse.
   3. Cierre automático del menú móvil.
   4. Animaciones de aparición al entrar en pantalla.
   5. Enlace de inicio activo al cargar la página.
*/


document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. ACTUALIZAR AUTOMÁTICAMENTE EL AÑO DEL FOOTER
    ========================================================= */

    const anio = document.getElementById("anioActual");

    if (anio) {
        anio.textContent = new Date().getFullYear();
    }


    /* =========================================================
       2. AÑADIR SOMBRA AL MENÚ AL DESPLAZARSE
    ========================================================= */

    const barraNavegacion = document.querySelector(".navbar-fija");

    const actualizarBarra = () => {

        // Evitar errores si no existe la barra de navegación.
        if (!barraNavegacion) {
            return;
        }

        // Añadir sombra cuando el desplazamiento supera 15 píxeles.
        barraNavegacion.classList.toggle(
            "con-sombra",
            window.scrollY > 15
        );

    };

    // Ejecutar al cargar la página.
    actualizarBarra();

    // Actualizar durante el desplazamiento.
    window.addEventListener("scroll", actualizarBarra, {
        passive: true
    });


    /* =========================================================
       3. CERRAR EL MENÚ MÓVIL DESPUÉS DE SELECCIONAR UN ENLACE
    ========================================================= */

    const menu = document.getElementById("menuPrincipal");

    const enlacesMenu = document.querySelectorAll(
        "#menuPrincipal .nav-link, #menuPrincipal .btn-nav"
    );

    enlacesMenu.forEach((enlace) => {

        enlace.addEventListener("click", () => {

            // Comprobar que el menú exista y esté desplegado.
            if (
                menu &&
                menu.classList.contains("show") &&
                window.bootstrap
            ) {

                // Obtener la instancia existente o crear una nueva.
                const instancia =
                    window.bootstrap.Collapse.getInstance(menu) ||
                    new window.bootstrap.Collapse(menu, {
                        toggle: false
                    });

                // Cerrar el menú móvil.
                instancia.hide();

            }

        });

    });


    /* =========================================================
       4. ANIMAR ELEMENTOS CUANDO ENTREN EN PANTALLA
    ========================================================= */

    const elementosRevelar = document.querySelectorAll(".revelar");

    // Comprobar si el usuario prefiere reducir las animaciones.
    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
       Si el navegador no soporta IntersectionObserver
       o el usuario ha solicitado reducir las animaciones,
       mostrar directamente todos los elementos.
    */

    if (
        !("IntersectionObserver" in window) ||
        reducirMovimiento
    ) {

        elementosRevelar.forEach((elemento) => {
            elemento.classList.add("visible");
        });

    } else {

        // Observar los elementos que tienen la clase .revelar.
        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach((entrada) => {

                    if (entrada.isIntersecting) {

                        // Mostrar el elemento.
                        entrada.target.classList.add("visible");

                        // Dejar de observarlo después de mostrarlo.
                        observer.unobserve(entrada.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        // Registrar todos los elementos que deben animarse.
        elementosRevelar.forEach((elemento) => {
            observador.observe(elemento);
        });

    }


    /* =========================================================
       5. MARCAR EL ENLACE DE INICIO COMO ACTIVO AL CARGAR
    ========================================================= */

    const enlaceInicio = document.querySelector(
        '.menu-enlaces a[href="#inicio"]'
    );

    if (enlaceInicio) {
        enlaceInicio.classList.add("activo");
    }

});




/* =====================================================
   RESPONSIVE - SLIDER AUDIOVISUAL
===================================================== */
/* =====================================================
   SLIDER AUDIOVISUAL BINOVASOFT
   Control de 10 videos, reproducción automática y botones.
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Elementos principales del slider
    const slider = document.querySelector(".showcase-contenedor");

    // Si el slider no existe, no ejecutamos este código
    if (!slider) return;

    const diapositivas = slider.querySelectorAll(".showcase-slide");
    const indicadores = slider.querySelectorAll(".showcase-indicador");

    const botonAnterior = document.getElementById("showcaseAnterior");
    const botonSiguiente = document.getElementById("showcaseSiguiente");
    const botonPausa = document.getElementById("showcasePausa");
    const botonSonido = document.getElementById("showcaseSonido");
    const botonPantalla = document.getElementById("showcasePantalla");

    const barraProgreso = document.getElementById("showcaseProgreso");
    const contador = document.getElementById("showcaseContador");

    // Configuración del slider
    const TOTAL_VIDEOS = diapositivas.length;
    const TIEMPO_CAMBIO = 8000; // 8 segundos
    const INTERVALO_PROGRESO = 50;

    // Estado inicial
    let indiceActual = 0;
    let presentacionActiva = true;
    let sonidoActivado = false;
    let tiempoTranscurrido = 0;

    let temporizadorCambio;
    let temporizadorProgreso;

    // Obtener todos los videos
    const videos = slider.querySelectorAll(".showcase-video");

    // Preparar videos para reproducción automática
    videos.forEach(function (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
    });

    // Reproducir únicamente el video activo
    function reproducirVideoActual() {

        videos.forEach(function (video, indice) {

            if (indice === indiceActual) {

                video.muted = !sonidoActivado;

                // Reiniciar el video cuando se activa su diapositiva
                if (video.readyState >= 1) {
                    video.currentTime = 0;
                }

                const reproduccion = video.play();

                // Algunos navegadores pueden bloquear la reproducción
                if (reproduccion !== undefined) {
                    reproduccion.catch(function () {
                        console.log("El navegador no permitió reproducir el video.");
                    });
                }

            } else {

                video.pause();
            }
        });
    }

    // Actualizar botones e indicadores
    function actualizarInterfaz() {

        diapositivas.forEach(function (diapositiva, indice) {
            diapositiva.classList.toggle("activo", indice === indiceActual);
        });

        indicadores.forEach(function (indicador, indice) {
            indicador.classList.toggle("activo", indice === indiceActual);
        });

        contador.textContent =
            String(indiceActual + 1).padStart(2, "0") +
            " / " +
            String(TOTAL_VIDEOS).padStart(2, "0");
    }

    // Reiniciar temporizadores
    function reiniciarTemporizadores() {

        clearInterval(temporizadorCambio);
        clearInterval(temporizadorProgreso);

        tiempoTranscurrido = 0;

        barraProgreso.style.width = "0%";

        if (!presentacionActiva) return;

        // Avance automático
        temporizadorCambio = setInterval(function () {
            cambiarDiapositiva(indiceActual + 1);
        }, TIEMPO_CAMBIO);

        // Actualización de la barra de progreso
        temporizadorProgreso = setInterval(function () {

            tiempoTranscurrido += INTERVALO_PROGRESO;

            const porcentaje =
                (tiempoTranscurrido / TIEMPO_CAMBIO) * 100;

            barraProgreso.style.width =
                Math.min(porcentaje, 100) + "%";

        }, INTERVALO_PROGRESO);
    }

    // Cambiar de diapositiva
    function cambiarDiapositiva(nuevoIndice) {

        indiceActual =
            (nuevoIndice + TOTAL_VIDEOS) % TOTAL_VIDEOS;

        actualizarInterfaz();
        reproducirVideoActual();
        reiniciarTemporizadores();
    }

    // Botón anterior
    botonAnterior.addEventListener("click", function () {
        cambiarDiapositiva(indiceActual - 1);
    });

    // Botón siguiente
    botonSiguiente.addEventListener("click", function () {
        cambiarDiapositiva(indiceActual + 1);
    });

    // Botones indicadores
    indicadores.forEach(function (indicador, indice) {

        indicador.addEventListener("click", function () {
            cambiarDiapositiva(indice);
        });

    });

    // Pausar o continuar la presentación
    botonPausa.addEventListener("click", function () {

        presentacionActiva = !presentacionActiva;

        if (presentacionActiva) {

            botonPausa.innerHTML =
                '<i class="bi bi-pause-fill"></i>';

            botonPausa.setAttribute(
                "aria-label",
                "Pausar presentación"
            );

            reproducirVideoActual();
            reiniciarTemporizadores();

        } else {

            botonPausa.innerHTML =
                '<i class="bi bi-play-fill"></i>';

            botonPausa.setAttribute(
                "aria-label",
                "Continuar presentación"
            );

            videos[indiceActual].pause();

            clearInterval(temporizadorCambio);
            clearInterval(temporizadorProgreso);
        }

    });

    // Activar o desactivar sonido
    botonSonido.addEventListener("click", function () {

        sonidoActivado = !sonidoActivado;

        videos[indiceActual].muted = !sonidoActivado;

        if (sonidoActivado) {

            botonSonido.innerHTML =
                '<i class="bi bi-volume-up-fill"></i>';

            botonSonido.setAttribute(
                "aria-label",
                "Desactivar sonido"
            );

        } else {

            botonSonido.innerHTML =
                '<i class="bi bi-volume-mute-fill"></i>';

            botonSonido.setAttribute(
                "aria-label",
                "Activar sonido"
            );
        }

    });

    // Pantalla completa
    botonPantalla.addEventListener("click", function () {

        if (!document.fullscreenElement) {

            if (slider.requestFullscreen) {
                slider.requestFullscreen();
            }

        } else {

            document.exitFullscreen();
        }

    });

    // Si el visitante cambia de pestaña, detener temporalmente
    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            videos[indiceActual].pause();

            clearInterval(temporizadorCambio);
            clearInterval(temporizadorProgreso);

        } else if (presentacionActiva) {

            reproducirVideoActual();
            reiniciarTemporizadores();
        }

    });

    // Iniciar el slider automáticamente
    actualizarInterfaz();
    reproducirVideoActual();
    reiniciarTemporizadores();

});
