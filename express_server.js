

var express = require('express')
var app = express()
var PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var cookieSession = require('cookie-session')
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

app.use(cookieSession({
  name: 'session',
  keys: ['lighthouse'],
}))

var urlDatabase = {
  "b2xVn2": {
    id: "userRandomID",
    longURL: "http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    id: "userRandomID2",
    longURL: "http://www.google.com"
  }
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
};


// root handlers/endpoints
app.get("/urls", (req, res) => {
  console.log(urlsForUser(req.session.user_id))
  let templateVars = {urls: urlsForUser(req.session.user_id),
                      userID: users[req.session.user_id]};
  console.log(users, "USERS")
  if (!req.session.user_id) {
    res.render("urls_home", templateVars);
  } else {
  res.render("urls_index", templateVars);
  }

})

app.get("/urls/new", (req, res) => {
  let templateVars = {userID: users[req.session.user_id]}
  if (!req.session.user_id) {
    res.render("urls_home", templateVars);
  } else {
  res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id,
                       longurl: urlDatabase[req.params.id]['longURL'],
                       userID: users[req.session.user_id]};
  if (!req.session.user_id) {
    res.render("urls_home", templateVars);
  } else {
  res.render("urls_show", templateVars);
  }
});

app.post("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id,
                       longurl: urlDatabase[req.params.id]['longURL'],
                       userID: users[req.session.user_id]};
    if (!req.session.user_id) {
    res.render("urls_home", templateVars);
  } else {
  res.render("urls_show", templateVars);
  }
});

app.post("/urls", (req, res) => {
  randomNumber = generateRandomString()
  urlDatabase[randomNumber] = {
                               id: req.session.user_id,
                               longURL: req.body.longURL}
  res.redirect(`http://localhost:8080/urls/${randomNumber}`);
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id]['longURL'] = req.body.editURL
  res.redirect(`http://localhost:8080/urls/`)
});
//redirects website
app.get("/u/:shortURL", (req, res) => {
  var tinyURL = req.params.shortURL
  var longURL = urlDatabase[tinyURL]['longURL']
  res.redirect(longURL);
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


//home page
app.get("/", (req, res) => {
  res.render("urls_home")
});

app.post("/logout", (req, res) => {
  req.session = null;
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
// cookie inputs
app.post("/login", (req, res) => {
  let username = req.body.email
  let password = req.body.password
  for(var key in users) {
    if(username === users[key].email) {
      if(bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword)) {
        req.session.user_id = users[key].id;

         return res.redirect("/urls")
      } else {
      return res.status(400).send('Wrong Password') }
    }
  }
  return res.status(400).send('User does not exist')
});

//adds new user into user object
app.post("/register", (req, res) => {
  randomNumber = generateRandomString()
  const bcrypt = require('bcrypt')
  let username = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10)
  let auth = false;

  if(!username||!password) {
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
    password: hashedPassword
  }

      req.session.user_id = randomNumber
      res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 6; i++)
  text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

function urlsForUser(id){
 let sortedURLDatabase = {}
 for (let key in urlDatabase) {
  if (urlDatabase[key].id === id){
    sortedURLDatabase[key] = urlDatabase[key]
    }
  }
 return sortedURLDatabase
 console.log(sortedURLDatabase)
}

