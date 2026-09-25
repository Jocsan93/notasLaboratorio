import {
    loadEmpleadosUploadForm
} from "./empleados-upload.js";



document.addEventListener(
    "DOMContentLoaded",
    function () {

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


        if (uploadTab) {

            uploadTab.addEventListener(
                "click",
                function () {

                    loadEmpleadosUploadForm();

                }
            );

        }


        if (sectionsTab) {

            sectionsTab.addEventListener(
                "click",
                function () {

                    // Próximamente

                }
            );

        }


        if (searchTab) {

            searchTab.addEventListener(
                "click",
                function () {

                    // Próximamente

                }
            );

        }


        loadEmpleadosUploadForm();

    }
);