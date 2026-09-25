function getCookie(
    name
) {

    let cookieValue = null;

    if (document.cookie) {

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


function loadLabCleanup() {

    const container =
        document.getElementById(
            "cleanup-sections-container"
        );

    if (!container) {
        return;
    }


    fetch(
        "/lab/depurar",
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
                "No se pudo cargar la sección de depuración."
            );

        }

        return response.text();

    })

    .then(html => {

        container.innerHTML = html;

        initializeLabCleanup();

    })

    .catch(error => {

        console.error(
            "Error cargando depuración:",
            error
        );

        container.innerHTML = `
            <div class="form-error">
                No se pudo cargar la sección
                de depuración.
            </div>
        `;

    });

}


function initializeLabCleanup() {

    const deleteButtons =
        document.querySelectorAll(
            ".lab-cleanup-delete-button"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const nombre =
                        button.dataset.nombre;

                    const cuenta =
                        button.dataset.cuenta;

                    const correo =
                        button.dataset.correo;

                    const fisica =
                        button.dataset.fisica;

                    const seccion =
                        button.dataset.seccion;


                    document.getElementById(
                        "cleanup-student-name"
                    ).textContent =
                        nombre;

                    document.getElementById(
                        "cleanup-student-account"
                    ).textContent =
                        cuenta;

                    document.getElementById(
                        "cleanup-student-email"
                    ).textContent =
                        correo;

                    document.getElementById(
                        "cleanup-student-physics"
                    ).textContent =
                        fisica;

                    document.getElementById(
                        "cleanup-student-section"
                    ).textContent =
                        seccion;


                    const finalDeleteButton =
                        document.getElementById(
                            "lab-cleanup-final-delete-button"
                        );


                    if (!finalDeleteButton) {
                        return;
                    }


                    finalDeleteButton.dataset.cuenta =
                        cuenta;

                    finalDeleteButton.dataset.row =
                        button.closest("tr")
                            ? "true"
                            : "false";

                    finalDeleteButton.dataset.nombre =
                        nombre;

                }
            );

        }
    );


    const finalDeleteButton =
        document.getElementById(
            "lab-cleanup-final-delete-button"
        );


    if (!finalDeleteButton) {
        return;
    }


    finalDeleteButton.addEventListener(
        "click",
        function () {

            const cuenta =
                finalDeleteButton.dataset.cuenta;


            if (!cuenta) {
                return;
            }


            fetch(
                "/lab/depurar",
                {
                    method: "POST",

                    headers: {
                        "X-Requested-With":
                            "XMLHttpRequest",

                        "Content-Type":
                            "application/x-www-form-urlencoded",

                        "X-CSRFToken":
                            getCookie(
                                "csrftoken"
                            )
                    },

                    body:
                        new URLSearchParams({
                            cuenta: cuenta
                        })
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "No se pudo eliminar el estudiante."
                    );

                }

                return response.json();

            })

            .then(data => {

                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "No se pudo eliminar el estudiante."
                    );

                }


                const modal =
                    document.getElementById(
                        "labCleanupNuclearModal"
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


                const row =
                    document.querySelector(
                        `.lab-cleanup-delete-button[data-cuenta="${CSS.escape(cuenta)}"]`
                    )?.closest("tr");


                if (row) {

                    row.remove();

                }


                const totalTeoria =
                    document.querySelector(
                        ".lab-cleanup-total-teoria"
                    );


                const totalFaltantes =
                    document.querySelector(
                        ".lab-cleanup-total-faltantes"
                    );


                if (totalTeoria) {

                    const cantidadActual =
                        parseInt(
                            totalTeoria.textContent,
                            10
                        );


                    if (!isNaN(cantidadActual)) {

                        totalTeoria.textContent =
                            Math.max(
                                cantidadActual - 1,
                                0
                            );

                    }

                }


                if (totalFaltantes) {

                    const cantidadActual =
                        parseInt(
                            totalFaltantes.textContent,
                            10
                        );


                    if (!isNaN(cantidadActual)) {

                        totalFaltantes.textContent =
                            Math.max(
                                cantidadActual - 1,
                                0
                            );

                    }

                }

            })

            .catch(error => {

                console.error(
                    "Error eliminando estudiante:",
                    error
                );

            });

        }
    );

}


export {
    loadLabCleanup
};