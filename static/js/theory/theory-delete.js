import {
    getCookie
} from "./theory.js";


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


export {
    loadTheoryDelete
};