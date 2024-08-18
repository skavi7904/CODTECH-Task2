import {
  onAuthStateChanged,
  auth,
  signOut,
  signInWithPopup,
  provider,
  db,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "./firebase.js";

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const blogSection = document.querySelector(".blogs-section");

signOutButton.style.display = "none";
message.style.display = "none";

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      console.error("Sign In Error:", error.message);
    });
};

const userSignOut = async () => {
  signOut(auth)
    .then(() => {
      alert("You have signed out successfully!");
    })
    .catch((error) => {
      console.error("Sign Out Error:", error.message);
    });
};

const deleteBlog = async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
    location.reload(); // Reload page after successful delete
  } catch (error) {
    console.error("Error deleting blog:", error.message);
  }
};

// Attach deleteBlog to the window object
window.deleteBlog = deleteBlog;

onAuthStateChanged(auth, (user) => {
  if (user) {
    signInButton.style.display = "none";
    message.style.display = "block";

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    if (userName) {
      userName.textContent = user.displayName || "No Name";
    }
    if (userEmail) {
      userEmail.textContent = user.email || "No Email";
    }

    getUserWrittenBlogs();
  } else {
    signInButton.style.display = "block";
    signOutButton.style.display = "none";
    message.style.display = "none";
    blogSection.innerHTML = ""; // Clear previous blogs if any
  }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

const getUserWrittenBlogs = async () => {
  if (auth.currentUser) {
    try {
      const userEmail = auth.currentUser.email.split("@")[0];
      const blogsCollection = collection(db, "blogs");
      const q = query(blogsCollection, where("author", "==", userEmail));
      const querySnapshot = await getDocs(q);

      blogSection.innerHTML = ""; // Clear existing blogs
      querySnapshot.forEach((doc) => {
        createBlog(doc);
      });
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  } else {
    console.log("No authenticated user");
  }
};

const createBlog = (blog) => {
  let data = blog.data();
  blogSection.innerHTML += `
    <div class="blog-card">
      <img class="blog-image" src="${data.bannerImage}" alt="">
      <h1 class="blog-title">${data.title.substring(0, 100) + "..."}</h1>
      <p class="blog-overview">${data.article.substring(0, 200) + "..."}</p>
      <a href="/${blog.id}" class="btn dark">Read</a>
      <a href="/${blog.id}/editor" class="btn grey">Edit</a>
      <a href="#" onclick="deleteBlog('${
        blog.id
      }'); return false;" class="btn danger">Delete</a>
    </div>
  `;
};
