/* =====================================================
   CREATORGIGS JAVASCRIPT
===================================================== */


/* =====================================================
   SEARCH
===================================================== */

const searchForm = document.getElementById("searchForm");

const searchInput = document.getElementById("searchInput");

const gigCards = document.querySelectorAll(".gig-card");


searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const searchValue =
        searchInput.value
        .trim()
        .toLowerCase();


    if (searchValue === "") {

        alert("Please enter a skill or service.");

        return;
    }


    let found = false;


    gigCards.forEach(function (card) {

        const text =
            card.innerText.toLowerCase();


        if (text.includes(searchValue)) {

            card.style.display = "block";

            found = true;

        } else {

            card.style.display = "none";

        }

    });


    if (found) {

        document
            .getElementById("gigs")
            .scrollIntoView({
                behavior: "smooth"
            });

    } else {

        alert(
            "No service found for: " +
            searchInput.value
        );

        gigCards.forEach(function (card) {

            card.style.display = "block";

        });

    }

});


/* =====================================================
   VIEW GIG BUTTONS
===================================================== */

const gigButtons =
    document.querySelectorAll(".view-gig");


gigButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card =
            button.closest(".gig-card");

        const title =
            card.querySelector("h3").innerText;

        const creator =
            card.querySelector(".creator").innerText;

        const rating =
            card.querySelector(".rating strong").innerText;


        alert(
            "🎯 " + title +
            "\n\n" +
            creator +
            "\n" +
            "⭐ Rating: " + rating +
            "\n\n" +
            "Booking feature will be connected to the backend."
        );

    });

});


/* =====================================================
   CATEGORY FILTER
===================================================== */

const categories =
    document.querySelectorAll(".category-card");


categories.forEach(function (category) {

    category.addEventListener("click", function () {

        const selectedCategory =
            category.dataset.category;


        gigCards.forEach(function (card) {

            const tag =
                card
                    .querySelector(".gig-tag")
                    .innerText
                    .toLowerCase();


            if (
                selectedCategory === "design" &&
                tag.includes("design")
            ) {

                card.style.display = "block";

            } else if (
                selectedCategory === "video" &&
                tag.includes("video")
            ) {

                card.style.display = "block";

            } else if (
                selectedCategory === "tutoring" &&
                tag.includes("tutoring")
            ) {

                card.style.display = "block";

            } else if (
                selectedCategory === "music" &&
                tag.includes("music")
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });


        document
            .getElementById("gigs")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =====================================================
   VIEW ALL
===================================================== */

const viewAllBtn =
    document.getElementById("viewAllBtn");


viewAllBtn.addEventListener("click", function () {

    gigCards.forEach(function (card) {

        card.style.display = "block";

    });

    searchInput.value = "";

});


/* =====================================================
   BECOME CREATOR FORM
===================================================== */

const creatorForm =
    document.getElementById("creatorForm");


creatorForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("creatorName")
                .value
                .trim();


        const email =
            document
                .getElementById("creatorEmail")
                .value
                .trim();


        const skill =
            document
                .getElementById("creatorSkill")
                .value;


        const price =
            document
                .getElementById("creatorPrice")
                .value;


        const serviceTitle =
            document
                .getElementById("serviceTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("serviceDescription")
                .value
                .trim();


        /* Basic validation */

        if (
            !name ||
            !email ||
            !skill ||
            !price ||
            !serviceTitle ||
            !description
        ) {

            alert(
                "Please fill all the fields."
            );

            return;
        }


        /* Success message */

        alert(
            "🎉 Creator profile created successfully!\n\n" +
            "Welcome, " + name + "!"
        );


        /* Reset form */

        creatorForm.reset();


        /*
            In the next version,
            this data can be sent to
            a backend/database.
        */

    }
);


/* =====================================================
   NAVBAR ACTIVE LINK
===================================================== */

const navLinks =
    document.querySelectorAll(".navbar nav a");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});