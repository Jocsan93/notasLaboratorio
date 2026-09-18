import {
    loadTheoryUploadForm,
    showUploadTab
} from "./theory-upload.js";

import {
    loadTheorySections
} from "./theory-sections.js";

import {
    loadTheorySearch
} from "./theory-search.js";

import {
    loadTheoryDelete
} from "./theory-delete.js";


function getCookie(name) {

    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {

        const cookies =
            document.cookie.split(";");

        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {

            const cookie =
                cookies[i].trim();

            if (
                cookie.substring(
                    0,
                    name.length + 1
                ) ===
                name + "="
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


export {
    getCookie
};


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

                    loadTheorySections();

                }
            );

        }


        if (searchTab) {

            searchTab.addEventListener(
                "click",
                function () {

                    loadTheorySearch();

                }
            );

        }


        if (deleteTab) {

            deleteTab.addEventListener(
                "click",
                function () {

                    loadTheoryDelete();

                }
            );

        }


        loadTheoryUploadForm();

    }
);