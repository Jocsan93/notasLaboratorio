import {
    loadEmpleadosUploadForm
} from "./empleados-upload.js";

import {
    initializeEmpleadosDelete
} from "./empleados-delete.js";

import {
    loadEmpleadosList
} from "./empleados-list.js";

import {
    loadEmpleadosSearch
} from "./empleados-search.js";



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

                    loadEmpleadosList();

                }
            );

        }


        if (searchTab) {

            searchTab.addEventListener(
                "click",
                function () {

                    loadEmpleadosSearch();

                }
            );

        }


        loadEmpleadosUploadForm();

        initializeEmpleadosDelete();

    }
);