import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  auth,
  onAuthStateChanged,
} from "./firebase.js";

const blogTitleField = document.querySelector(".title");
const articleField = document.querySelector(".article");
const bannerImage = document.querySelector("#banner-upload");
const banner = document.querySelector(".banner");
const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload");

let bannerPath;

// Define the months array
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

bannerImage.addEventListener("change", () => {
  uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener("change", () => {
  uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
  const [file] = uploadFile.files;
  if (file && file.type.includes("image")) {
    const formData = new FormData();
    formData.append("image", file);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.imagePath) {
          if (uploadType === "image") {
            addImage(data.imagePath, file.name);
          } else {
            bannerPath = `${location.origin}/${data.imagePath}`;
            banner.style.backgroundImage = `url("${bannerPath}")`;
          }
        } else {
          console.error("No imagePath in response data");
        }
      })
      .catch((error) => console.error("Error uploading image:", error));
  } else {
    alert("Please upload an image file only.");
  }
};

const addImage = (imagePath, alt) => {
  const curPos = articleField.selectionStart;
  const textToInsert = `![${alt}](${imagePath})`;
  articleField.value = `${articleField.value.slice(
    0,
    curPos
  )}\n${textToInsert}\n${articleField.value.slice(curPos)}`;
};

const publishBlog = () => {
  if (articleField.value.trim() && blogTitleField.value.trim()) {
    const blogId =
      location.pathname.split("/").pop() === "editor"
        ? generateBlogId()
        : decodeURI(location.pathname.split("/").pop());

    const date = new Date();
    const blogRef = doc(collection(db, "blogs"), blogId);

    setDoc(blogRef, {
      title: blogTitleField.value,
      article: articleField.value,
      bannerImage: bannerPath,
      publishedAt: `${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`,
      author: auth.currentUser.email.split("@")[0],
    })
      .then(() => {
        location.href = `/${blogId}`;
      })
      .catch((err) => console.error("Error publishing blog:", err));
  } else {
    alert("Please fill in all required fields.");
  }
};

const generateBlogId = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const blogTitle = blogTitleField.value.split(" ").join("-");
  let id = "";
  for (let i = 0; i < 4; i++) {
    id += letters[Math.floor(Math.random() * letters.length)];
  }
  return `${blogTitle}-${id}`;
};

publishBtn.addEventListener("click", publishBlog);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.replace("/admin");
  }
});

const blogID = location.pathname.split("/").filter(Boolean);
if (blogID[0] !== "editor") {
  const docRef = doc(db, "blogs", decodeURI(blogID[0]));
  getDoc(docRef).then((doc) => {
    if (doc.exists()) {
      const data = doc.data();
      bannerPath = data.bannerImage;
      banner.style.backgroundImage = `url(${bannerPath})`;
      blogTitleField.value = data.title;
      articleField.value = data.article;
    } else {
      location.replace("/");
    }
  });
}
