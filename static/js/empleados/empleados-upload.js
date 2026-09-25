function loadEmpleadosUploadForm() {

    const container =
        document.getElementById(
            "upload-sections-container"
        );

    if (!container) {
        return;
    }


    fetch(
        "/empleados/subir",
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

        initializeEmpleadosUploadForm();

    })

    .catch(error => {

        console.error(error);

        container.innerHTML = `
            <div class="form-error">
                No se pudo cargar el formulario
                de carga de empleados.
            </div>
        `;

    });

}


function initializeEmpleadosUploadForm() {

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
                            se analiza la estructura del archivo.
                        </p>

                    </div>

                </div>
            `;


            fetch(
                "/empleados/subir",
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

                initializeEmpleadosUploadForm();

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


export {
    loadEmpleadosUploadForm
};