import {
    loadLabSectionStudents
} from "./lab-sections.js";


let labSearchValue = "";

let labSearchRequest = 0;


function loadLabSearch() {

    const container =
        document.getElementById(
            "search-sections-container"
        );

    if (!container) {
        return;
    }


    fetch(
        "/lab/buscar",
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
                "lab-search-input"
            );

        const searchResults =
            document.getElementById(
                "lab-search-results"
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

        if (labSearchValue) {

            searchInput.value =
                labSearchValue;

            buscarInstructor(
                labSearchValue,
                searchResults
            );

        }


        searchInput.addEventListener(
            "input",
            function () {

                labSearchValue =
                    searchInput.value.trim();


                labSearchRequest++;


                if (!labSearchValue) {

                    searchResults.innerHTML = "";

                    return;

                }


                buscarInstructor(
                    labSearchValue,
                    searchResults,
                    labSearchRequest
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


function buscarInstructor(
    instructor,
    searchResults,
    requestNumber
) {

    const parametros =
        new URLSearchParams({
            instructor: instructor
        });


    fetch(
        `/lab/buscar?${parametros.toString()}`,
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

        if (
            requestNumber !== labSearchRequest
        ) {
            return;
        }


        if (
            searchResults.closest(
                "#search-content"
            ) === null
        ) {
            return;
        }


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

                        const fisica =
                            row.dataset.fisica;

                        const dia =
                            row.dataset.dia;

                        const hora =
                            row.dataset.hora;


                        loadLabSectionStudents(
                            fisica,
                            dia,
                            hora,
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
    loadLabSearch
};