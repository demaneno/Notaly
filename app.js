// Creëer Express applicatie
var express = require("express");
var app = express();
const path = require("path");

// Initialiseer de database
const dbFile = path.join("./sqlite.db");
const fs = require("fs");
//fs.unlinkSync(dbFile); // uncomment deze lijn tijdelijk als je de database wilt verwijderen
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// Creëer de database tabellen
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
    );

    //Initialload Categories
    db.run("INSERT INTO Users (NAME) VALUES ('Denis');");

    db.run(
      "CREATE TABLE Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);"
    );

    console.log("table Categories created");

    //Initialload Categories
    db.run("INSERT INTO CATEGORIES (NAME) VALUES ('Rood');");
    db.run("INSERT INTO CATEGORIES (NAME) VALUES ('Oranje');");
    db.run("INSERT INTO CATEGORIES (NAME) VALUES ('Groen');");

    db.run(
      "CREATE TABLE Notes (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT ,body TEXT, userId INTEGER,categoryId INTEGER, FOREIGN KEY(userId) REFERENCES Users (id), FOREIGN KEY(categoryId) REFERENCES Categories (id));"
    );

    console.log("table Notes created");

    db.run(
      "INSERT INTO Notes (Title, body, userid, categoryId) VALUES ('Why do we use it?','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',1,2);"
    );

    console.log("database was created");
  }
});

// Nodig om de json data van o.a. POST requests te processen
// De json data van een request is de vinden in het veld req.body
app.use(express.json());

// Sta externe communicatie toe
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*"); // heeft te maken met HTTP headers (indien geïnteresseerd kan je dit nalezen op https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
app.get("/users", (req, res) => {
  db.all("SELECT * from Users order by Name", (err, rows) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

// Voorbeeld van een html response met Express (ter illustratie)
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/categories", (req, res) => {
  db.all("SELECT * from Categories order by Name", (err, rows) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

app.get("/notes", (req, res) => {
  db.all("SELECT * from Notes order by Title", (err, rows) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send(JSON.stringify(rows));
  });
});

//-----------------//########//-----------------//
//-----------------// INSERT //-----------------//
//-----------------//########//-----------------//
app.post("/user", (req, res) => {
  let name = req.body.name;
  if (!name) {
    res.send({ error: "No name argument found" });
    return;
  }

  db.all(`SELECT name from Users WHERE name Like (?)`, name, (err, rows) => {
    // return eventuele errors
    if (err) {
      res.send({ error: err });
      return;
    }
    if (rows.length > 0) {
      res.send({ error: "User already exists" });
      return;
    }

    db.run(`INSERT INTO Users (name) VALUES (?)`, name, error => {
      if (error) {
        res.send({ error: error });
        return;
      }
      res.send({ success: `Successfully added ${name}` });
    });
  });
});

app.post("/note", (req, res) => {
  // controleer of de parameters meegegeven zijn
  let title = req.body.title;
  let body = req.body.body;
  let categoryId = req.body.categoryId;
  let userId = req.body.userId;
  if (!title || !body || !categoryId || !userId) {
    res.send({ error: "No name argument found" });
    return;
  }
  db.run(
    `INSERT INTO Notes(title,body, categoryId, userId) VALUES(?, ?, ?,?)`,
    [title, body, categoryId, userId],
    err => {
      if (err) {
        res.send({ error: err });
        return;
      }
      res.send({ success: "Successfully added note" });
    }
  );
});

app.post("/category", (req, res) => {
  let name = req.body.name;
  if (!name) {
    res.send({ error: "No name argument found" });
    return;
  }

  db.all(
    `SELECT name from Categories WHERE name Like (?)`,
    name,
    (err, rows) => {
      // return eventuele errors
      if (err) {
        res.send({ error: err });
        return;
      }
      if (rows.length > 0) {
        res.send({ error: "Category already exists" });
        return;
      }

      db.run(`INSERT INTO Categories (name) VALUES (?)`, name, error => {
        if (error) {
          res.send({ error: error });
          return;
        }
        res.send({ success: `Successfully added ${name}` });
      });
    }
  );
});

//-----------------//#########//-----------------//
//-----------------// GETBYID //-----------------//
//-----------------//#########//-----------------//

app.get("/getUserById", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({ error: "geef een userId ?" });
    return;
  }
  db.get(`SELECT * FROM Users WHERE id = (?)`, [id], (err, row) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    if (!row) {
      res.send({ error: `No users with id = ${id}` });
      return;
    }
    res.send(JSON.stringify(row));
  });
});

app.get("/getCategoryById", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({ error: "geef een categoryId ?" });
    return;
  }
  db.get(`SELECT * FROM Categories WHERE id = (?)`, [id], (err, row) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    if (!row) {
      res.send({ error: `No Categories with id = ${id}` });
      return;
    }
    res.send(JSON.stringify(row));
  });
});

app.get("/getNoteById", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({ error: "Geef een note id ?" });
    return;
  }
  db.get(`SELECT * FROM Notes WHERE id = (?)`, [id], (err, row) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    if (!row) {
      res.send({ error: `No note with id = ${id}` });
      return;
    }
    res.send(JSON.stringify(row));
  });
});

//-----------------//########//-----------------//
//-----------------// DELETE //-----------------//
//-----------------//########//-----------------//
app.delete("/deleteNote", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({ error: "geef een noteId ?" });
    return;
  }
  db.get(`SELECT body FROM Notes WHERE id LIKE ?`, [id], (err, row) => {
    if (err) {
      res.send({ error: err });
      return;
    }
    if (!row) {
      res.send({ error: `No note with id ${id}` });
      return;
    }
    db.run(`DELETE FROM Notes WHERE id = (?)`, [id], (err, row) => {
      if (err) {
        res.send({ error: err });
        return;
      }
      res.send({ succes: "note verwijdert." });
    });
  });
});

app.delete("/deleteCategory", (req, res) => {
  // controleer of de naam parameter is meegegeven
  let name = req.query.name;
  if (!name) {
    res.send({ error: "No name argument found" });
    return;
  }

  db.get(`SELECT id FROM Categories WHERE name LIKE ?`, [name], (err, row) => {
    // return bij eventuele error
    if (err) {
      res.send({ error: err });
      return;
    }
    // controleer of een gebruiker met de naam bestaat
    if (!row) {
      res.send({ error: `No user named ${name}` });
      return;
    }

    // verwijder notities van de gebruiker
    let categoryId = row.id;
    db.run(`DELETE FROM Notes WHERE categoryId = (?)`, [categoryId], (err, row) => {
      if (err) {
        res.send({ error: err });
        return;
      }
    });
    db.run(`DELETE FROM Categories WHERE id = (?)`, [categoryId], (err, row) => {
      if (err) {
        res.send({ error: err });
        return;
      }
      res.send({ success: "Deleted successfully" });
    });
  });
});

app.delete("/deleteUser", (req, res) => {
  // controleer of de naam parameter is meegegeven
  let name = req.query.name;
  if (!name) {
    res.send({ error: "No name argument found" });
    return;
  }

  db.get(`SELECT id FROM Users WHERE name LIKE ?`, [name], (err, row) => {
    // return bij eventuele error
    if (err) {
      res.send({ error: err });
      return;
    }
    // controleer of een gebruiker met de naam bestaat
    if (!row) {
      res.send({ error: `No user named ${name}` });
      return;
    }

    // verwijder notities van de gebruiker
    let userId = row.id;
    db.run(`DELETE FROM Notes WHERE userId = (?)`, [userId], (err, row) => {
      if (err) {
        res.send({ error: err });
        return;
      }
    });
    // verwijder de gebruiker
    db.run(`DELETE FROM Users WHERE id = (?)`, [userId], (err, row) => {
      if (err) {
        res.send({ error: err });
        return;
      }
      res.send({ success: "Deleted successfully" });
    });
  });
});

//-----------------//########//-----------------//
//-----------------// UPDATE //-----------------//
//-----------------//########//-----------------//

app.patch("/updateUser", (req, res) => {
  // controleer of de parameters meegegeven zijn
  let id = req.query.id;
  let name = req.body.name;
  if (!id || !name) {
    res.send({ error: "Parameters id and name are required" });
    return;
  }

  db.run(`UPDATE Users SET name=? WHERE id = ?`, [name, id], err => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send({ success: "Successfully edited user" });
  });
});

app.patch("/updateCategory", (req, res) => {
  let id = req.query.id;
  let name = req.body.name;
  if (!id || !name) {
    res.send({ error: "Parameters id and name are required" });
    return;
  }

  db.run(`UPDATE Categories SET name=? WHERE id = ?`, [name, id], err => {
    if (err) {
      res.send({ error: err });
      return;
    }
    res.send({ success: "Successfully edited category" });
  });
});


app.patch("/updateNote", (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  let body = req.body.body;
  let categoryId = req.body.categoryId;
  let userId = req.body.userId;
  if (!id || !title || !body || !categoryId || !userId) {
    res.send({ error: "Parameter body is required" });
    return;
  }
  db.run(
    `UPDATE Notes SET title= (?), body = (?), categoryId = (?), userId = (?)  WHERE id = (?)`,  [title,body, categoryId, userId, id],  (err, row) => {     
      if (err) {
        res.send({ error: err });
        return;
      }
      res.send({ success: "Successfully edited note" });  
    }
  );
});

var server = app.listen(8081, function() {
  var port = server.address().port;
  console.log("Example app listening on port %s", port);
});

//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
