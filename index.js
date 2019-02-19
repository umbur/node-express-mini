// implement your API here

const express = require("express");

const db = require("./data/db");

const server = express();

// middleware
server.use(express.json());

server.get("/", (req, res) => {
  res.send("<h2>Hello From Local Host</h2>");
});

// GET
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(201).json({ success: true, users });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "The users information could not be retrieved."
      });
      res.end();
    });
});

server.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.findById(userId)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ error: "The user with the specified ID does not exist" });
      } else {
        res.status(201).json({ success: true, user })
      }
      
    })
    .catch(err => {
      res.status(500).json({ success: false, error: "The users information could not be retrieved." })
    });
});

// POST
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  const newUser = req.body;
  if (!name || !bio) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }

  db.insert(newUser)
    .then(user => {
      res.status(201).json({ success: true, user });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        error: "There was an error while saving the user to the database"
      });
    });
});

// DELETE
server.delete("/api/users/:id", (req, res) => {
    const userId = req.params.id;
  
    db.remove(userId)
      .then(user => {
        if (!user) {
          return res
            .status(404)
            .json({success: false,  message: "The user with the specified ID does not exist" });
        } else {
             res.send('The user successfuly deleted');
            //res.json({success: 'The user successfuly deleted'})
            res.status(204).end();
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ success: false, error: "The user could not be removed" });
      });
  });



//UPDATE

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;
  
    db.update(id, changes)
      .then(updatedUser => {
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "The user with the specified ID does not exist." })
        } else if (!changes.name || !changes.bio) {
          return res.status(400).json({ success: false, message: "Please provide name and bio for the user."})
        } else {
          res.status(200).json({success: true, changes})
        }
      })
      .catch(err => {
        res.status(500).json({ success: false, error: "The user information could not be modified." })
      })
  });



server.listen(4000, () => {
  console.log("\n*** Running on port 4000 ***\n");
});

