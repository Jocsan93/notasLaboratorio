function loadLabSections(page = 1) {

    window.labCurrentPage = page;

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
        `/lab/secciones?page=${page}`,
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


        initializeLabPagination();
        initializeLabSectionRows();

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


function initializeLabPagination() {

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

                    loadLabSections(
                        page
                    );

                }
            );

        }
    );

}


function loadLabSectionStudents(
    fisica,
    dia,
    hora,
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
            fisica: fisica,
            dia: dia,
            hora: hora
        });


    fetch(
        `/lab/seccion-estudiantes?${parametros.toString()}`,
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


        initializeLabBackButton();
        initializeLabExcelDownload();

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


function initializeLabBackButton() {

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


            const pagina =
                window.labCurrentPage || 1;

            loadLabSections(
                pagina
            );

        }
    );

}


function initializeLabExcelDownload() {

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

            const fisica =
                sectionData.dataset.fisica;

            const dia =
                sectionData.dataset.dia;

            const hora =
                sectionData.dataset.hora;


            const parametros =
                new URLSearchParams({
                    fisica: fisica,
                    dia: dia,
                    hora: hora
                });


            window.location.href =
                `/lab/seccion-estudiantes-excel?${parametros.toString()}`;

        }
    );

}


function initializeLabSectionRows() {

    const rows =
        document.querySelectorAll(
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
                        "secciones"
                    );

                }
            );

        }
    );

}


export {
    loadLabSections,
    loadLabSectionStudents
};