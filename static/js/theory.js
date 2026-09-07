console.log("Hola desde JS")

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

                /*
                 * El formulario fue reemplazado,
                 * por lo que debemos volver a
                 * conectar sus eventos.
                 */

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

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const uploadTab =
            document.getElementById(
                "upload-tab"
            );


        if (uploadTab) {

            uploadTab.addEventListener(
                "shown.bs.tab",
                function () {

                    loadTheoryUploadForm();

                }
            );

        }


        /*
         * Cargar inicialmente el formulario,
         * ya que "Subir secciones" es la pestaña
         * activa al entrar.
         */

        loadTheoryUploadForm();

    }
);