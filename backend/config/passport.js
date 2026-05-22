const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const ALLOWED_EMAILS = ["zainanis28862@gmail.com", "sukainaali75@gmail.com"];

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!ALLOWED_EMAILS.includes(email)) {
        return done(null, false, { message: "Access denied" });
      }
      return done(null, profile);
    }
  )
);

module.exports = passport;
