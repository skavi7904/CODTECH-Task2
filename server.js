const express = require("express");
const path = require("path");
const fileupload = require("express-fileupload");

const app = express();
const initial_path = path.join(__dirname, "public");

// Middleware
app.use(express.static(initial_path));
app.use(fileupload());

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(initial_path, "home.html"));
});

app.get("/editor", (req, res) => {
  res.sendFile(path.join(initial_path, "editor.html"));
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.image;
  const date = new Date();
  const imagename = `${date.getDate()}_${date.getTime()}_${file.name}`;
  const uploadPath = path.join(__dirname, "public", "uploads", imagename);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload image" });
    }

    res.json({ imagePath: `uploads/${imagename}` });
  });
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(initial_path, "dashboard.html"));
});

app.get("/:blog", (req, res) => {
  res.sendFile(path.join(initial_path, "blog.html"));
});

app.get("/:blog/editor", (req, res) => {
  res.sendFile(path.join(initial_path, "editor.html"));
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
