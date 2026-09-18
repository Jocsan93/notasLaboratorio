let theorySearchValue = "";

function getCookie(name) {

    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {

        const cookies =
            document.cookie.split(";");

        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {

            const cookie =
                cookies[i].trim();

            if (
                cookie.substring(
                    0,
                    name.length + 1
                ) ===
                name + "="
            ) {

                cookieValue =
                    decodeURIComponent(
                        cookie.substring(
                            name.length + 1
                        )
                    );

                break;

            }

        }

    }

    return cookieValue;

}


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

function loadTheoryDelete() {

const container =
    document.getElementById(
        "delete-sections-container"
    );

if (!container) {
    return;
}


fetch(
    "/theory/eliminar",
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
            "No se pudo cargar la sección de eliminación."
        );

    }

    return response.text();

})

.then(html => {

    container.innerHTML = html;
    initializeTheoryDelete();

})

.catch(error => {

    console.error(
        "Error cargando eliminación:",
        error
    );

    container.innerHTML = `
        <div class="form-error">
            No se pudo cargar la sección
            de eliminación.
        </div>
    `;

});


}

function initializeTheoryDelete() {

    const deleteButton =
        document.getElementById(
            "theory-final-delete-button"
        );

    if (!deleteButton) {
        return;
    }


    deleteButton.addEventListener(
        "click",
        function () {

            fetch(
                "/theory/eliminar",
                {
                    method: "POST",

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest",

                        "X-CSRFToken":
                            getCookie("csrftoken")
                    }
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "No se pudieron eliminar los registros."
                    );

                }

                return response.json();

            })

            .then(data => {

    if (data.success) {

        const modal =
            document.getElementById(
                "theoryDeleteNuclearModal"
            );

        if (modal) {

            const modalInstance =
                bootstrap.Modal.getInstance(
                    modal
                );

            if (modalInstance) {
                modalInstance.hide();
            }

        }

        document.body.classList.remove(
            "modal-open"
        );

        document
            .querySelectorAll(
                ".modal-backdrop"
            )
            .forEach(
                function (backdrop) {
                    backdrop.remove();
                }
            );

        document.body.style.removeProperty(
            "padding-right"
        );


        const container =
            document.getElementById(
                "delete-sections-container"
            );

        if (!container) {
            return;
        }


        container.innerHTML = `

            <div class="theory-delete-success">

                <div class="theory-delete-success-icon">
                    ✓
                </div>

                <h2>
                    Eliminación completada
                </h2>

                <p>
                    Los registros de teoría fueron
                    eliminados correctamente.
                </p>

                <div class="theory-delete-success-count">

                    <strong>
                        ${data.cantidad_eliminada}
                    </strong>

                    <span>
                        registros eliminados
                    </span>

                </div>

            </div>

        `;

    }

})


                

            .catch(error => {

                console.error(
                    "Error eliminando registros:",
                    error
                );

            });

        }
    );

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

        const deleteTab =
            document.getElementById(
                "delete-tab"
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

        if (deleteTab) {

                deleteTab.addEventListener(
                    "click",
                    function () {

                        loadTheoryDelete();

                    }
                );

            }


        loadTheoryUploadForm();

    }
);
