import {
    loadLabUploadForm,
    showUploadTab
} from "./lab-upload.js";

import {
    loadLabSections
} from "./lab-sections.js";

import {
    loadLabSearch
} from "./lab-search.js";

import {
    loadLabDelete
} from "./lab-delete.js";

import {
    loadLabCleanup
} from "./lab-cleanup.js";


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

        const deleteTab =
            document.getElementById(
                "delete-tab"
            );

        const cleanupTab =
            document.getElementById(
                "cleanup-tab"
            );


        if (uploadTab) {

            uploadTab.addEventListener(
                "click",
                function () {

                    showUploadTab();

                }
            );

        }


        if (sectionsTab) {

            sectionsTab.addEventListener(
                "click",
                function () {

                    loadLabSections();

                }
            );

        }


        if (searchTab) {

            searchTab.addEventListener(
                "click",
                function () {

                    loadLabSearch();

                }
            );

        }


        if (deleteTab) {

            deleteTab.addEventListener(
                "click",
                function () {

                    loadLabDelete();

                }
            );

        }


        if (cleanupTab) {

            cleanupTab.addEventListener(
                "click",
                function () {

                    loadLabCleanup();

                }
            );

        }


        loadLabUploadForm();

    }
);