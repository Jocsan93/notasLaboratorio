function loadEmpleadosList(page = 1) {

    window.empleadosCurrentPage = page;

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
        `/empleados/lista?page=${page}`,
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
                "No se pudieron cargar los empleados."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;


        formatearNumerosEmpleado();


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


        initializeEmpleadosPagination();
        initializeEmpleadosRows();

    })

    .catch(error => {

        console.error(
            "Error cargando empleados:",
            error
        );

        container.innerHTML = `
            <div class="form-error">
                No se pudieron cargar los
                empleados registrados.
            </div>
        `;

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


function formatearNumerosEmpleado() {

    const filas =
        document.querySelectorAll(
            ".theory-section-row"
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


function initializeEmpleadosPagination() {

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

                    loadEmpleadosList(
                        page
                    );

                }
            );

        }
    );

}


function initializeEmpleadosRows() {

    const rows =
        document.querySelectorAll(
            ".theory-section-row"
        );


    rows.forEach(
        function (row) {

            row.addEventListener(
                "click",
                function () {

                    const numeroEmpleado =
                        formatearNumeroEmpleado(
                            row.dataset.numeroEmpleado
                        );

                    const nombre =
                        row.dataset.nombre;


                    loadEmpleadoDetail(
                        numeroEmpleado,
                        nombre
                    );

                }
            );

        }
    );

}


function loadEmpleadoDetail(
    numeroEmpleado,
    nombre
) {

    const container =
        document.getElementById(
            "employee-detail-container"
        );

    const modalElement =
        document.getElementById(
            "employeeDetailModal"
        );


    if (!container || !modalElement) {
        return;
    }


    container.innerHTML = `
        <div class="text-center py-4">

            <div
                class="spinner-border"
                role="status"
            >
                <span class="visually-hidden">
                    Cargando...
                </span>
            </div>

        </div>
    `;


    const parametros =
        new URLSearchParams({
            numero_empleado:
                numeroEmpleado,
            nombre:
                nombre
        });


    fetch(
        `/empleados/detalle?${parametros.toString()}`,
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
                "No se pudo cargar la información del empleado."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;


        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );


        initializeEmpleadoModifyButton(
            numeroEmpleado,
            nombre
        );


        modal.show();

    })

    .catch(error => {

        console.error(
            "Error cargando empleado:",
            error
        );


        container.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    });

}


function initializeEmpleadoModifyButton(
    numeroEmpleado,
    nombre
) {

    const modifyButton =
        document.getElementById(
            "employee-modify-button"
        );


    if (!modifyButton) {
        return;
    }


    modifyButton.addEventListener(
        "click",
        function () {

            loadEmpleadoUpdateForm(
                numeroEmpleado,
                nombre
            );

        }
    );

}


function loadEmpleadoUpdateForm(
    numeroEmpleado,
    nombre
) {

    const container =
        document.getElementById(
            "employee-detail-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="text-center py-4">

            <div
                class="spinner-border"
                role="status"
            >
                <span class="visually-hidden">
                    Cargando...
                </span>
            </div>

        </div>
    `;


    const parametros =
        new URLSearchParams({
            numero_empleado:
                numeroEmpleado,
            nombre:
                nombre
        });


    fetch(
        `/empleados/modificar?${parametros.toString()}`,
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
                "No se pudo cargar el formulario de modificación."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;


        initializeEmpleadoUpdateForm(
            numeroEmpleado,
            nombre
        );

    })

    .catch(error => {

        console.error(
            "Error cargando formulario:",
            error
        );


        container.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    });

}


function initializeEmpleadoUpdateForm(
    numeroEmpleado,
    nombre
) {

    const updateForm =
        document.getElementById(
            "employee-update-form"
        );

    const cancelButton =
        document.getElementById(
            "employee-cancel-update-button"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                loadEmpleadoDetail(
                    numeroEmpleado,
                    nombre
                );

            }
        );

    }


    if (!updateForm) {
        return;
    }


    updateForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const saveButton =
                document.getElementById(
                    "employee-save-update-button"
                );


            if (saveButton) {

                saveButton.disabled = true;

                saveButton.textContent =
                    "Guardando...";

            }


            const formData =
                new FormData(
                    updateForm
                );


            const parametros =
                new URLSearchParams({
                    numero_empleado:
                        numeroEmpleado,
                    nombre:
                        nombre
                });


            fetch(
                `/empleados/modificar?${parametros.toString()}`,
                {
                    method: "POST",

                    body: formData,

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    }
                }
            )

            .then(response => {

                const contentType =
                    response.headers.get(
                        "content-type"
                    );


                if (
                    contentType &&
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    return response.json();

                }


                return response.text();

            })

            .then(data => {

                if (
                    typeof data === "object" &&
                    data.success
                ) {

                    loadEmpleadoDetail(
                        numeroEmpleado,
                        nombre
                    );

                    return;
                }


                if (
                    typeof data === "string"
                ) {

                    const container =
                        document.getElementById(
                            "employee-detail-container"
                        );


                    if (container) {

                        container.innerHTML =
                            data;


                        initializeEmpleadoUpdateForm(
                            numeroEmpleado,
                            nombre
                        );

                    }

                    return;
                }


                throw new Error(
                    data.message ||
                    "No se pudieron guardar los cambios."
                );

            })

            .catch(error => {

                console.error(
                    "Error actualizando empleado:",
                    error
                );


                const message =
                    document.createElement(
                        "div"
                    );


                message.className =
                    "alert alert-danger";


                message.textContent =
                    error.message;


                updateForm.prepend(
                    message
                );


                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Guardar cambios";

                }

            });

        }
    );

}


function getCookie(name) {

    const cookies =
        document.cookie.split(";");


    for (
        let cookie of cookies
    ) {

        cookie =
            cookie.trim();


        if (
            cookie.startsWith(
                name + "="
            )
        ) {

            return decodeURIComponent(
                cookie.substring(
                    name.length + 1
                )
            );

        }

    }


    return null;

}


export {
    loadEmpleadosList,
    loadEmpleadoDetail
};