const sql = require("./db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const scKey = require("../config/jwt.config");
// const fs = require("fs");
// const { strictEqual } = require("assert");

// Constructor
const Category = function (category) {
  this.name = category.name;
};

Category.create = (newCategory, result) => {
  sql.query("INSERT INTO categories SET ?", newCategory, (err, res) => {
    if(err) {
      console.log("Query error: " + err);
      result(err, null);
      return;
    }
    console.log("Created category: ", {
      id: res.insertId,
      ...newCategory
    });
    result(null, {
      id: res.insertId,
      ...newCategory
    });
  });
};

Category.checkCategoryName = (name, result) => {
  sql.query("SELECT * FROM categories WHERE name='" + name + "'", (err, res) => {
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

Category.getAllRecords = (result) => {
  sql.query("SELECT * FROM categories", (err, res) => {
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

Category.updateByID = (id, data, result) => {
  //removeOldFileName(id);
  sql.query("UPDATE categories SET name=? WHERE id=?", 
  [data.name, id], (err, res) => {
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
    console.log("Update category: " , { id: id, ...data });
    result(null, { id: id, ...data });
  })
};

Category.remove = (id, result) => {
  // removeOldFileName(id);
  sql.query("DELETE FROM categories WHERE id = ?", id, (err, res) => {
    if(err) {
      console.group("Query error: " + err)
      result(err, null)
      return;
    }
    if(res.affectedRows == 0) {
      result({kind: "not_found"}, null)
      return;
    }
    console.group("Deleted category id: " + id)
    result(null, {id: id})
  });
};
module.exports = Category;