/* =========================================
   CREATORGIGS - JAVASCRIPT
   ========================================= */

const API_URL = "/api";

let allCreators = [];


/* =========================================
   PAGE LOAD
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadCreators();

    const creatorForm = document.getElementById("creatorForm");

    if (creatorForm) {
        creatorForm.addEventListener("submit", createCreator);
    }
});


/* =========================================
   LOAD CREATORS FROM SERVER
   ========================================= */

async function loadCreators() {

    const gigGrid = document.getElementById("gigGrid");

    try {

        const response = await fetch(`${API_URL}/creators`);

        if (!response.ok) {
            throw new Error("Could not load creators");
        }

        allCreators = await response.json();

        updateSiteStats(allCreators);
        displayCreators(allCreators);

    } catch (error) {

        console.error(error);

        gigGrid.innerHTML = `
            <div class="loading">
                <h3>Unable to load creators</h3>
                <p>Please make sure the server is running.</p>
            </div>
        `;
    }
}


/* =========================================
   DISPLAY CREATOR CARDS
   ========================================= */

function displayCreators(creators) {

    const gigGrid = document.getElementById("gigGrid");

    if (!creators || creators.length === 0) {

        gigGrid.innerHTML = `
            <div class="loading">
                <h3>No creators found yet.</h3>
                <p>Be the first creator to join CreatorGigs!</p>
            </div>
        `;

        return;
    }


    gigGrid.innerHTML = creators.map(creator => {

        const rating = Number(creator.rating || 0);

        const stars = getStars(rating);

        const emoji = getSkillEmoji(creator.skill);

        return `
            <div class="gig-card">

                <div class="gig-icon">
                    ${emoji}
                </div>

                <h3>${escapeHTML(creator.name)}</h3>

                <div class="service-title">
                    ${escapeHTML(creator.serviceTitle || "")}
                </div>

                <p class="gig-description">
                    ${escapeHTML(creator.description)}
                </p>

                <div class="rating">
                    ${stars}

                    <span class="rating-number">
                        ${rating.toFixed(1)}
                        (${creator.reviewCount || 0} reviews)
                    </span>
                </div>

                <div class="price">
                    ₹${Number(creator.price).toLocaleString("en-IN")}
                    <small> starting</small>
                </div>

                <div class="gig-actions">

                    <button onclick="bookCreator(${creator.id})">
                        Book
                    </button>

                    <button onclick="addReview(${creator.id})">
                        ⭐ Review
                    </button>

                </div>

            </div>
        `;

    }).join("");
}


/* =========================================
   CREATE CREATOR
   ========================================= */

async function createCreator(event) {

    event.preventDefault();

    const name = document.getElementById("creatorName").value.trim();

    const email = document.getElementById("creatorEmail").value.trim();

    const skill = document.getElementById("creatorSkill").value;

    const price = document.getElementById("creatorPrice").value;

    const serviceTitle =
        document.getElementById("serviceTitle").value.trim();

    const description =
        document.getElementById("serviceDescription").value.trim();


    if (!name || !email || !skill || !price || !serviceTitle || !description) {

        alert("Please fill all fields.");

        return;
    }


    try {

        const response = await fetch(`${API_URL}/creators`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                email,
                skill,
                price: Number(price),
                serviceTitle,
                description

            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.message || data.error || "Failed to create profile");

        }


        alert("🎉 Your Creator profile has been created!");


        document.getElementById("creatorForm").reset();


        await loadCreators();


        document.getElementById("gigs").scrollIntoView({

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);

        alert("Something went wrong: " + error.message);

    }

}


/* =========================================
   BOOK CREATOR
   ========================================= */

async function bookCreator(creatorId) {

    const creator = allCreators.find(
        item => Number(item.id) === Number(creatorId)
    );


    if (!creator) {

        alert("Creator not found.");

        return;
    }


    const clientName = prompt("Enter your name:");

    if (!clientName) return;


    const clientEmail = prompt("Enter your email:");

    if (!clientEmail) return;


    const bookingDate = prompt(
        "Enter booking date (YYYY-MM-DD):"
    );

    if (!bookingDate) return;


    const message = prompt(
        "Tell the creator what you need:"
    ) || "";


    try {

        const response = await fetch(`${API_URL}/bookings`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                creatorId,

                clientName,

                clientEmail,

                bookingDate,

                message: message

            })

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || data.error || "Booking failed"
            );

        }


        alert(
            `✅ Booking request sent to ${creator.name}!`
        );


    } catch (error) {

        console.error(error);

        alert(
            "Could not create booking: " +
            error.message
        );

    }

}


/* =========================================
   ADD REVIEW
   ========================================= */

async function addReview(creatorId) {

    const reviewerName = prompt(
        "Enter your name:"
    );

    if (!reviewerName) return;


    let rating = prompt(
        "Give a rating from 1 to 5:"
    );

    if (!rating) return;


    rating = Number(rating);


    if (
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > 5
    ) {

        alert("Rating must be between 1 and 5.");

        return;
    }


    const comment = prompt(
        "Write your review:"
    ) || "";


    try {

        const response = await fetch(`${API_URL}/reviews`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

    creatorId: creatorId,

    reviewerName: reviewerName,

    rating: rating,

    comment: comment

})


        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || data.error || "Review failed"
            );

        }


        alert("⭐ Thank you! Your review was added.");


        await loadCreators();


    } catch (error) {

        console.error(error);

        alert(
            "Could not add review: " +
            error.message
        );

    }

}


/* =========================================
   SEARCH
   ========================================= */

function searchCreators() {

    const input =
        document.getElementById("searchInput");

    const searchText =
        input.value.trim().toLowerCase();


    if (!searchText) {

        displayCreators(allCreators);

        return;
    }


    const filtered = allCreators.filter(creator => {

        return (

            creator.name.toLowerCase().includes(searchText) ||

            creator.skill.toLowerCase().includes(searchText) ||

            (creator.serviceTitle || "").toLowerCase().includes(searchText) ||

            creator.description.toLowerCase().includes(searchText)

        );

    });


    displayCreators(filtered);


    document.getElementById("gigs").scrollIntoView({

        behavior: "smooth"

    });

}


/* =========================================
   CATEGORY FILTER
   ========================================= */

function filterCategory(category) {

    const filtered = allCreators.filter(

        creator =>
            creator.skill.toLowerCase() ===
            category.toLowerCase()

    );


    displayCreators(filtered);


    document.getElementById("gigs").scrollIntoView({

        behavior: "smooth"

    });

}


/* =========================================
   LOGIN MESSAGE
   ========================================= */

function showLoginMessage() {

    alert(
        "🔐 Login system will be added in the next version."
    );

}


/* =========================================
   STAR RATING
   ========================================= */

function getStars(rating) {

    const rounded =
        Math.round(Number(rating));


    let stars = "";


    for (let i = 1; i <= 5; i++) {

        if (i <= rounded) {

            stars += "★";

        } else {

            stars += "☆";

        }

    }


    return stars;

}


/* =========================================
   SKILL EMOJI
   ========================================= */

function getSkillEmoji(skill) {

    const emojis = {

        "Design": "🎨",

        "Video Editing": "🎬",

        "Tutoring": "📚",

        "Music": "🎵",

        "Programming": "💻",

        "Writing": "✍️"

    };


    return emojis[skill] || "✨";

}


/* =========================================
   SECURITY HELPER
   ========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   SITE STATISTICS
   ========================================= */

function updateSiteStats(creators) {

    const creatorCount = creators.length;

    const totalRating = creators.reduce(
        (sum, creator) => sum + Number(creator.rating || 0),
        0
    );

    const averageRating = creatorCount > 0
        ? totalRating / creatorCount
        : 0;

    const totalReviews = creators.reduce(
        (sum, creator) => sum + Number(creator.reviewCount || 0),
        0
    );

    const averageRatingElement = document.getElementById("siteAverageRating");
    const userCountElement = document.getElementById("siteUserCount");
    const reviewCountElement = document.getElementById("siteReviewCount");

    if (averageRatingElement) {
        averageRatingElement.textContent = averageRating.toFixed(1);
    }

    if (userCountElement) {
        userCountElement.textContent = creatorCount;
    }

    if (reviewCountElement) {
        reviewCountElement.textContent = totalReviews;
    }
}
