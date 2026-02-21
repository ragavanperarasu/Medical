const express = require("express");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/", require("./routes/getHome"));

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});