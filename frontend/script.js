const API_URL = "http://localhost:5000";

// REGISTER
async function register() {
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const collegeId = document.getElementById("collegeId").value;

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                collegeId
            })
        });

        const data = await response.json();

        document.getElementById("registerMessage").innerText =
            data.message || "Registration completed.";

    } catch (error) {
        document.getElementById("registerMessage").innerText =
            "Unable to connect to server.";
    }
}


// LOGIN
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    showUserInfo();

    loadLostItems();
    loadFoundItems();
    loadStatistics();

    document.getElementById("loginMessage").innerText =
        "Login successful!";
        } else {
            document.getElementById("loginMessage").innerText =
                data.message || "Login failed.";
        }

    } catch (error) {
        document.getElementById("loginMessage").innerText =
            "Unable to connect to server.";
    }
}

function showLostForm() {
    document.getElementById("itemForm").innerHTML = `
        <div class="auth-box">
            <h2>Report Lost Item</h2>

            <input type="text" id="lostItemName" placeholder="Item Name">

            <input type="text" id="lostCategory" placeholder="Category">

            <textarea id="lostDescription" placeholder="Description"></textarea>

            <input type="text" id="lostLocation" placeholder="Where did you lose it?">

            <input type="date" id="lostDate">

            <button onclick="submitLostItem()">Submit Lost Item</button>

            <p id="lostMessage"></p>
        </div>
    `;
}

async function submitLostItem() {
    const itemName = document.getElementById("lostItemName").value;
    const category = document.getElementById("lostCategory").value;
    const description = document.getElementById("lostDescription").value;
    const location = document.getElementById("lostLocation").value;
    const dateLost = document.getElementById("lostDate").value;

    const token = localStorage.getItem("token");

    if (!token) {
        document.getElementById("lostMessage").innerText =
            "Please login first.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/lost-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                itemName,
                category,
                description,
                location,
                dateLost
            })
        });

        const data = await response.json();

        document.getElementById("lostMessage").innerText =
            data.message || "Lost item submitted successfully.";

            loadLostItems();
            loadStatistics();

    } catch (error) {
        document.getElementById("lostMessage").innerText =
            "Unable to connect to server.";
    }
}
loadLostItems();
loadStatistics();


function showFoundForm() {
    document.getElementById("itemForm").innerHTML = `
        <div class="auth-box">
            <h2>Report Found Item</h2>

            <input type="text" id="foundItemName" placeholder="Item Name">

            <input type="text" id="foundCategory" placeholder="Category">

            <textarea id="foundDescription" placeholder="Description"></textarea>

            <input type="text" id="foundLocation" placeholder="Where did you find it?">

            <input type="date" id="foundDate">

            <button onclick="submitFoundItem()">Submit Found Item</button>

            <p id="foundMessage"></p>
        </div>
    `;
}

async function submitFoundItem() {
    const itemName = document.getElementById("foundItemName").value;
    const category = document.getElementById("foundCategory").value;
    const description = document.getElementById("foundDescription").value;
    const location = document.getElementById("foundLocation").value;
    const dateFound = document.getElementById("foundDate").value;

    const token = localStorage.getItem("token");

    if (!token) {
        document.getElementById("foundMessage").innerText =
            "Please login first.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/found-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                itemName,
                category,
                description,
                location,
                dateFound
            })
        });

        const data = await response.json();

        document.getElementById("foundMessage").innerText =
            data.message || "Found item submitted successfully.";
            loadFoundItems();
            loadStatistics();

    } catch (error) {
        document.getElementById("foundMessage").innerText =
            "Unable to connect to server.";
    }
}
loadFoundItems();
loadStatistics();

async function loadLostItems() {
    try {
        const response = await fetch(`${API_URL}/api/lost-items`);
        const data = await response.json();

        const lostItemsContainer =
            document.getElementById("lostItems");

        lostItemsContainer.innerHTML = "";

        if (!data.lostItems || data.lostItems.length === 0) {
            lostItemsContainer.innerHTML =
                "<p>No lost items found.</p>";
            return;
        }

        data.lostItems.forEach(item => {

            const currentUser = JSON.parse(localStorage.getItem("user"));
            const isMyItem = currentUser && item.userId._id === currentUser.id;

            lostItemsContainer.innerHTML += `
                <div class="item-card">
                    <h3>${item.itemName}</h3>
                    <span class="status-badge lost">LOST</span>

                    <p>
                        <strong>Category:</strong>
                        ${item.category}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${item.description}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${item.location}
                    </p>

                    <p>
                        <strong>Date Lost:</strong>
                        ${item.dateLost.split("T")[0]}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${item.status}
                    </p>

                    ${isMyItem ? `
                    <button onclick="findMatches('${item._id}')">
                         Find Possible Matches
                    </button>

    <div id="matches-${item._id}"></div>
` : ""}

                </div>
            `;
        });

    } catch (error) {
        console.error(error);

        document.getElementById("lostItems").innerHTML =
            "<p>Unable to load lost items.</p>";
    }
}

loadLostItems();
loadStatistics();

async function loadFoundItems() {
    try {
        const response = await fetch(`${API_URL}/api/found-items`);
        const data = await response.json();

        const foundItemsContainer =
            document.getElementById("foundItems");

        foundItemsContainer.innerHTML = "";

        if (!data.foundItems || data.foundItems.length === 0) {
            foundItemsContainer.innerHTML =
                "<p>No found items available.</p>";
            return;
        }

        data.foundItems.forEach(item => {
            foundItemsContainer.innerHTML += `
                <div class="item-card">
                    <h3>${item.itemName}</h3>
                    <span class="status-badge ${item.status === "returned" ? "returned" : "available"}">
    ${item.status === "returned" ? "RETURNED" : "AVAILABLE"}
</span>

                    <p>
                        <strong>Category:</strong>
                        ${item.category}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${item.description}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${item.location}
                    </p>

                    <p>
                        <strong>Date Found:</strong>
                        ${item.dateFound.split("T")[0]}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${item.status}
                    </p>

                    ${(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isMyItem =
        currentUser && item.userId._id === currentUser.id;

    if (isMyItem && item.status === "available") {
        return `
            <button onclick="markAsReturned('${item._id}')">
                Mark as Returned
            </button>
        `;
    }

    return "";
})()}
                </div>
            `;
        });

    } catch (error) {
        console.error(error);

        document.getElementById("foundItems").innerHTML =
            "<p>Unable to load found items.</p>";
    }
}

loadFoundItems();
loadStatistics();

function searchFoundItems() {
    const searchText =
        document.getElementById("foundSearch").value.toLowerCase();

    const cards =
        document.querySelectorAll("#foundItems .item-card");

    cards.forEach(card => {
        const cardText = card.innerText.toLowerCase();

        if (cardText.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

async function contactFinder(userId) {
    try {
        const response = await fetch(
            `${API_URL}/api/auth/user/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to fetch finder details.");
            return;
        }

        const user = data.user;

        document.getElementById("finderName").innerText = user.name;
        document.getElementById("finderEmail").innerText = user.email;
        document.getElementById("finderCollegeId").innerText = user.collegeId;

        document.getElementById("contactModal").style.display = "block";

    } catch (error) {
        console.error(error);
        alert("Unable to connect to server.");
    }
}
function closeContactModal() {
    document.getElementById("contactModal").style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById("contactModal");

    if (event.target === modal) {
        modal.style.display = "none";
    }
};

async function findMatches(lostItemId) {
    const token = localStorage.getItem("token");
    const matchContainer = document.getElementById(`matches-${lostItemId}`);

    if (!token) {
        matchContainer.innerHTML =
            "<p>Please login first.</p>";
        return;
    }

    matchContainer.innerHTML =
        "<p>Finding possible matches...</p>";

    try {
        const response = await fetch(
            `${API_URL}/api/matches/lost/${lostItemId}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            matchContainer.innerHTML =
                `<p>${data.message || "Unable to find matches."}</p>`;
            return;
        }

        if (!data.matches || data.matches.length === 0) {
            matchContainer.innerHTML =
                "<p>No possible matches found.</p>";
            return;
        }

        matchContainer.innerHTML = `
            <h4>Possible Matches</h4>
        `;

data.matches.forEach(match => {
    const item = match.foundItem;

    matchContainer.innerHTML += `
        <div class="match-card">
            <h4>${item.itemName}</h4>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Date Found:</strong> ${item.dateFound.split("T")[0]}</p>
            <p>
    <strong>Match Score:</strong>
    ${match.score}/125
</p>

<p>
    <strong>Match Level:</strong>
    ${
        match.score >= 80
            ? "High Match"
            : match.score >= 50
                ? "Possible Match"
                : "Low Match"
    }
</p>
            <button onclick="contactFinder('${match.foundItem.userId._id}')">
    Contact Finder
    </button>
        </div>
    `;
});
    } catch (error) {
        console.error(error);

        matchContainer.innerHTML =
            "<p>Unable to connect to server.</p>";
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.getElementById("userInfo").innerHTML = "";

    alert("Logged out successfully!");

    location.reload();
}

function showUserInfo() {
    const userInfo = document.getElementById("userInfo");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        userInfo.innerHTML = "";
        return;
    }

    userInfo.innerHTML = `
        <div>
            <strong>Welcome, ${user.name}!</strong>
            <button onclick="logout()">Logout</button>
        </div>
    `;
}

showUserInfo();

async function markAsReturned(itemId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in first.");
        return;
    }

    const confirmReturn = confirm(
        "Are you sure you want to mark this item as returned?"
    );

    if (!confirmReturn) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/found-items/${itemId}/returned`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to mark item as returned.");
            return;
        }

        alert("Item marked as returned successfully! ✅");

// Refresh found items and dashboard statistics
loadFoundItems();
loadStatistics();

    } catch (error) {
        console.error(error);
        alert("Unable to connect to server.");
    }
}

function searchLostItems() {
    const searchText =
        document.getElementById("lostSearch").value.toLowerCase();

    const cards =
        document.querySelectorAll("#lostItems .item-card");

    cards.forEach(card => {
        const cardText = card.innerText.toLowerCase();

        if (cardText.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function searchFoundItems() {
    const searchText =
        document.getElementById("foundSearch").value.toLowerCase();

    const cards =
        document.querySelectorAll("#foundItems .item-card");

    cards.forEach(card => {
        const cardText = card.innerText.toLowerCase();

        if (cardText.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

async function loadStatistics() {
    try {
        const lostResponse = await fetch(`${API_URL}/api/lost-items`);
        const foundResponse = await fetch(`${API_URL}/api/found-items`);

        const lostData = await lostResponse.json();
        const foundData = await foundResponse.json();

        const lostItems = lostData.lostItems || [];
        const foundItems = foundData.foundItems || [];

        const returnedItems =
            foundItems.filter(item => item.status === "returned").length;

        document.getElementById("lostCount").innerText =
            lostItems.length;

        document.getElementById("foundCount").innerText =
            foundItems.length;

        document.getElementById("returnedCount").innerText =
            returnedItems;

    } catch (error) {
        console.error("Unable to load statistics:", error);
    }
}

loadStatistics();