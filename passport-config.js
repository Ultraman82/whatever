const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { serializeUser } = require("passport");

const passport = require("passport");
const pool = require("./sel-rec");

//var passport = require("passport"),
//const  LocalStrategy = require("passport-local").Strategy;

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = await pool.query(
      "SELECT username, password, wallet FROM student WHERE username = ?",
      [username]
    );

    try {
      // console.log(username);
      // console.log(password)
      // let password = user[0].password.toString();
      //console.log(user.rows[0].username != username);
      if (!username) {
        console.log("username nooooo");
        return done(null, false, { message: "No user with that username" });
      }

      if (await bcrypt.compare(password, user[0].password.toString())) {
       
        return done(null, user);
      } else {
        console.log("username yes, password no");

        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
}

module.exports = initialize;
