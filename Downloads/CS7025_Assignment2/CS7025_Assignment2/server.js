//modules
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const fileUpload = require("express-fileupload");
const sharp = require("sharp");
const fs = require("fs/promises");
const ejs = require("ejs");
const path = require("path");
const app = express();
const port = 8080;
const dotenv = require("dotenv");
dotenv.config();


//                                                   ~DATABASE & SESSION SETUP & CONNECTION~

//setting up the databases
const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

//mysql & session connections using mysql modules
const sessionStore = new MySQLStore(db_config);
const db = mysql.createConnection(db_config);

//establishing a connection with the db
db.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + db.threadId);
});

//middleware for setting up session
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

//middleware for parsing incoming requests for the form data from the login & register forms
app.use(express.urlencoded({ extended: false }));

//checking if user is logged in or not for ejs templates
app.use((req, res, next) => {
  if (req.session.user_id) {
    res.locals.user_id = req.session.user_id;
  }
  next();
});

//                               ~PATHS FOR FINDING EJS FILES & GETTING IMAGES & FINDING CSS~

//for viewing the ejs templates as html & ensuring they are found in the views folder
app.set("views", "views/");
app.set("view engine", "ejs");

//accessing images needed for logos & error gifs
app.use("/uploads", express.static("assets/uploads"));
app.use("/assets", express.static("assets/uploads/edited"));
app.use(express.static(path.join(__dirname, "public")));

//                                              ~PHOTO RETRIEVAL FOR MAIN GALLERY~

//getting the images from database, gets all info from images table for ejs template
//[rows] gets a row from the images table which is a single image & orders them in chronological order
//each image that has been uploaded is retrieved by [rows]
//images is getting all the info from the table to give to the photos.ejs file to display
app.get("/photos", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM images ORDER BY upload_time ASC");
    const images = rows.map((row) => ({
      id: row.id,
      filename: row.filename,
      uploader: row.uploader,
      url: `/uploads/edited/${row.filename}`,
      upload_time: new Date(row.upload_time).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
    res.render("photos", { images });
  } catch (error) {
    res.render("error", { message: "Failed to retrieve images." });
  }
});

//                                              ~PHOTO RETRIEVAL FOR USER GALLERY~

//shows all images the logged in user has uploaded in a personal gallery
//similar to /photos code, just singles out the current logged in user
app.get("/userImages", async (req, res) => {
  try {
    const userId = req.session.username;

    //selects only the images uploaded by the current logged in user using session username & comparing it to the uploader column in the images table
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM images WHERE uploader = ? ORDER BY upload_time ASC",
        [userId]
      );
    const images = rows.map((row) => ({
      id: row.id,
      filename: row.filename,
      uploader: row.uploader,
      url: `/uploads/edited/${row.filename}`,
      upload_time: new Date(row.upload_time).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
    res.render("userImages", { images });
  } catch (error) {
    res.render("error", { message: "Failed to retrieve images." });
  }
});

//                                           ~PHOTO RETRIEVAL FOR OTHER USERS PERSONAL GALLERIES~

//shows all images the chosen user has uploaded in a personal gallery
//similar to /photos code, just singles out the specified user
app.get("/otherUsersImages", async (req, res) => {
  try {
    const uploader = req.query.username;

    //selects only the images uploaded by the specified user by using the uploader of the image
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM images WHERE uploader = ? ORDER BY upload_time ASC",
        [uploader]
      );
    const images = rows.map((row) => ({
      id: row.id,
      filename: row.filename,
      uploader: row.uploader,
      url: `/uploads/edited/${row.filename}`,
      upload_time: new Date(row.upload_time).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
    res.render("otherUsersImages", { images });
  } catch (error) {
    res.render("error", { message: "Failed to retrieve images." });
  }
});

//                                         ~SINGLE PHOTO RETRIEVAL WITH LIKES & COMMENTS~

//for viewing the individual photos, it queries the image table for the picture with that id
//also queries for the amount of likes & comments on a specified photo
//likes are automatically set to 0 when image is uploaded as to not crash site with undefined
//the necessary rows are taken from the comments table including a shortened timestamp row
//it is finally rendered with its individual image with all likes & comments retrieved
app.get("/photos/:id", async (req, res) => {
  const { id } = req.params;
  const [[image]] = await db
    .promise()
    .query("SELECT * FROM images WHERE id = ?", [id]);

  if (!image) {
    const messages = [
      "What are you doing here?",
      "Uh oh, it appears you've become lost",
      "You're not supposed to be here :-(",
      "Congrats! You've found the error page",
      "What did you do wrong to get here?",
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];

    return res.status(404).render("noImage", { message });
  }

  const [[{ count }]] = await db
    .promise()
    .query("SELECT COUNT(*) AS count FROM likes WHERE image_id = ?", [id]);
  const likesCount = count || 0;
  const [commentRows] = await db
    .promise()
    .query("SELECT * FROM comments WHERE image_id = ? ORDER BY id ASC", [id]);
  const comments = commentRows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    comment_text: row.comment_text,
    username: row.username,
    upload_time: new Date(row.created_at).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  }));
  image.url = `/assets/${image.filename}`;
  res.render("photoId", {
    image,
    likesCount,
    comments,
    loggedin: req.session.loggedin,
  });
});

//                                                      ~RENDERING OTHER PAGES~

//rendering home page with random messages if the user is not logged in & other messages for when they are
app.get("/home", (req, res) => {
  const messages = [
    "Log in to upload a picture!",
    "You would be a lot cooler if you logged in",
    "Click the cat!",
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];

  const greeting = ["Hello", "Hey", "Long time no see", "What's up"];

  const randomIndex2 = Math.floor(Math.random() * greeting.length);
  const greet = greeting[randomIndex2];

  res.render("home", {
    message,
    greet,
    name: req.session.username,
    loggedin: req.session.loggedin,
  });
});

//rendering logput page with random goodbye messages
app.get("/logout", (req, res) => {
  const messages = [
    "Gone so soon?",
    "C u l8r alligator",
    "Miss you already :-(",
    "Come back soon!",
    "Catch you on the flipside",
    "Groeten",
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];

  req.session.loggedin = false;
  req.session.username = null;
  res.render("logout", { message });
});

//rendering the index page as 'home' with random messages if the user is not logged in & other messages for when they are
app.get("/", function (req, res) {
  const messages = [
    "Log in to upload a picture!",
    "You would be a lot cooler if you logged in",
    "Click the cat!",
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];

  const greeting = ["Hello", "Hey", "Long time no see", "What's up"];

  const randomIndex2 = Math.floor(Math.random() * greeting.length);
  const greet = greeting[randomIndex2];

  res.render("home", {
    message,
    greet,
    name: req.session.username,
    loggedin: req.session.loggedin,
  });
});

//rendering the login page
app.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

//rendering the upload page with random messages that call on the current users username for personalisation
app.get("/upload", function (req, res) {
  const messages = [
    `Hey ${req.session.username}, what pictures do you have for me today?`,
    `Hi ${req.session.username}, ready to share your photos?`,
    `Great to see you again ${req.session.username}! Let's upload some images.`,
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const message = messages[randomIndex];
  res.render("upload", {
    message: message,
    name: req.session.username,
    loggedin: req.session.loggedin,
  });
});

//rendering the register page
app.get("/register", function (req, res) {
  res.render("register", { message: "" });
});

//                                            ~SETUP FOR THE POSTING OF LIKES & COMMENTS~

//setup for posting likes, ensures that the user is firstly logged in, if they aren't, redirects to login page
//existingLike is created to check if a certain username already has a row in the likes database
//if they do, delete the like row & the page is reloaded
//a new row is inserted into likes table with the username of the person who liked the image if it isn't already liked by them
//it also attaches the photo id to the username to keep track of the seperate images
//user is then redirected to the page with the like added, or the deleted like if user has already liked the image
app.post("/photos/:id/like", async (req, res) => {
  const { image_id } = req.body;
  const username = req.session.username;

  if (!req.session.loggedin) {
    return res.redirect("/login");
  }

  const [[existingLike]] = await db
    .promise()
    .query("SELECT * FROM likes WHERE image_id = ? AND name = ?", [
      image_id,
      username,
    ]);

  if (existingLike) {
    //delete like row if user has already liked the image
    const result = await db
      .promise()
      .query("DELETE FROM likes WHERE image_id = ? AND name = ?", [
        image_id,
        username,
      ]);
  } else {
    //or add new like row if they haven't
    const result = await db
      .promise()
      .query("INSERT INTO likes (image_id, name) VALUES (?, ?)", [
        image_id,
        username,
      ]);
  }

  res.redirect(`/photos/${req.params.id}`);
});

//deals with adding comments to the images
//ensures that the user is logged in, if not, they are redirected to login page
//ensures that the field has text in it so no empty comments & if it is, simply redirects user to same page
//if the textbox is not empty, it selects the username & places it in a new row in the comments table with pic id, user id, name & text
//the comment is then rendered in the photoId ejs file
//the user is then redirected to the same page with the new comment
app.post("/photos/:id/comment", async (req, res) => {
  const { id } = req.params;
  const { comment_text } = req.body;
  const username = req.session.username;

  if (!req.session.loggedin) {
    return res.redirect("/login");
  }

  if (!comment_text || /^\s*$/.test(comment_text)) {
    return res.redirect(`/photos/${id}`);
  }
  const [[user]] = await db
    .promise()
    .query("SELECT * FROM users WHERE name = ?", [username]);
  const result = await db
    .promise()
    .query(
      "INSERT INTO comments (image_id, user_id, username, comment_text) VALUES (?, ?, ?, ?)",
      [id, user.id, username, comment_text]
    );

  res.redirect(`/photos/${id}`);
});

//                                                 ~SETUP FOR THE DELETION OF IMAGES~

//deleting the image from the database & the folder by deleting the row from the table when the user presses the delete button on the the photoId page
//but only allows the user who uploaded the photo to delete their own pictures
app.post("/photos/:id/delete", async (req, res) => {
  const { id } = req.params;

  //gets data from db for image id & the user who uploaded the image
  const [[image]] = await db
    .promise()
    .query("SELECT * FROM images WHERE id = ? AND uploader = ?", [
      id,
      req.session.username,
    ]);

  const errorMessages = [
    "What are you doing! You didn't upload this picture >:-(",
    "How would you like it if someone tried to delete one of your pictures?",
    "You can only delete your own images, silly goose",
    "You do not have permission to delete this, it isn't yours!",
  ];
  const randomIndex = Math.floor(Math.random() * errorMessages.length);
  const errorMessage = errorMessages[randomIndex];

  //if the current session username and uploader does not match, throws this error
  if (!image) {
    return res.status(403).render("notAuth", {
      message: errorMessage,
    });
  }
  //if the user that is logged in and the uploader are the same person
  //deletes the row from the likes table for that image because it is connected to images table
  await db.promise().query("DELETE FROM likes WHERE image_id = ?", [id]);

  //deletes the image from database
  await db.promise().query("DELETE FROM images WHERE id = ?", [id]);

  //deletes the image from the folder
  fs.unlink(`./assets/uploads/edited/${image.filename}`, (err) => {
    if (err) {
      console.error(err);
    }
  });

  res.redirect("/userImages");
});

//                                                      ~LOGOUT & DELETION OF SESSION~

//logging user out & ending the session, the user is then redirected to the logout page
app.post("/logout", function (req, res) {
  if (req.session && req.session.loggedin) {
    req.session.loggedin = false;
    req.session.username = null;
  }
  res.redirect("logout");
});

//                                                         ~THE UPLOADING OF IMAGES~

//middleware for file uploads
app.use(fileUpload());

//user submission of files, the editing & saving of the picture thru sharp
app.post("/new-image", async (req, res) => {
  try {
    const imageFileData = req.files.userImage;

    //checks to see if file is uploaded
    if (!imageFileData) {
      throw new Error("Please upload an image");
    }

    //setup for random error message if file uploaded is not PNG or JPG
    const errorMessages = [
      "Only PNG or JPG images are allowed >:-(",
      'What part of "upload an image" do you not understand? PNG & JPG ONLY!',
      "I can't accept that file! Only PNG or JPG",
      "Do you know what an image is? PNG or JPG only",
    ];
    const randomIndex = Math.floor(Math.random() * errorMessages.length);
    const errorMessage = errorMessages[randomIndex];

    //ensuring that only PNG or JPG files are uploaded, then gives error if not
    const extname = path.extname(imageFileData.name).toLowerCase();
    if (extname !== ".png" && extname !== ".jpg") {
      return res.render("upload", {
        message: errorMessage,
      });
    }

    //image is temporarily stored in the /uploads folder before it is edited by sharp
    const uploadedFilename = `assets/uploads/${imageFileData.name}`;
    await imageFileData.mv(uploadedFilename);

    //path for the edited image is made and url for the image to be found
    const editedUrl = `uploads/edited/${imageFileData.name}`;
    const editedFilename = `assets/${editedUrl}`;

    //the file is edited with sharp & saved to a directory
    //the original is then deleted
    await sharp(uploadedFilename).resize(750).toFile(editedFilename);
    await fs.unlink(uploadedFilename);

    //the image is then uploaded to the images table with info on who uploaded it, the filename and when it was uploaded
    const query =
      "INSERT INTO images (uploader, filename, upload_time) VALUES (?, ?, NOW())";
    const values = [req.session.username, imageFileData.name];
    await db.promise().query(query, values);

    //if it was sucessful, the user is directed to this page with the below data to be retrieved in the ejs file
    res.render("successful-upload", {
      data: {
        name: req.session.username,
        imageName: imageFileData.name,
        imageSourceUrl: editedUrl,
      },
    });
  } catch (error) {
    //catch error for if the user tries to upload no file as to not crash whole site
    res.render("upload", {
      message:
        "Invisible images are no fun, please only upload PNG or JPG files",
    });
  }
});

//                                                       ~REGISTRATION OF A USER~

app.post("/register", function (req, res) {
  const { name, password } = req.body;

  //checks that both fields are filled out to not allow a user with no username or password
  if (!name || !password) {
    res.render("./register", {
      message: "Please provide both name and password",
      name,
      password,
    });

    return;
  }

  //using bcrypt to hash passwords
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      throw err;
    }
    //the hashed password is put into the users database with the username
    const user = { name, password: hash };
    db.query("INSERT INTO users SET ?", user, function (err, result) {
      if (err) {
        throw err;
      }
      res.redirect("/home");
    });
  });
});

//                                                      ~LOGGING THE USER IN~

//for finding users & passwords, if not found, redirect to login
//if found, it compares the bcrypt hashed password with the submitted one
//if it is sucessful, the username is set for the session & they are set to loggedIn
app.post("/login", function (req, res) {
  const { name, password } = req.body;

  //requires both fields to be filled out as there cannot be a registered user with either field blank
  if (!name || !password) {
    res.render("./login", {
      message: "Please provide both name and password",
      name,
      password,
    });

    return;
  }
  db.query(
    "SELECT * FROM users WHERE name = ?",
    [name],
    function (err, results) {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        res.redirect("/login");
      } else {
        bcrypt.compare(password, results[0].password, function (err, result) {
          if (err) {
            throw err;
          }
          if (result === true) {
            req.session.loggedin = true;
            req.session.username = name;
            res.redirect("photos");
          } else {
            res.redirect("/login");
          }
        });
      }
    }
  );
});

//                                                             ~LOCALHOST~

//port for localhost
app.listen(8080, function () {
  console.log(`Server started on port ${port}`);
});
