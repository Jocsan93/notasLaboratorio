function generatePassword(length = 8) {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789";

    const randomValues = new Uint32Array(length);

    crypto.getRandomValues(randomValues);

    let password = "";

    for (let i = 0; i < length; i++) {

        password += characters[
            randomValues[i] % characters.length
        ];

    }

    return password;
}


/*
 * ============================================================
 * ADMINISTRADOR
 * ============================================================
 */

function initializeAdminForm() {

    const adminForm =
        document.getElementById("admin-registration-form");

    const togglePassword =
        document.getElementById("toggle-password");

    const passwordInput =
        document.getElementById("id_password");

    const confirmPasswordInput =
        document.getElementById("id_confirm_password");

    const generateButton =
        document.getElementById("generate-password");

    const cancelButton =
        document.getElementById("cancel-registration");

    const formContainer =
        document.getElementById(
            "registration-form-container"
        );


    /*
     * Mostrar / ocultar contraseña
     */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";
                    togglePassword.textContent = "🙈";

                } else {

                    passwordInput.type = "password";
                    togglePassword.textContent = "👁";

                }

            }
        );

    }


    /*
     * Generar contraseña
     */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                const password =
                    generatePassword(8);

                passwordInput.value = password;

                if (confirmPasswordInput) {
                    confirmPasswordInput.value = password;
                }

            }
        );

    }


    /*
     * Cancelar
     */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                formContainer.innerHTML = "";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /*
     * Enviar formulario
     */

    if (adminForm) {

        adminForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const formData =
                    new FormData(adminForm);


                fetch(
                    "/users/admin/registrar-form/",
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
                            "Error al registrar el usuario."
                        );

                    }

                    return response.text();

                })

                .then(html => {

                    formContainer.innerHTML = html;

                    /*
                     * El formulario fue reemplazado,
                     * así que debemos volver a
                     * conectar sus eventos.
                     */

                    initializeAdminForm();

                    formContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                })

                .catch(error => {

                    console.error(error);

                    formContainer.innerHTML = `
                        <div class="form-error">
                            No se pudo registrar el usuario.
                        </div>
                    `;

                });

            }
        );

    }

}


/*
 * ============================================================
 * INSTRUCTOR
 * ============================================================
 */

function initializeInstructorForm() {

    const instructorForm =
        document.getElementById(
            "instructor-registration-form"
        );

    const togglePassword =
        document.getElementById("toggle-password");

    const toggleConfirmPassword =
        document.getElementById(
            "toggle-confirm-password"
        );

    const passwordInput =
        document.getElementById("id_password");

    const confirmPasswordInput =
        document.getElementById(
            "id_confirm_password"
        );

    const generateButton =
        document.getElementById(
            "generate-password"
        );

    const cancelButton =
        document.getElementById(
            "cancel-registration"
        );

    const formContainer =
        document.getElementById(
            "registration-form-container"
        );


    /*
     * Mostrar / ocultar contraseña
     */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";
                    togglePassword.textContent = "🙈";

                } else {

                    passwordInput.type = "password";
                    togglePassword.textContent = "👁";

                }

            }
        );

    }


    /*
     * Mostrar / ocultar confirmación
     */

    if (
        toggleConfirmPassword &&
        confirmPasswordInput
    ) {

        toggleConfirmPassword.addEventListener(
            "click",
            function () {

                if (
                    confirmPasswordInput.type ===
                    "password"
                ) {

                    confirmPasswordInput.type = "text";
                    toggleConfirmPassword.textContent =
                        "🙈";

                } else {

                    confirmPasswordInput.type =
                        "password";

                    toggleConfirmPassword.textContent =
                        "👁";

                }

            }
        );

    }


    /*
     * Generar contraseña
     */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                const password =
                    generatePassword(8);

                passwordInput.value = password;
                confirmPasswordInput.value = password;

            }
        );

    }


    /*
     * Cancelar
     */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                formContainer.innerHTML = "";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /*
     * Enviar formulario
     */

    if (instructorForm) {

        instructorForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const formData =
                    new FormData(instructorForm);


                fetch(
                    "/users/instructor/registrar-form/",
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
                            "Error al registrar el instructor."
                        );

                    }

                    return response.text();

                })

                .then(html => {

                    formContainer.innerHTML = html;

                    /*
                     * El formulario fue reemplazado,
                     * por lo que debemos volver a
                     * conectar todos sus eventos.
                     */

                    initializeInstructorForm();

                    formContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                })

                .catch(error => {

                    console.error(error);

                    formContainer.innerHTML = `
                        <div class="form-error">
                            No se pudo registrar el instructor.
                        </div>
                    `;

                });

            }
        );

    }

}

/*
 * ============================================================
 * PROFESOR
 * ============================================================
 */

function initializeProfessorForm() {

    const professorForm =
        document.getElementById(
            "professor-registration-form"
        );

    const togglePassword =
        document.getElementById("toggle-password");

    const passwordInput =
        document.getElementById("id_password");

    const confirmPasswordInput =
        document.getElementById(
            "id_confirm_password"
        );

    const generateButton =
        document.getElementById(
            "generate-password"
        );

    const cancelButton =
        document.getElementById(
            "cancel-registration"
        );

    const formContainer =
        document.getElementById(
            "registration-form-container"
        );


    /*
     * Mostrar / ocultar contraseña
     */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";
                    togglePassword.textContent = "🙈";

                } else {

                    passwordInput.type = "password";
                    togglePassword.textContent = "👁";

                }

            }
        );

    }


    /*
     * Generar contraseña
     */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                const password =
                    generatePassword(8);

                passwordInput.value = password;

                if (confirmPasswordInput) {
                    confirmPasswordInput.value = password;
                }

            }
        );

    }


    /*
     * Cancelar
     */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                formContainer.innerHTML = "";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }

    /*
     * Enviar formulario
     */

    if (professorForm) {

        professorForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const formData =
                    new FormData(professorForm);


                fetch(
                    "/users/professor/registrar-form/",
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
                            "Error al registrar el profesor."
                        );

                    }

                    return response.text();

                })

                .then(html => {

                    formContainer.innerHTML = html;

                    /*
                     * El formulario fue reemplazado,
                     * por lo que debemos volver a
                     * conectar sus eventos.
                     */

                    initializeProfessorForm();

                    formContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                })

                .catch(error => {

                    console.error(error);

                    formContainer.innerHTML = `
                        <div class="form-error">
                            No se pudo registrar el profesor.
                        </div>
                    `;

                });

            }
        );

    }

}

/*
 * ============================================================
 * ESTUDIANTE
 * ============================================================
 */

function initializeStudentForm() {

    const studentForm =
        document.getElementById(
            "student-registration-form"
        );

    const togglePassword =
        document.getElementById("toggle-password");

    const passwordInput =
        document.getElementById("id_password");

    const confirmPasswordInput =
        document.getElementById(
            "id_confirm_password"
        );

    const generateButton =
        document.getElementById(
            "generate-password"
        );

    const cancelButton =
        document.getElementById(
            "cancel-registration"
        );

    const formContainer =
        document.getElementById(
            "registration-form-container"
        );


    /*
     * Mostrar / ocultar contraseña
     */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";
                    togglePassword.textContent = "🙈";

                } else {

                    passwordInput.type = "password";
                    togglePassword.textContent = "👁";

                }

            }
        );

    }


    /*
     * Generar contraseña
     */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                const password =
                    generatePassword(8);

                passwordInput.value = password;

                if (confirmPasswordInput) {
                    confirmPasswordInput.value = password;
                }

            }
        );

    }


    /*
     * Cancelar
     */

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                formContainer.innerHTML = "";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /*
     * Enviar formulario
     */

    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const formData =
                    new FormData(studentForm);


                fetch(
                    "/users/student/registrar-form/",
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
                            "Error al registrar el estudiante."
                        );

                    }

                    return response.text();

                })

                .then(html => {

                    formContainer.innerHTML = html;

                    /*
                     * El formulario fue reemplazado,
                     * así que volvemos a conectar
                     * sus eventos.
                     */

                    initializeStudentForm();

                    formContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                })

                .catch(error => {

                    console.error(error);

                    formContainer.innerHTML = `
                        <div class="form-error">
                            No se pudo registrar el estudiante.
                        </div>
                    `;

                });

            }
        );

    }

}

/*
 * ============================================================
 * CARGA DE FORMULARIOS
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const btnAdmin =
            document.getElementById("btn-admin");

        const btnInstructor =
            document.getElementById("btn-instructor");

        const btnProfessor =
            document.getElementById("btn-profesor");  

        const btnStudent =
            document.getElementById("btn-estudiante");       

        const formContainer =
            document.getElementById(
                "registration-form-container"
            );


        /*
         * ------------------------------------------------------
         * Añadir administrador
         * ------------------------------------------------------
         */

        if (btnAdmin) {

            btnAdmin.addEventListener(
                "click",
                function () {

                    fetch(
                        "/users/admin/registrar-form/",
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

                        formContainer.innerHTML = html;

                        initializeAdminForm();

                        formContainer.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    })

                    .catch(error => {

                        console.error(error);

                        formContainer.innerHTML = `
                            <div class="form-error">
                                No se pudo cargar el formulario.
                            </div>
                        `;

                    });

                }
            );

        }


        /*
         * ------------------------------------------------------
         * Añadir instructor
         * ------------------------------------------------------
         */

        if (btnInstructor) {

            btnInstructor.addEventListener(
                "click",
                function () {

                    fetch(
                        "/users/instructor/registrar-form/",
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

                        formContainer.innerHTML = html;

                        initializeInstructorForm();

                        formContainer.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    })

                    .catch(error => {

                        console.error(error);

                        formContainer.innerHTML = `
                            <div class="form-error">
                                No se pudo cargar el formulario.
                            </div>
                        `;

                    });

                }
            );

        }
        /*
 * ------------------------------------------------------
 * Añadir profesor
 * ------------------------------------------------------
 */

if (btnProfessor) {

    btnProfessor.addEventListener(
        "click",
        function () {

            fetch(
                "/users/professor/registrar-form/",
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

                formContainer.innerHTML = html;

                initializeProfessorForm();

                formContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            })

            .catch(error => {

                console.error(error);

                formContainer.innerHTML = `
                    <div class="form-error">
                        No se pudo cargar el formulario.
                    </div>
                `;

            });

        }
    );

}

/*
 * ------------------------------------------------------
 * Añadir estudiante
 * ------------------------------------------------------
 */

if (btnStudent) {

    btnStudent.addEventListener(
        "click",
        function () {

            fetch(
                "/users/student/registrar-form/",
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

                formContainer.innerHTML = html;

                initializeStudentForm();

                formContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            })

            .catch(error => {

                console.error(error);

                formContainer.innerHTML = `
                    <div class="form-error">
                        No se pudo cargar el formulario.
                    </div>
                `;

            });

        }
    );

}
    }
    
);