document.addEventListener(
    "DOMContentLoaded",
    function () {

        const startButton =
            document.getElementById(
                "change-password-start-button"
            );

        const startState =
            document.getElementById(
                "change-password-start"
            );

        const sendingState =
            document.getElementById(
                "change-password-sending"
            );

        const verificationState =
            document.getElementById(
                "change-password-verification"
            );

        const codeInputs =
            document.querySelectorAll(
                ".change-password-code-input"
            );

        if (
            !startButton ||
            !startState ||
            !sendingState ||
            !verificationState
        ) {
            return;
        }


        startButton.addEventListener(
            "click",
            function () {

                startState.classList.add(
                    "d-none"
                );

                sendingState.classList.remove(
                    "d-none"
                );

                fetch(
                    "/users/solicitar-cambio-password",
                    {
                        method: "POST",

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
                .then(
                    function (response) {

                        if (!response.ok) {

                            throw new Error(
                                "No se pudo solicitar el cambio de contraseña."
                            );

                        }

                        return response.json();

                    }
                )
                .then(
                    function (data) {

                        if (!data.success) {

                            throw new Error(
                                data.message ||
                                "No se pudo solicitar el cambio de contraseña."
                            );

                        }

                        sendingState.classList.add(
                            "d-none"
                        );

                        verificationState.classList.remove(
                            "d-none"
                        );

                        if (
                            codeInputs.length > 0
                        ) {

                            codeInputs[0].focus();

                        }

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            error
                        );

                        sendingState.classList.add(
                            "d-none"
                        );

                        startState.classList.remove(
                            "d-none"
                        );

                        alert(
                            error.message
                        );

                    }
                );

            }
        );


        codeInputs.forEach(
            function (input, index) {

                input.addEventListener(
                    "input",
                    function () {

                        input.value =
                            input.value.replace(
                                /\D/g,
                                ""
                            );

                        if (
                            input.value &&
                            index <
                            codeInputs.length - 1
                        ) {

                            codeInputs[
                                index + 1
                            ].focus();

                        }

                    }
                );


                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                            "Backspace" &&
                            !input.value &&
                            index > 0
                        ) {

                            codeInputs[
                                index - 1
                            ].focus();

                        }

                    }
                );


                input.addEventListener(
                    "paste",
                    function (event) {

                        event.preventDefault();

                        const pastedText =
                            (
                                event.clipboardData ||
                                window.clipboardData
                            ).getData("text");

                        const digits =
                            pastedText.replace(
                                /\D/g,
                                ""
                            ).slice(
                                0,
                                codeInputs.length
                            );

                        digits
                            .split("")
                            .forEach(
                                function (
                                    digit,
                                    digitIndex
                                ) {

                                    codeInputs[
                                        digitIndex
                                    ].value =
                                        digit;

                                }
                            );

                        if (
                            digits.length > 0
                        ) {

                            const nextIndex =
                                Math.min(
                                    digits.length,
                                    codeInputs.length - 1
                                );

                            codeInputs[
                                nextIndex
                            ].focus();

                        }

                    }
                );

            }
        );

    }
);


function getCookie(name) {

    const cookies =
        document.cookie.split(";");

    for (
        let cookie of cookies
    ) {

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