// Require packages and define constants
const express = require("express");
// const session = require("express-session");
var cors = require("cors");
const cookieSession = require("cookie-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
require("dotenv").config();

const app = express();
const port = 8080;

app.use(
  cookieSession({
    name: "session",
    keys: ["mern-google-auth"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define user schema
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  displayName: String,
  picture: String,
});

// Define user model
const User = mongoose.model("User", userSchema);

// Configure passport with Google OAuth credentials
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      // callbackURL: process.env.REDIRECT_URI,
      // passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user already exists in database
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      // Create new user record in database
      const user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        picture: profile.photos[0].value,
      });
      await user.save();
      done(null, user);
    }
  )
);

// Serialize and deserialize user sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Set up middleware
// app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// // Define login route
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Define callback route
// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   }
// );

// // Define protected route
// app.get("/dashboard", ensureAuthenticated, (req, res) => {
//   res.send(`
//     Welcome to the dashboard!
//     <br>
//     <a href="/logout">Logout</a>
//   `);
// });

// // Define authentication middleware
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

app.use("/auth", authRoute);

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// const express = require("express");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const mongoose = require("mongoose");
// const cookieSession = require("cookie-session");
// require("dotenv").config();
// // const keys = require("./config/keys");

// const app = express();
// const port = 8080;

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: ["mern-google-auth"],
//   })
// );

// // Define user schema
// const userSchema = new mongoose.Schema({
//   googleId: String,
//   email: String,
//   displayName: String,
//   picture: String,
// });

// // Define user model
// const User = mongoose.model("User", userSchema);

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//       scope: ["profile", "email"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       User.findOne({ googleId: profile.id }).then((existingUser) => {
//         if (existingUser) {
//           done(null, existingUser);
//         } else {
//           new User({
//             googleId: profile.id,
//             email: profile.emails[0].value,
//             displayName: profile.displayName,
//             picture: profile.photos[0].value,
//           })
//             .save()
//             .then((user) => done(null, user));
//         }
//       });
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then((user) => {
//     done(null, user);
//   });
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google"),
//   (req, res) => {
//     console.log(req.user);
//     res.redirect("/dashboard");
//   }
// );

// // app.get("/dashboard", (req, res) => {
// //   if (req.user) {
// //     console.log(req.user);
// //   } else {
// //     res.send("No User found");
// //   }
// // });

// app.get("/api/current_user", (req, res) => {
//   console.log(req.user);
//   res.send(req.user);
// });

// app.get("/api/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
