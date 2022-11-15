const sql = require("./db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const scKey = require("../config/jwt.config");
// const fs = require("fs");
const { strictEqual } = require("assert");

// Constructor
const User = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.address = user.address;
  this.password = user.password;
  this.role = user.role;
}
// const expireTime = "1h";

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    // const token = jwt.sign({id: res.insertId}, scKey.secret, {
    //   expiresIn: expireTime
    // });
    console.log("Created user: ", {
      id: res.insertId,
      ...newUser
    });
    result(null, {
      id: res.insertId,
      ...newUser
    });
  });
};

User.checkUserName = (name, result) => {
  sql.query("SELECT * FROM users WHERE name='" + name + "'", (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("Found name: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({kind: "not_found"}, null);
  });
};

User.login = (account, result) => {
  sql.query("SELECT * FROM users WHERE name='" + account.name + "'", (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if(res.length) {
      // const validPassword = bcrypt.compareSync(
      //   account.password, res[0].password
      // );
      if(account.password === res[0].password) {
        //const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
        console.log("Login success.");
        //res[0].accessToken = token;
        result(null, res[0]);
        return;
      }else{
        console.log("Password invalid.");
        result({kind: "invalid_pass"}, null);
        return;
      }
    }
    result({kind: "not_found"}, null);
  });
}

User.getAllRecords = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
}

// const removeOldFileName = (id, result) => {
//   sql.query("SELECT * FROM users WHERE id = ?", [id], (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if(res.length) {
//       let filepath = __basedir + "/assets/uploads/" + res[0].img;
//       try {
//         if(fs.existsSync(filepath)) {
//           fs.unlink(filepath, (error) => {
//             if(error) console.log("Error: " + error);
//             else console.log("File: " + res[0].img + " was removed.")
//           })
//         }
//         else console.log("File " + res[0].img + " not found.")
//       } catch (error) {
//         console.log("error catch: " + error);
//       }
//     } 
//   });
// };

User.updateByID = (id, data, result) => {
  //removeOldFileName(id);
  sql.query("UPDATE users SET name=?, email=?, address=? WHERE id=?", 
  [data.name, data.email, data.address, id], (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    if(res.affectedRows == 0) {
      // this user id not found
      result({kind: "not_found"}, null);
      return;
    }
    console.log("Update user: " , { id: id, ...data });
    result(null, { id: id, ...data });
  })
};

User.remove = (id, result) => {
  // removeOldFileName(id);
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if(err) {
      console.group("Query error: " + err)
      result(err, null)
      return;
    }
    if(res.affectedRows == 0) {
      result({kind: "not_found"}, null)
      return;
    }
    console.group("Deleted user id: " + id)
    result(null, {id: id})
  });
};
module.exports = User;