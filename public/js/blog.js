import {
  db,
  doc,
  getDoc,
  auth,
  collection,
  addDoc,
  onSnapshot,
} from "./firebase.js";

const blogId = decodeURI(location.pathname.split("/").pop());
const docRef = doc(db, "blogs", blogId);

getDoc(docRef).then((docSnapshot) => {
  if (docSnapshot.exists()) {
    setupBlog(docSnapshot.data());
  } else {
    location.replace("/");
  }
});

const setupBlog = (data) => {
  const banner = document.querySelector(".banner");
  const blogTitle = document.querySelector(".title");
  const titleTag = document.querySelector("title");
  const publish = document.querySelector(".published");
  const article = document.querySelector(".article");

  banner.style.backgroundImage = `url(${data.bannerImage})`;

  titleTag.innerHTML += blogTitle.innerHTML = data.title;
  publish.innerHTML += `${data.publishedAt} -- ${data.author}`;

  if (
    auth.currentUser &&
    data.author === auth.currentUser.email.split("@")[0]
  ) {
    const editBtn = document.getElementById("edit-blog-btn");
    if (editBtn) {
      editBtn.style.display = "inline";
      editBtn.href = `${blogId}/editor`;
    }
  }

  addArticle(article, data.article);
  loadComments(); // Load comments after setting up the blog
};

const addArticle = (ele, data) => {
  data = data.split("\n").filter((item) => item.length);

  data.forEach((item) => {
    if (item[0] === "#") {
      let hCount = 0;
      let i = 0;
      while (item[i] === "#") {
        hCount++;
        i++;
      }
      let tag = `h${hCount}`;
      ele.innerHTML += `<${tag}>${item.slice(hCount).trim()}</${tag}>`;
    } else if (item.startsWith("![")) {
      const altEnd = item.indexOf("]");
      const srcStart = item.indexOf("(", altEnd) + 1;
      const srcEnd = item.indexOf(")", srcStart);
      const alt = item.slice(2, altEnd);
      const src = item.slice(srcStart, srcEnd);
      ele.innerHTML += `<img src="${src}" alt="${alt}" class="article-image">`;
    } else {
      ele.innerHTML += `<p>${item}</p>`;
    }
  });
};

// Handle comment submission
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");
const commentsContainer = document.querySelector(".comments-container");

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const commentText = commentInput.value.trim();

  if (commentText && auth.currentUser) {
    await addDoc(collection(db, "blogs", blogId, "comments"), {
      text: commentText,
      author: auth.currentUser.email.split("@")[0],
      createdAt: new Date(),
    });

    commentInput.value = "";
  } else {
    alert("You must be logged in to post a comment.");
  }
});

// Load comments from Firestore
const loadComments = () => {
  onSnapshot(collection(db, "blogs", blogId, "comments"), (snapshot) => {
    commentsContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const comment = doc.data();
      commentsContainer.innerHTML += `
        <div class="comment">
          <p class="comment-author">${comment.author}</p>
          <p class="comment-text">${comment.text}</p>
        </div>
      `;
    });
  });
};
