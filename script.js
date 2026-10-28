let selectedRoom = "";
let selectedPrice = 0;


/* ===============================
   LOGIN NAVIGATION AND LOGOUT
=============================== */

function updateNavigation() {
    let username = localStorage.getItem("username");

    let authLink = document.getElementById("authLink");
    let userLink = document.getElementById("userLink");
    let navUsername = document.getElementById("navUsername");
    let logoutBtn = document.getElementById("logoutBtn");

    if (!authLink || !userLink || !navUsername || !logoutBtn) {
        return;
    }

    if (username) {
        authLink.style.display = "none";
        userLink.style.display = "inline";
        logoutBtn.style.display = "inline-block";
        navUsername.textContent = username;
    } else {
        authLink.style.display = "inline";
        userLink.style.display = "none";
        logoutBtn.style.display = "none";
        navUsername.textContent = "";
    }
}

function logout() {
    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    localStorage.removeItem("username");
    localStorage.removeItem("email");

    alert("Logged out successfully!");

    window.location.href = "index.html";
}

updateNavigation();


// ===============================
// ROOM SELECTION
// ===============================

function selectRoom(room, price) {

    selectedRoom = room;
    selectedPrice = price;

    document.getElementById("selectedRoom").value = room;
    document.getElementById("roomPrice").value = price;

    let roomDetails = document.getElementById("roomDetails");

    if (roomDetails) {
        roomDetails.innerText =
            room + " - ₹" + price + " / Night";
    }

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });

    calculateBill();
}


// ===============================
// BILL CALCULATION
// ===============================

function calculateBill() {

    let checkIn = document.getElementById("checkIn");
    let checkOut = document.getElementById("checkOut");
    let guests = document.getElementById("guests");
    let bill = document.getElementById("bill");

    if (!checkIn || !checkOut || !bill) {
        return;
    }

    if (!checkIn.value || !checkOut.value || !selectedPrice) {
        return;
    }

    let start = new Date(checkIn.value);
    let end = new Date(checkOut.value);

    let nights = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
        bill.innerText =
            "Check-out must be after check-in.";
        return;
    }

    let total = nights * selectedPrice;

    bill.innerText =
        nights + " nights × ₹" +
        selectedPrice + " = ₹" + total;
}


// Date changes

let checkIn = document.getElementById("checkIn");
let checkOut = document.getElementById("checkOut");

let today = new Date();
let todayString =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

if (checkIn) {
    checkIn.min = todayString;
}

if (checkOut) {
    checkOut.min = checkIn?.value || todayString;
}

if (checkIn && checkOut) {
    checkIn.addEventListener("change", function () {
        checkOut.min = checkIn.value || todayString;

        if (checkOut.value && checkOut.value <= checkIn.value) {
            checkOut.value = "";
        }

        calculateBill();
    });

    checkOut.addEventListener("change", calculateBill);
}

if (checkIn) {
    checkIn.addEventListener("change", calculateBill);
}

if (checkOut) {
    checkOut.addEventListener("change", calculateBill);
}


// ===============================
// LOGIN
// ===============================

let loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        let uname =
            loginForm.elements["uname"].value;

        let pwd =
            loginForm.elements["pwd"].value;

        try {

            let response = await fetch("/api/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    uname: uname,
                    pwd: pwd
                })

            });

            let data = await response.json();

            if (response.ok) {

                localStorage.setItem(
                    "username",
                    data.user.uname
                );

                localStorage.setItem(
                    "email",
                    data.user.email
                );

                alert("Login successful!");

                window.location.href = "index.html";

            }
            else {

                document.getElementById(
                    "loginResult"
                ).innerText = data.message;

            }

        }
        catch (error) {

            console.log(error);

            document.getElementById(
                "loginResult"
            ).innerText = "Login failed.";

        }

    });

}


// ===============================
// SIGNUP
// ===============================

let signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        let user = {

            fname: signupForm.elements["fname"].value,

            lname: signupForm.elements["lname"].value,

            uname: signupForm.elements["uname"].value,

            dob: signupForm.elements["dob"].value,

            pwd: signupForm.elements["pwd"].value,

            mobile: signupForm.elements["mobile"].value,

            postal: signupForm.elements["postal"].value,

            email: signupForm.elements["email"].value

        };

        try {

            let response = await fetch("/api/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });

            let data = await response.json();

            document.getElementById(
                "signupResult"
            ).innerText = data.message;

            if (response.ok) {

                signupForm.reset();

            }

        }
        catch (error) {

            console.log(error);

            document.getElementById(
                "signupResult"
            ).innerText = "Signup failed.";

        }

    });

}


// ===============================
// SHOW SIGNUP
// ===============================

function showSignup() {

    document.getElementById("loginBox")
        .style.display = "none";

    document.getElementById("signupBox")
        .style.display = "block";
}


// ===============================
// SHOW LOGIN
// ===============================

function showLogin() {

    document.getElementById("signupBox")
        .style.display = "none";

    document.getElementById("loginBox")
        .style.display = "block";
}


// ===============================
// LOAD PROFILE
// ===============================

async function loadProfile() {

    let username =
        localStorage.getItem("username");

    if (!username) {
        return;
    }

    try {

        let response =
            await fetch("/api/users/" + username);

        let user = await response.json();

        if (!response.ok) {
            return;
        }

        if (document.getElementById("profileName")) {
            document.getElementById("profileName").innerText =
                user.fname + " " + user.lname;
        }

        if (document.getElementById("profileUsername")) {
            document.getElementById("profileUsername").innerText =
                "@" + user.uname;
        }

        if (document.getElementById("profileEmail")) {
            document.getElementById("profileEmail").innerText =
                user.email;
        }

        if (document.getElementById("profileMobile")) {
            document.getElementById("profileMobile").innerText =
                user.mobile;
        }

        if (document.getElementById("profileDob")) {
            document.getElementById("profileDob").innerText =
                user.dob;
        }

        if (document.getElementById("profilePostal")) {
            document.getElementById("profilePostal").innerText =
                user.postal;
        }

        // Fill booking details automatically
        if (document.getElementById("bookingName")) {
            document.getElementById("bookingName").value =
                user.fname + " " + user.lname;
        }

        if (document.getElementById("bookingEmail")) {
            document.getElementById("bookingEmail").value =
                user.email;
        }

    }
    catch (error) {

        console.log("Profile error:", error);

    }
}

loadProfile();

// ===============================
// LOAD MY BOOKINGS
// ===============================

async function loadBookings() {

    let email = localStorage.getItem("email");

    let bookingList =
            document.getElementById("bookingList");

 if (!bookingList) {
    return;
 }

 if (!email) {
    bookingList.innerHTML =
        '<p>Please login to view your bookings.</p>';
    return;
 }

    try {

        let response = await fetch(
            "/api/bookings/" + email
        );

        let bookings = await response.json();

        if (bookings.length === 0) {

            bookingList.innerHTML =
                "<p>No bookings found.</p>";

            return;
        }

        bookingList.innerHTML = "";

        bookings.forEach(function(booking) {

            let card = document.createElement("div");

            card.className = "booking-card";

            card.innerHTML = `
                <h3>${booking.room}</h3>
                <p>Check-in: ${booking.checkIn}</p>
                <p>Check-out: ${booking.checkOut}</p>
                <p>Guests: ${booking.guests}</p>
                <p><b>Total: ₹${booking.price}</b></p>

                <button onclick="editBooking('${booking._id}')">
                    Edit Booking
                </button>

                <button onclick="deleteBooking('${booking._id}')">
                    Cancel Booking
                </button>
            `;

            bookingList.appendChild(card);

        });

    }
    catch (error) {

        console.log(error);

        bookingList.innerHTML =
            "<p>Failed to load bookings.</p>";

    }
}

loadBookings();

async function editBooking(id) {

    let checkOut = prompt(
        "Enter new check-out date (YYYY-MM-DD):"
    );

    if (!checkOut) {
        return;
    }

    let guests = prompt(
        "Enter number of guests:"
    );

    if (!guests) {
        return;
    }

    try {

        // Get current booking
        let response = await fetch(
            "/api/bookings"
        );

        let bookings = await response.json();

        let booking = bookings.find(
            b => b._id === id
        );

        if (!booking) {
            alert("Booking not found.");
            return;
        }

        let start = new Date(booking.checkIn);
        let end = new Date(checkOut);

        let nights = Math.ceil(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );

        if (nights <= 0) {
            alert("Invalid check-out date.");
            return;
        }

        // Room prices
        let roomPrices = {
            "Standard Room": 2000,
            "Suite": 3500,
            "Deluxe Room": 5000
        };

        let total =
            nights * roomPrices[booking.room];

        let update = {
            checkOut: checkOut,
            guests: Number(guests),
            price: total
        };

        let updateResponse = await fetch(
            "/api/bookings/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(update)
            }
        );

        let data = await updateResponse.json();

        if (updateResponse.ok) {

            alert("Booking updated successfully!");

            loadBookings();

        }
        else {

            alert(data.message);

        }

    }
    catch (error) {

        console.log(error);

        alert("Update failed.");

    }
}

// ===============================
// CANCEL BOOKING
// ===============================

async function deleteBooking(id) {

    let confirmDelete =
        confirm("Are you sure you want to cancel this booking?");

    if (!confirmDelete) {
        return;
    }

    try {

        let response = await fetch(
            "/api/bookings/" + id,
            {
                method: "DELETE"
            }
        );

        let data = await response.json();

        if (response.ok) {

            alert("Booking cancelled successfully!");

            loadBookings();

        }
        else {

            alert(data.message);

        }

    }
    catch (error) {

        console.log(error);

        alert("Failed to cancel booking.");

    }
}

// ===============================
// EDIT PROFILE
// ===============================

async function editProfile() {

    let username =
        localStorage.getItem("username");

    if (!username) {

        alert("Please login first.");

        return;
    }

    let mobile =
        prompt("Enter new mobile number:");

    if (!mobile) {
        return;
    }

    try {

        let response = await fetch(
            "/api/users/" + username,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mobile: mobile
                })
            }
        );

        let data = await response.json();

        if (response.ok) {

            alert("Profile updated successfully!");

            loadProfile();

        }
        else {

            alert(data.message);

        }

    }
    catch (error) {

        console.log(error);

        alert("Profile update failed.");

    }
}


// ===============================
// CREATE BOOKING
// ===============================

let bookingForm =
    document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            let username =
                localStorage.getItem("username");

            let email =
                localStorage.getItem("email");

            if (!username) {

                alert(
                    "Please login before booking."
                );

                window.location.href =
                    "signup.html";

                return;
            }

            if (!selectedRoom) {

                alert("Please select a room.");

                return;
            }

            let checkInValue =
                document.getElementById("checkIn").value;

            let checkOutValue =
                document.getElementById("checkOut").value;

            let guestsValue =
                document.getElementById("guests").value;

            let start =
                new Date(checkInValue);

            let end =
                new Date(checkOutValue);

            let nights = Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            );

            if (nights <= 0) {

                alert(
                    "Please select valid dates."
                );

                return;
            }

            let total =
                nights * selectedPrice;

            let booking = {

                name: username,

                email: email,

                room: selectedRoom,

                price: total,

                checkIn: checkInValue,

                checkOut: checkOutValue,

                guests: Number(guestsValue)

            };

            try {

                let response =
                    await fetch("/api/bookings", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(booking)

                    });

                let data =
                    await response.json();

                if (response.ok) {

                alert("Booking confirmed successfully!");

                 bookingForm.reset();

                 selectedRoom = "";
                 selectedPrice = 0;

                 document.getElementById("roomDetails").innerText =
                     "Select a room to continue.";

                 document.getElementById("bill").innerText =
                    "Total will appear here.";

                 loadBookings();

                 }
                else {

                    alert(data.message);

                }

            }
            catch (error) {

                console.log(error);

                alert("Booking failed.");

            }

        }
    );

}