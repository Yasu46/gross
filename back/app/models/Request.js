const sql = require("./db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const scKey = require("../config/jwt.config");
// const fs = require("fs");
const { strictEqual } = require("assert");

// Constructor
const Request = function (request) {
  this.user_id = request.user_id;
  this.total_price = request.total_price;
  this.request_date = request.request_date;
  this.status = request.status;
}
// const expireTime = "1h";

Request.create = (newRequest, result) => {
  sql.query("INSERT INTO requests SET ?", newRequest, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    // const token = jwt.sign({id: res.insertId}, scKey.secret, {
    //   expiresIn: expireTime
    // });
    console.log("Created request: ", {
      id: res.insertId,
      ...newRequest
    });
    result(null, {
      id: res.insertId,
      ...newRequest
    });
  });
};

// Request.checkRequestName = (name, result) => {
//   sql.query("SELECT * FROM requests WHERE name='" + name + "'", (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if (res.length) {
//       console.log("Found name: ", res[0]);
//       result(null, res[0]);
//       return;
//     }
//     result({kind: "not_found"}, null);
//   });
// };

// Request.login = (account, result) => {
//   sql.query("SELECT * FROM requests WHERE name='" + account.name + "'", (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if(res.length) {
//       // const validPassword = bcrypt.compareSync(
//       //   account.password, res[0].password
//       // );
//       if(account.password === res[0].password) {
//         //const token = jwt.sign({id: res.insertId}, scKey.secret, {expiresIn: expireTime});
//         console.log("Login success.");
//         //res[0].accessToken = token;
//         result(null, res[0]);
//         return;
//       }else{
//         console.log("Password invalid.");
//         result({kind: "invalid_pass"}, null);
//         return;
//       }
//     }
//     result({kind: "not_found"}, null);
//   });
// }

Request.getAllRecords = (result) => {
  sql.query("SELECT * FROM requests", (err, res) => {
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

// Request.updateByID = (id, data, result) => {
//   //removeOldFileName(id);
//   sql.query("UPDATE requests SET name=?, email=?, address=? WHERE id=?", 
//   [data.name, data.email, data.address, id], (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if(res.affectedRows == 0) {
//       // this user id not found
//       result({kind: "not_found"}, null);
//       return;
//     }
//     console.log("Update user: " , { id: id, ...data });
//     result(null, { id: id, ...data });
//   })
// };

Request.remove = (id, result) => {
  // removeOldFileName(id);
  sql.query("DELETE FROM requests WHERE id = ?", id, (err, res) => {
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
module.exports = Request;