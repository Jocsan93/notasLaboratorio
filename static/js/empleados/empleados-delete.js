import {
    loadEmpleadosUploadForm
} from "./empleados-upload.js";


function initializeEmpleadosDelete() {

    const deleteButton =
        document.getElementById(
            "employee-delete-all-final-button"
        );

    if (!deleteButton) {
        return;
    }


    deleteButton.addEventListener(
        "click",
        function () {

            deleteButton.disabled = true;

            deleteButton.textContent =
                "Eliminando...";


            fetch(
                "/empleados/eliminar-todos",
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
                        "No se pudieron eliminar los empleados."
                    );
                }

                return response.json();

            })
            .then(data => {

                if (!data.success) {
                    throw new Error(
                        data.message ||
                        "No se pudieron eliminar los empleados."
                    );
                }


                const modalElement =
                    document.getElementById(
                        "employeeDeleteAllConfirmationModal"
                    );


                const modal =
                    bootstrap.Modal.getInstance(
                        modalElement
                    );


                if (modal) {
                    modal.hide();
                }


                loadEmpleadosUploadForm();


                const messageContainer =
                    document.getElementById(
                        "employee-delete-message"
                    );


                if (messageContainer) {

                    messageContainer.innerHTML = `
                        <div
                            class="alert alert-success"
                            role="alert"
                        >
                            <strong>
                                Eliminación completada.
                            </strong>

                            Se eliminaron
                            <strong>
                                ${data.cantidad_eliminada}
                            </strong>
                            registros correctamente.
                        </div>
                    `;

                }


                deleteButton.disabled = false;

                deleteButton.textContent =
                    "Eliminar toda la base";

            })
            .catch(error => {

                console.error(error);


                const messageContainer =
                    document.getElementById(
                        "employee-delete-message"
                    );


                if (messageContainer) {

                    messageContainer.innerHTML = `
                        <div
                            class="alert alert-danger"
                            role="alert"
                        >
                            ${error.message}
                        </div>
                    `;

                }


                deleteButton.disabled = false;

                deleteButton.textContent =
                    "Eliminar toda la base";

            });

        }
    );
}


function getCookie(name) {

    const cookies =
        document.cookie.split(";");


    for (let cookie of cookies) {

        cookie = cookie.trim();


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
    initializeEmpleadosDelete
};