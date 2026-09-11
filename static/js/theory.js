let theorySearchValue = "";


function loadTheoryUploadForm() {

    const container =
        document.getElementById(
            "upload-sections-container"
        );

    if (!container) {
        return;
    }

    fetch(
        "/theory/subir",
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
                "No se pudo cargar el formulario."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;

        initializeTheoryUploadForm();

    })

    .catch(error => {

        console.error(error);

        container.innerHTML = `
            <div class="form-error">
                No se pudo cargar el formulario
                de carga de secciones.
            </div>
        `;

    });

}


function initializeTheoryUploadForm() {

    const uploadForm =
        document.getElementById(
            "theory-upload-form"
        );

    const container =
        document.getElementById(
            "upload-sections-container"
        );

    if (!uploadForm || !container) {
        return;
    }

    uploadForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const formData =
                new FormData(uploadForm);

            container.innerHTML = `
                <div class="theory-upload-loading">

                    <div class="theory-upload-spinner">
                    </div>

                    <div class="theory-upload-loading-content">

                        <h2>
                            Procesando archivo
                        </h2>

                        <p>
                            Espere un momento mientras
                            se procesan y guardan las secciones.
                        </p>

                    </div>

                </div>
            `;

            fetch(
                "/theory/subir",
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest"
                    }
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "No se pudo procesar el archivo."
                    );

                }

                return response.text();

            })

            .then(html => {

                container.innerHTML = html;

                initializeTheoryUploadForm();

            })

            .catch(error => {

                console.error(error);

                container.innerHTML = `
                    <div class="form-error">
                        No se pudo procesar el archivo.
                    </div>
                `;

            });

        }
    );

}


function showUploadTab() {

    const uploadContent =
        document.getElementById(
            "upload-content"
        );

    const sectionsContent =
        document.getElementById(
            "sections-content"
        );

    const searchContent =
        document.getElementById(
            "search-content"
        );

    const uploadTab =
        document.getElementById(
            "upload-tab"
        );

    const sectionsTab =
        document.getElementById(
            "sections-tab"
        );

    const searchTab =
        document.getElementById(
            "search-tab"
        );


    if (uploadContent) {

        uploadContent.classList.add(
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


    if (searchContent) {

        searchContent.classList.remove(
            "show",
            "active"
        );

    }


    if (uploadTab) {

        uploadTab.classList.add(
            "active"
        );

        uploadTab.setAttribute(
            "aria-selected",
            "true"
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


    if (searchTab) {

        searchTab.classList.remove(
            "active"
        );

        searchTab.setAttribute(
            "aria-selected",
            "false"
        );

    }


    loadTheoryUploadForm();

}


function loadTheorySections(page = 1) {

    window.theoryCurrentPage = page;

    const container =
        document.getElementById(
            "sections-list-container"
        );

    if (!container) {
        return;
    }


    const sectionsContent =
        document.getElementById(
            "sections-content"
        );

    const uploadContent =
        document.getElementById(
            "upload-content"
        );

    const searchContent =
        document.getElementById(
            "search-content"
        );

    const sectionsTab =
        document.getElementById(
            "sections-tab"
        );

    const uploadTab =
        document.getElementById(
            "upload-tab"
        );

    const searchTab =
        document.getElementById(
            "search-tab"
        );


    if (!sectionsContent) {
        return;
    }


    fetch(
        `/theory/secciones?page=${page}`,
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
                "No se pudieron cargar las secciones."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;


        sectionsContent.classList.add(
            "show",
            "active"
        );


        if (uploadContent) {

            uploadContent.classList.remove(
                "show",
                "active"
            );

        }


        if (searchContent) {

            searchContent.classList.remove(
                "show",
                "active"
            );

        }


        if (sectionsTab) {

            sectionsTab.classList.add(
                "active"
            );

            sectionsTab.setAttribute(
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


        if (searchTab) {

            searchTab.classList.remove(
                "active"
            );

            searchTab.setAttribute(
                "aria-selected",
                "false"
            );

        }


        initializeTheoryPagination();
        initializeTheorySectionRows();

    })

    .catch(error => {

        console.error(
            "Error cargando secciones:",
            error
        );

        container.innerHTML = `
            <div class="form-error">
                No se pudieron cargar las
                secciones registradas.
            </div>
        `;

    });

}


function initializeTheoryPagination() {

    const paginationLinks =
        document.querySelectorAll(
            ".theory-page-link"
        );

    const container =
        document.getElementById(
            "sections-list-container"
        );

    if (!container) {
        return;
    }


    paginationLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const page =
                        link.dataset.page;

                    loadTheorySections(
                        page
                    );

                }
            );

        }
    );

}


function loadTheorySectionStudents(
    profesor,
    seccion,
    fisica,
    origen
) {

    const container =
        document.getElementById(
            "sections-list-container"
        );

    if (!container) {
        return;
    }


    const parametros =
        new URLSearchParams({
            profesor: profesor,
            seccion: seccion,
            fisica: fisica
        });


    fetch(
        `/theory/seccion-estudiantes?${parametros.toString()}`,
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
                "No se pudieron cargar los estudiantes."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;

        container.dataset.origen = origen;


        const sectionsContent =
            document.getElementById(
                "sections-content"
            );

        const searchContent =
            document.getElementById(
                "search-content"
            );

        const uploadContent =
            document.getElementById(
                "upload-content"
            );


        const sectionsTab =
            document.getElementById(
                "sections-tab"
            );

        const searchTab =
            document.getElementById(
                "search-tab"
            );

        const uploadTab =
            document.getElementById(
                "upload-tab"
            );


        if (sectionsContent) {

            sectionsContent.classList.add(
                "show",
                "active"
            );

        }


        if (searchContent) {

            searchContent.classList.remove(
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


        if (sectionsTab) {

            sectionsTab.classList.add(
                "active"
            );

            sectionsTab.setAttribute(
                "aria-selected",
                "true"
            );

        }


        if (searchTab) {

            searchTab.classList.remove(
                "active"
            );

            searchTab.setAttribute(
                "aria-selected",
                "false"
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


        initializeTheoryBackButton();
        initializeTheoryExcelDownload();

    })

    .catch(error => {

        console.error(error);

        container.innerHTML = `
            <div class="form-error">
                No se pudieron cargar los
                estudiantes de la sección.
            </div>
        `;

    });

}


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


function initializeTheoryBackButton() {

    const backButton =
        document.getElementById(
            "theory-back-sections"
        );

    if (!backButton) {
        return;
    }


    backButton.addEventListener(
        "click",
        function () {

            const container =
                document.getElementById(
                    "sections-list-container"
                );

            if (!container) {
                return;
            }


            const origen =
                container.dataset.origen;


            /*
             * Si venimos de Buscar,
             * regresar a Buscar.
             */

            if (origen === "buscar") {

                const searchTab =
                    document.getElementById(
                        "search-tab"
                    );

                if (searchTab) {

                    searchTab.click();

                }

                return;

            }


            /*
             * Si venimos de Ver secciones,
             * regresar a la página actual.
             */

            const pagina =
                window.theoryCurrentPage || 1;

            loadTheorySections(
                pagina
            );

        }
    );

}


function initializeTheoryExcelDownload() {

    const downloadButton =
        document.getElementById(
            "theory-download-excel"
        );

    const sectionData =
        document.getElementById(
            "theory-section-students"
        );


    if (!downloadButton || !sectionData) {
        return;
    }


    downloadButton.addEventListener(
        "click",
        function () {

            const profesor =
                sectionData.dataset.profesor;

            const seccion =
                sectionData.dataset.seccion;

            const fisica =
                sectionData.dataset.fisica;


            const parametros =
                new URLSearchParams({
                    profesor: profesor,
                    seccion: seccion,
                    fisica: fisica
                });


            window.location.href =
                `/theory/seccion-estudiantes-excel?${parametros.toString()}`;

        }
    );

}


function initializeTheorySectionRows() {

    const rows =
        document.querySelectorAll(
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
                        "secciones"
                    );

                }
            );

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const uploadTab =
            document.getElementById(
                "upload-tab"
            );

        const sectionsTab =
            document.getElementById(
                "sections-tab"
            );

        const searchTab =
            document.getElementById(
                "search-tab"
            );


        if (uploadTab) {

            uploadTab.addEventListener(
                "click",
                function () {

                    showUploadTab();

                }
            );

        }


        if (sectionsTab) {

            sectionsTab.addEventListener(
                "click",
                function () {

                    loadTheorySections();

                }
            );

        }


        if (searchTab) {

            searchTab.addEventListener(
                "click",
                function () {

                    loadTheorySearch();

                }
            );

        }


        loadTheoryUploadForm();

    }
);
