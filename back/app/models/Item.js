const sql = require("./db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const scKey = require("../config/jwt.config");
// const fs = require("fs");
const { strictEqual } = require("assert");

// Constructor
const Item = function (item) {
  this.name = item.name;
  this.price = item.price;
  this.category_id = item.category_id;
}
// const expireTime = "1h";

Item.create = (newItem, result) => {
  sql.query("INSERT INTO items SET ?", newItem, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    // const token = jwt.sign({id: res.insertId}, scKey.secret, {
    //   expiresIn: expireTime
    // });
    console.log("Created item: ", {
      id: res.insertId,
      ...newItem
    });
    result(null, {
      id: res.insertId,
      ...newItem
    });
  });
};

Item.checkItemName = (name, result) => {
  sql.query("SELECT * FROM item WHERE name='" + name + "'", (err, res) => {
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

// User.login = (account, result) => {
//   sql.query("SELECT * FROM users WHERE name='" + account.name + "'", (err, res) => {
//     if(err) {
//       console.log("Query error: " + err);
//       result(err, null);
//       return;
//     }
//     if(res.length) {
//       if(account.password === res[0].password) {
//         console.log("Login success.");
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

Item.getAllRecords = (result) => {
  sql.query("SELECT * FROM items", (err, res) => {
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

Item.updateByID = (id, data, result) => {
  //removeOldFileName(id);
  sql.query("UPDATE items SET name=?, price=?, category_id=? WHERE id=?", 
  [data.name, data.price, data.category_id, id], (err, res) => {
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
    console.log("Update item: " , { id: id, ...data });
    result(null, { id: id, ...data });
  })
};

Item.remove = (id, result) => {
  // removeOldFileName(id);
  sql.query("DELETE FROM items WHERE id = ?", id, (err, res) => {
    if(err) {
      console.group("Query error: " + err)
      result(err, null)
      return;
    }
    if(res.affectedRows == 0) {
      result({kind: "not_found"}, null)
      return;
    }
    console.group("Deleted item id: " + id)
    result(null, {id: id})
  });
};
module.exports = Item;