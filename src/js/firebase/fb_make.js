import { db } from "../firebase/fb_setup.js"; // Adjust the path as necessary
import { collection, addDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Function to retrieve data from Firestore if the user is logged in
const fetchDataIfLoggedIn = async () => {
  onAuthStateChanged(auth, async (user) => {
    const tableBody = document.querySelector("#report-table tbody");
    if (user) {
      try {
        const q = query(collection(db, "catanduanes_logbook_entries"));
        const querySnapshot = await getDocs(q);
        tableBody.innerHTML = ""; // Clear existing rows

        // Collect data and sort by timestamp (ascending)
        const sortedData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

        sortedData.forEach((data) => {
          const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : "N/A";
          const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString() : "N/A";
          const row = `<tr>
            <td>${data.name}</td>
            <td>${data.phone}</td>
            <td>${data.email}</td>
            <td>${data.age_group || "N/A"}</td>
            <td>${data.gender}</td>
            <td>${data.province || "N/A"}</td> <!-- Added province -->
            <td>${data.municipality}</td>
            <td>${data.sector}</td>
            <td>${data.purpose}</td>
            <td>${date}</td>
            <td>${time}</td>
          </tr>`;
          tableBody.innerHTML += row;
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
        alert("Failed to fetch data. Please try again.");
      }
    } else {
      tableBody.innerHTML = "<tr><td colspan='10' class='text-center'>You must be logged in to view the data.</td></tr>";
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  
  const googleLoginButton = document.getElementById("google-login");
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert(`Welcome ${user.displayName}! You are now logged in.`);
        // Optionally, redirect the user or perform additional actions
        window.open('report.html', '_blank');
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        alert("Failed to log in with Google. Please try again.");
      }
    });
  }

  const login = document.getElementById("loginAdmin");
   if (login) {
    login.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("name").value; // Assuming 'name' is the password field

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert(`Welcome ${user.email}! You are now logged in.`);
        // Optionally, redirect the user or perform additional actions
        window.open('report.html', '_blank');
      } catch (error) {
        console.error("Error during Email/Password Sign-In:", error);
        alert("Failed to log in. Please check your email and password.");
      }
    });
  }

  const form = document.getElementById("appform");
  if (form) {

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Show loading screen
      const loadingScreen = document.createElement("div");
      loadingScreen.id = "loading-screen";
      loadingScreen.style.position = "fixed";
      loadingScreen.style.top = "0";
      loadingScreen.style.left = "0";
      loadingScreen.style.width = "100vw";
      loadingScreen.style.height = "100vh";
      loadingScreen.style.background = "rgba(0,0,0,0.5)";
      loadingScreen.style.display = "flex";
      loadingScreen.style.justifyContent = "center";
      loadingScreen.style.alignItems = "center";
      loadingScreen.style.zIndex = "9999";
      loadingScreen.innerHTML = `<iframe src="https://lottie.host/embed/6a3a25e7-b858-487b-b1f5-b2f73f520958/IIGEBf4W18.lottie" style="width:150px;height:150px;border:none;background:#fff;border-radius:10px;"></iframe>`;
      document.body.appendChild(loadingScreen);

      // Disable submit button
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Get form values
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      let gender = "";
      const get_gender = document.getElementById("gender").value;
      const other_gender = document.getElementById("other-gender").value;
      if (get_gender === "Other" && other_gender.trim() !== "") {
      gender = other_gender.trim();
      } else {
      gender = get_gender;
      }

      let municipality = "";
      const get_municipality = document.getElementById("municipality").value;
      const other_municipality = document.getElementById("other-municipality").value;

      let province = "";
      const get_province = document.getElementById("province").value;
      const other_province = document.getElementById("other-province").value;

      if (get_province !== 'Catanduanes' ) {
      municipality = other_municipality.trim();
      if (get_province === "Others" && other_province.trim() !== "") {
        province = other_province.trim();
      }else {
        province = get_province;
      }
      }else {
      municipality = get_municipality;
      province = get_province;
      }

      let sector = "";
      const get_sector = document.getElementById("sector").value;
      const other_sector = document.getElementById("other-sector").value;
      if (get_sector === "OTHERS" && other_sector.trim() !== "") {
      sector = other_sector.trim();
      } else {
      sector = get_sector;
      }

      const purpose = document.getElementById("purpose").value.trim();
      const age_group = document.getElementById("age").value;

      // Prevent duplicate entries (same name, purpose, same day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      try {
      // Query for existing entry
      const q = query(
        collection(db, "logbook_entries")
      );
      const querySnapshot = await getDocs(q);
      let duplicateFound = false;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
        data.name === name &&
        data.purpose === purpose &&
        data.timestamp &&
        new Date(data.timestamp.seconds * 1000) >= today &&
        new Date(data.timestamp.seconds * 1000) < tomorrow
        ) {
        duplicateFound = true;
        }
      });
      if (duplicateFound) {
        document.getElementById("purpose").focus();
        document.getElementById("purpose").style.borderColor = "red";
        alert("Please change the purpose to submit a new entry.");
        return;
      }

      // Validate the form
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, "catanduanes_logbook_entries"), {
        name,
        phone,
        email,
        age_group,
        gender,
        province, 
        municipality,
        sector,
        purpose,
        timestamp: new Date()
      });

      form.classList.remove("was-validated");
      alert("Form submitted successfully! Thank you");
      form.reset();
      location.reload(); // Refresh the page
      } catch (error) {
      console.error("Error adding document: ", error);
      // alert("Failed to submit the form. Please try again.");
      } finally {
      // Hide loading screen and enable submit button
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (loadingScreen) loadingScreen.remove();
      if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  if (window.location.pathname.includes("report.html")) {
    fetchDataIfLoggedIn();
  }
});