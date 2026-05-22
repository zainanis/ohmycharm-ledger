const express = require("express");
const connectDB = require("./config/db");
const router = require("./routes/index");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport"); // new file

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectDB();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// SESSION middleware for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(FRONTEND_URL);
  }
);

// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

// Protect your ledger routes
// app.use("/api/ledger", ensureAuthenticated, router); // <- wrap ledger route
// Keep other routes open for now
app.use("/api", ensureAuthenticated, router);

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
