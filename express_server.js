

var express = require("express")
var app = express()
var PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
//sets app up with view engine and ejs
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


// root handlers/endpoints
app.get("/urls", (req, res) => {

  let templateVars = {urls: urlDatabase, userID: users[req.cookies.user_id]};

  res.render("urls_index", templateVars);
  })

app.get("/urls/new", (req, res) => {
  let templateVars = {userID: users[req.cookies.user_id]}
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id, longurl: urlDatabase[req.params.id], userID: users[req.cookies.user_id]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id, longurl: urlDatabase[req.params.id], userID: users[req.cookies.user_id]};
  res.render("urls_show", templateVars);
});
//above :id value in the quotations allows us to input the id in the
//browser and pull up the corrisponding website to that shortened url.
//NOTE: shorturl and urls are variables that can be referenced in the urls_shows ejs file.
app.post("/urls", (req, res) => {
  randomNumber = generateRandomString()
  urlDatabase[randomNumber] = req.body.longURL
  res.redirect(`http://localhost:8080/urls/${randomNumber}`);
});
//above uses values longURL from the urls_new EJS file.
//calls RandomNumber function and then creates "Random Number" key inside
//Daatbase. Then assigns req.body.longURL to that key value.
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.editURL
  res.redirect(`http://localhost:8080/urls/`)
});
//redirects website
app.get("/u/:shortURL", (req, res) => {
  var tinyURL = req.params.shortURL
  var longURL = urlDatabase[tinyURL]
  res.redirect(`${longURL}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//Delete

app.post("/urls/:id/delete", (req, res) => {
  let tinyURL = req.params.id
  delete urlDatabase[tinyURL];
  res.redirect("/urls");
});
// cookie inputs
app.post("/login", (req, res) => {

  let username = req.body.email
  let password = req.body.password
  console.log(username, password, "USERNAME AND PASSWORD / POST LOGIN")
  for(var key in users) {
    if(username === users[key].email) {
      if(password === users[key].password) {
         res.cookie('user_id', users[key].id)
        return res.redirect("/urls")
      } else {
      return res.status(400).send('Wrong Password') }
    }
  }
  return res.status(400).send('User does not exist')
});
//home page
app.get("/", (req, res) => {
  res.render("urls_home")
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});
//registration page
app.get("/register", (req, res) => {
  res.render("urls_register")
})
//login page
app.get("/login", (req, res) => {
  res.render("urls_login")
})


//adds new user into user object
app.post("/register", (req, res) => {
  randomNumber = generateRandomString()

  let username = req.body.email;
  let password = req.body.password;
  let auth = false;

  if(!username||!password) {
    console.log('step 1')
    let errorMessage = !password ? 'Please enter password.' : 'Please enter email.'
    return res.status(400).send(errorMessage)
  }

  for (var key in users) {
    if (users[key].email === username) {
    return res.status(400).send("Email already in use")
    }
  }

  users[randomNumber] = {
    id: randomNumber,
    email: username,
    password: password
  }
  // } else {
  //   for(var key in users) {
  //     if (users[key].email === username || users[key].password === password) {


      //   let errorMessage = users[key].email === username ? 'Email is already being used' : 'Password is already being used';
      //   res.status(400).send(errorMessage);
      //   break;
      // } else {
      //   auth = true;
    //   }
    // }
  // if(auth){
      res.cookie('user_id', randomNumber)
      res.redirect("/urls")

    // }
  // }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 6; i++)
  text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

