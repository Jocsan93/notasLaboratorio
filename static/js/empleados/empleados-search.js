import {
    loadEmpleadoDetail
} from "./empleados-list.js";


let empleadosSearchValue = "";

let empleadosSearchRequest = 0;


function loadEmpleadosSearch() {

    console.log(
        "[EMPLEADOS SEARCH] Iniciando búsqueda..."
    );


    const container =
        document.getElementById(
            "search-employees-container"
        );


    console.log(
        "[EMPLEADOS SEARCH] Contenedor:",
        container
    );


    if (!container) {

        console.log(
            "[EMPLEADOS SEARCH] ERROR: no existe search-employees-container"
        );

        return;
    }


    fetch(
        "/empleados/buscar",
        {
            method: "GET",

            headers: {
                "X-Requested-With":
                    "XMLHttpRequest"
            }
        }
    )

    .then(response => {

        console.log(
            "[EMPLEADOS SEARCH] Respuesta inicial:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar la búsqueda."
            );

        }

        return response.text();

    })

    .then(html => {

        console.log(
            "[EMPLEADOS SEARCH] HTML inicial recibido:",
            html
        );


        container.innerHTML =
            html;


        const searchContent =
            document.getElementById(
                "search-content"
            );

        const uploadContent =
            document.getElementById(
                "upload-content"
            );

        const sectionsContent =
            document.getElementById(
                "sections-content"
            );


        const searchTab =
            document.getElementById(
                "search-tab"
            );

        const uploadTab =
            document.getElementById(
                "upload-tab"
            );

        const sectionsTab =
            document.getElementById(
                "sections-tab"
            );


        console.log(
            "[EMPLEADOS SEARCH] search-content:",
            searchContent
        );

        console.log(
            "[EMPLEADOS SEARCH] upload-content:",
            uploadContent
        );

        console.log(
            "[EMPLEADOS SEARCH] sections-content:",
            sectionsContent
        );


        if (searchContent) {

            searchContent.classList.add(
                "show",
                "active"
            );

        }


        if (uploadContent) {

            uploadContent.classList.remove(
                "show",
                "active"
            );

        }


        if (sectionsContent) {

            sectionsContent.classList.remove(
                "show",
                "active"
            );

        }


        if (searchTab) {

            searchTab.classList.add(
                "active"
            );

            searchTab.setAttribute(
                "aria-selected",
                "true"
            );

        }


        if (uploadTab) {

            uploadTab.classList.remove(
                "active"
            );

            uploadTab.setAttribute(
                "aria-selected",
                "false"
            );

        }


        if (sectionsTab) {

            sectionsTab.classList.remove(
                "active"
            );

            sectionsTab.setAttribute(
                "aria-selected",
                "false"
            );

        }


        const searchInput =
            document.getElementById(
                "empleados-search-input"
            );

        const searchResults =
            document.getElementById(
                "empleados-search-results"
            );


        console.log(
            "[EMPLEADOS SEARCH] Input:",
            searchInput
        );

        console.log(
            "[EMPLEADOS SEARCH] Resultados:",
            searchResults
        );


        if (
            !searchInput ||
            !searchResults
        ) {

            console.log(
                "[EMPLEADOS SEARCH] ERROR: falta input o contenedor de resultados."
            );

            return;
        }


        /*
         * Restaurar búsqueda anterior,
         * si existe.
         */

        if (empleadosSearchValue) {

            searchInput.value =
                empleadosSearchValue;


            empleadosSearchRequest++;


            console.log(
                "[EMPLEADOS SEARCH] Restaurando búsqueda:",
                empleadosSearchValue
            );

            buscarEmpleado(
                empleadosSearchValue,
                searchResults,
                empleadosSearchRequest
            );

        }


        searchInput.addEventListener(
            "input",
            function () {

                empleadosSearchValue =
                    searchInput.value.trim();


                empleadosSearchRequest++;


                console.log(
                    "[EMPLEADOS SEARCH] Texto ingresado:",
                    empleadosSearchValue
                );

                console.log(
                    "[EMPLEADOS SEARCH] Request:",
                    empleadosSearchRequest
                );


                if (!empleadosSearchValue) {

                    console.log(
                        "[EMPLEADOS SEARCH] Búsqueda vacía."
                    );


                    searchResults.innerHTML =
                        "";

                    return;

                }


                buscarEmpleado(
                    empleadosSearchValue,
                    searchResults,
                    empleadosSearchRequest
                );

            }
        );

    })

    .catch(error => {

        console.error(
            "[EMPLEADOS SEARCH] Error cargando búsqueda:",
            error
        );


        container.innerHTML = `
            <div class="form-error">
                No se pudo cargar la búsqueda.
            </div>
        `;

    });

}


function buscarEmpleado(
    nombre,
    searchResults,
    requestNumber
) {

    console.log(
        "[EMPLEADOS SEARCH] Ejecutando búsqueda:",
        nombre
    );


    console.log(
        "[EMPLEADOS SEARCH] Número de request:",
        requestNumber
    );


    const parametros =
        new URLSearchParams({
            nombre: nombre
        });


    const url =
        `/empleados/buscar?${parametros.toString()}`;


    console.log(
        "[EMPLEADOS SEARCH] URL:",
        url
    );


    fetch(
        url,
        {
            method: "GET",

            headers: {
                "X-Requested-With":
                    "XMLHttpRequest"
            }
        }
    )

    .then(response => {

        console.log(
            "[EMPLEADOS SEARCH] Respuesta búsqueda:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "No se pudo realizar la búsqueda."
            );

        }

        return response.text();

    })

    .then(html => {

        console.log(
            "[EMPLEADOS SEARCH] HTML resultados recibido:",
            html
        );


        console.log(
            "[EMPLEADOS SEARCH] Request recibido:",
            requestNumber
        );

        console.log(
            "[EMPLEADOS SEARCH] Request actual:",
            empleadosSearchRequest
        );


        if (
            requestNumber !==
            empleadosSearchRequest
        ) {

            console.log(
                "[EMPLEADOS SEARCH] Respuesta descartada por request antiguo."
            );

            return;
        }


        if (
            searchResults.closest(
                "#search-content"
            ) === null
        ) {

            console.log(
                "[EMPLEADOS SEARCH] Respuesta descartada: search-results no está dentro de search-content."
            );

            return;
        }


        searchResults.innerHTML =
            html;


        const rows =
            searchResults.querySelectorAll(
                ".theory-section-row"
            );


        console.log(
            "[EMPLEADOS SEARCH] Filas encontradas:",
            rows.length
        );


        rows.forEach(
            function (row) {

                row.addEventListener(
                    "click",
                    function () {

                        const numeroEmpleado =
                            row.dataset.numeroEmpleado;

                        const nombreEmpleado =
                            row.dataset.nombre;


                        console.log(
                            "[EMPLEADOS SEARCH] Empleado seleccionado:",
                            numeroEmpleado,
                            nombreEmpleado
                        );


                        loadEmpleadoDetail(
                            formatearNumeroEmpleado(
                                numeroEmpleado
                            ),
                            nombreEmpleado
                        );

                    }
                );

            }
        );


        formatearNumerosBusqueda();

    })

    .catch(error => {

        console.error(
            "[EMPLEADOS SEARCH] Error en la búsqueda:",
            error
        );

    });

}


function formatearNumeroEmpleado(
    numeroEmpleado
) {

    if (!numeroEmpleado) {
        return "";
    }


    const numeroTexto =
        String(numeroEmpleado).trim();


    if (numeroTexto.endsWith(".0")) {

        return numeroTexto.slice(
            0,
            -2
        );

    }


    return numeroTexto;

}


function formatearNumerosBusqueda() {

    const filas =
        document.querySelectorAll(
            "#empleados-search-results .theory-section-row"
        );


    filas.forEach(
        function (fila) {

            const celda =
                fila.children[1];

            if (!celda) {
                return;
            }


            const numero =
                celda.textContent.trim();


            celda.textContent =
                formatearNumeroEmpleado(
                    numero
                );

        }
    );

}


export {
    loadEmpleadosSearch
};