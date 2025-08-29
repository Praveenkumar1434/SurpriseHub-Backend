// server.js
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // allow frontend to talk to backend
app.use(express.json());

// load users from file
function loadUsers() {
  return JSON.parse(fs.readFileSync("users.json", "utf8"));
}

// save users to file
function saveUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// signup (create new user)
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({ username, password });
  saveUsers(users);

  res.json({ success: true, message: "Signup successful" });
});

// login (check existing user)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
