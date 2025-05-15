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

      // Get form values
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();

      let gender = "";
      const get_gender = document.getElementById("gender").value;
      const other_gender = document.getElementById("other-gender").value;
      if (get_gender === "Other" && other_gender.trim() !== "") {
        gender = other_gender.trim();
        // console.log("Gender OK",gender);
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

      console.log("Form Data:", {
        municipality,
        province});


      // Validate the form
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "catanduanes_logbook_entries"), {
          name,
          phone,
          email,
          gender,
          province, 
          municipality,
          sector,
          purpose,
          timestamp: new Date()
        });
        form.reset();
        form.classList.remove("was-validated");
        location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to submit the form. Please try again.");
      }
    });
  }

  if (window.location.pathname.includes("report.html")) {
    fetchDataIfLoggedIn();
  }
});