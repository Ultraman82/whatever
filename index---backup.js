\\if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");

const pool = require("./sel-rec");

app.use(express.static("public"));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
var gross = handlebars.create({});

const router = express.Router();



const initializePassport = require("./passport-config");
const { urlencoded } = require("body-parser");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app.engine(
  "handlebars",
  handlebars({
    defaultLayout: false,
    layoutsDir: "views/layouts",
    helpers: require("./config/handlebars-helpers"),
  })
);
app.set("view engine", "handlebars");

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const missonControl = require("../whatever/controllers.js");
//const { Router } = require("express");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  checkNotAuthenticated, //what it do tho. Nothing. Nothing.o
  passport.authenticate("local", {
    successRedirect: "/city",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.put("");
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const client = await pool.connect();
    var record = [];
    record.push(req.body.username);
    record.push(req.body.koreanName);
    record.push(req.body.englishName);
    record.push(999);
    record.push(req.body.petname);
    res = await client.query(
      "INSERT INTO student (username, password, korname, engname, petid, petname) VALUES ($1, $2, $3, $4, $5, $6)",
      [record[0], hashedPassword, record[1], record[2], record[3], record[4]]
    );
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
  }
});
app.get("/city", checkAuthenticated, async (req, res) => {
  try {
    let wallet = req.session.passport.user.rows[0].wallet;
    let user = req.session.passport.user.rows[0].username;
    if (wallet === null) {
      wallet = 0;
    }
    res.render("city", {
      username: user,
      wallet: wallet,
    });
  } catch (err) {
    res.send(err);
  }
});
app.get("/bank", checkAuthenticated, async (req, res) => {
  studentname = req.session.passport.user.rows[0].username;

  const query = {
    text: "SELECT wallet FROM student WHERE username = $1",
    values: [req.session.passport.user.rows[0].username],
  };
  try {
    var buckaroos = 0;
    await pool.query(query, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        buckaroos = res.rows[0].wallet;
      }
    });
    console.log(buckaroos);
    res.render("bank", { wallet: buckaroos });

    //);
  } catch (err) {
    console.log(err);
    res.send("hi");
  }
});
app.get("/addvocab", async (req, res) => {
  try {
    var wordlist = await pool.query(
      "SELECT english, korean, pos, level FROM vocabulary"
    );
    wordlist = wordlist.rows;
    await res.render("vocabulator", { wordlist });

  } catch (err) {
    console.log("SOMETHING WENT WROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONG");
    console.log(err);
    res.render("vocabulator", { err });
  }
});
// router.get("/addvocab", missonControl);
app.get("/vocab", async (req, res) => {
  try {
    var wordList = await pool.query("SELECT * FROM vocabulary ORDER BY word_id DESC LIMIT 5");
    wordList = wordList.rows;
    var processedWords = processMultipleChoice(wordList, 5);
    console.log(processedWords);
    res.render('vocabgame', { 'arr' : processedWords[0].backs });
    
  } catch (err) {
    console.log(err);
  }
});
app.post("/addvocab", async (req, res) => {
  try {
    var entry = [];
    entry.push(req.body.english);
    entry.push(req.body.korean);
    entry.push(req.body.level);
    entry.push(req.body.pos);
    var duplicate = await pool.query(
      "SELECT english, korean FROM vocabulary WHERE korean = $1",
      [entry[1]]
    );
    if (duplicate.rows.length > 0) {
      console.log("found KOR");
      console.log(duplicate.rows[0].english.length);
      console.log(entry[0].length);
      console.log(duplicate.rows[0].english === entry[0]);
      if (duplicate.rows[0].english === entry[0]) {
        //WHYYYYYYYYYYYYYY IS THIS FALSEEEEEEEEEEEEEE
        console.log("AND ENG");
        res.render("vocabulator", {
          message: "Word already exists in database.",
        });
      }
    }
    var b = await pool.query(
      "INSERT INTO vocabulary (english, korean, level, pos) VALUES ($1, $2, $3, $4)",
      [entry[0], entry[1], entry[2], entry[3]]
    );
    res.render('vocabulator');
  } catch (err) {
    console.log(err);

    res.send("the word could not be added");
  }
});
app.get("/users", (req, res) => {
  pool.query("SELECT USERNAME FROM student", (err, result) => {
    res.send(result);
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log(result.rows[0].name); // brianc
  });
});
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
// function randomizer(array, wordListLength) {
//   let nums = [];
//   for (i = 1; i < wordListLength; i++) {
//     if (nums.length + 1 == wordListLength) {
//       return nums;
//     }
//     console.log('i is: ' + i);
//     console.log('array is: ' + array.length);
//     let n = Math.floor(Math.random() * wordListLength);
//     console.log('n is: ' + n);
//     if (nums.includes(array[n].english)) {
//       randomizer(array, wordListLength);
//     }
//     else {
//       nums.push(array[n].english);
//     }
//     console.log('nums is: ' + nums);
//   } 
//   console.log('this in nums: ' + nums);

//   return nums;
// }

function randomizer(array, x) {
  let nums = [];
  while (nums.length < x) {
    let n = Math.floor(Math.random() * x);
    if (nums.includes(n)) {

    } else {
      nums.push(n);
    }
  }
  var a = nums.map(x => array[x].korean);
  console.log(a);
  return a;
}
function processMultipleChoice(wordList, numberOfOptions) {
  var processed = [];
   wordList.forEach(element => {
     var wordObj = {};
     wordObj.front = element.english;
     wordObj.id = element.word_id;
     var nums = randomizer(wordList, numberOfOptions);
     var random = Math.floor(Math.random() * nums.length);
     nums.splice(random, 0, nums);
     wordObj.backs = nums;
     processed.push(wordObj);
  })
  return processed;
//   //return wordlist.rows;
}
// function processMultipleChoice(array, x) {
//   let nums = [];

// }


app.listen(3000);
