import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db.js";

//import passport config
import "./config/passport.js";

//import routes
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

//initialize express
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

//connect to database
connectDB();

app.use(express.json()); // parsing json
app.use(express.urlencoded({ extended: true })); // parsing application/x-www-form-urlencoded

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 12 }, // FIXME: change to true when the HTTPS is enabled (time set to 12 hours)
  })
);

// Initialize Passport and session for authentication
// SUGGESTION: Switch to JWT to keep the server stateless and scale better in the future (for REST purposes)
app.use(passport.initialize());
app.use(passport.session());

//use routers
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/applications", applicationRoutes);
app.use("/questions", questionRoutes);

// /adminpanel route will redirect to discord oauth (if user doesn't have a session) with req.query.type=adminpanel
app.get("/adminpanel", (req, res) => {
  const appType = req.query.type;
  console.log("appType: ", appType);
  console.log("req.user: ", req.user);
  if (appType) {
    req.session.passport.appType = appType;
  }
  if (req.user) {
    console.log("req.user", req.user);
    res.redirect(`${process.env.FRONTEND_URL}/adminpanel`);
  } else {
    res.redirect("/auth/discord");
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
