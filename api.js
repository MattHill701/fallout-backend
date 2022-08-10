const express = require("express");
const apiRouter = express.Router();
const jsdom = require("jsdom");

const {
    client,
    getAllUsers,
    createUser,
    getUserByUsername,
    updateUser
  } = require("./functions");

// set `req.user` if possible
apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

apiRouter.get("/users", async (req, res, next) => {
  // console.log("api req.body",username, password, cart, canSell)
    try {
        const users = await getAllUsers();
        res.send(users)
    } catch (error) {
      next(error);
    }
  });

  apiRouter.patch("/users", async (req, res, next) => {
    const { id, string } = req.body;

      try {
          const user = await updateUser(id, string);
          res.send(user)
      } catch (error) {
        next(error);
      }
    });

apiRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  // console.log("api req.body",username, password, cart, canSell)
    try {
      let notUser = await getUserByUsername(username)
      if(notUser !== undefined){
        res.send("user exists")
      } else{
      let user = await createUser(
        `<user>
        <username>${username}</username>
        <password>${password}</password>
        <characters>
        </characters>
      </user>`
        )
      console.log("this is user", user)

      res.send({message: "congrats", username})
      }
    } catch (error) {
      next(error);
    }
  });

  apiRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  // console.log("api req.body",username, password, cart, canSell)
    try {
      let User = await getUserByUsername(username)
      if(User === undefined){
        res.send("user doesn't exist")
      } else{
        let text = User.info
        let xmlDoc = new jsdom.JSDOM(text);
       if(xmlDoc.window.document.querySelector("password").textContent === password){
        res.send({message: "congrats", username})
       } else{
        res.send("user doesn't exist")
       }

      
      }
    } catch (error) {
      next(error);
    }
  });

module.exports = apiRouter;