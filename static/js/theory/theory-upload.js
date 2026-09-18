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


export {
    loadTheoryUploadForm,
    showUploadTab
};