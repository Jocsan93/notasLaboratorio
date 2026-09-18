import {
    loadTheorySectionStudents
} from "./theory-sections.js";


let theorySearchValue = "";


function loadTheorySearch() {

    const container =
        document.getElementById(
            "search-sections-container"
        );

    if (!container) {
        return;
    }


    fetch(
        "/theory/buscar",
        {
            method: "GET",

            headers: {
                "X-Requested-With":
                    "XMLHttpRequest"
            }
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "No se pudo cargar la búsqueda."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;


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
                "theory-search-input"
            );

        const searchResults =
            document.getElementById(
                "theory-search-results"
            );


        if (
            !searchInput ||
            !searchResults
        ) {
            return;
        }


        /*
         * Restaurar búsqueda anterior,
         * si existe.
         */

        if (theorySearchValue) {

            searchInput.value =
                theorySearchValue;

            buscarProfesor(
                theorySearchValue,
                searchResults
            );

        }


        searchInput.addEventListener(
            "input",
            function () {

                theorySearchValue =
                    searchInput.value.trim();


                if (!theorySearchValue) {

                    searchResults.innerHTML = "";

                    return;

                }


                buscarProfesor(
                    theorySearchValue,
                    searchResults
                );

            }
        );

    })

    .catch(error => {

        console.error(
            "Error cargando búsqueda:",
            error
        );

        container.innerHTML = `
            <div class="form-error">
                No se pudo cargar la búsqueda.
            </div>
        `;

    });

}


function buscarProfesor(
    profesor,
    searchResults
) {

    const parametros =
        new URLSearchParams({
            profesor: profesor
        });


    fetch(
        `/theory/buscar?${parametros.toString()}`,
        {
            method: "GET",

            headers: {
                "X-Requested-With":
                    "XMLHttpRequest"
            }
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "No se pudo realizar la búsqueda."
            );

        }

        return response.text();

    })

    .then(html => {

        searchResults.innerHTML =
            html;


        const rows =
            searchResults.querySelectorAll(
                ".theory-section-row"
            );


        rows.forEach(
            function (row) {

                row.addEventListener(
                    "click",
                    function () {

                        const profesor =
                            row.dataset.profesor;

                        const seccion =
                            row.dataset.seccion;

                        const fisica =
                            row.dataset.fisica;


                        loadTheorySectionStudents(
                            profesor,
                            seccion,
                            fisica,
                            "buscar"
                        );

                    }
                );

            }
        );

    })

    .catch(error => {

        console.error(
            "Error en la búsqueda:",
            error
        );

    });

}


export {
    loadTheorySearch
};