import { auth, logoutUser ,onAuthStateChanged} from "./firebase.js";

let ul = document.querySelector(".links-container");

onAuthStateChanged(auth, (user) => {
  if (user) {
    ul.innerHTML += `
            <li class="link-item"><a href="/admin" class="link">Dashboard</a></li>
            <li class="link-item"><a href="#" id="logoutLink" class="link">Logout</a></li>
        `;

    // Attach event listener to logout link
    document.getElementById("logoutLink").addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      logoutUser();
    });
  } else {
    ul.innerHTML += `
            <li class="link-item"><a href="/admin" class="link">Login</a></li>
        `;
  }
});
