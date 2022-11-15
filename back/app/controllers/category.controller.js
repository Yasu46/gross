//const bcrypt = require("bcryptjs");
const Category = require("../models/Category");
const createNewCategory = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }
  //const salt = bcrypt.genSaltSync(10);
  const CategoryObj = new Category({
    name: req.body.name
  });
  Category.create(CategoryObj, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data)
  });
}

const validCategory = (req, res) => {
  Category.checkCategoryName(req.params.us, (err, data) => {
    if(err) {
      if(err.kind == "not_found") {
        res.send({
          message: "Not found " + req.params.us,
          valid: true
        })
      }else{
        res.status(500).send({
          message: "Error retriveing " + req.params.us
        });
      }
    }else res.send({record: data, valid: false});
  });
};

// const login = (req, res) => {
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty."
//     });
//   }

//   const account = new User({
//     name: req.body.name,
//     password: req.body.password
//   });
//   console.log("aaa "+req.body);

//   User.login(account, (err, data) => {
//     if(err) {
//       if(err.kind == "not_found") {
//         res.status(401).send({
//           message: "Not found " + req.body.name
//         });
//       } else if (err.kind == "invalid_pass") {
//         res.status(401).send({
//           message: "Invalid Password"
//         });
//       }else{
//         res.status(500).send({
//           message: "Error retriveing " + req.body.name
//         });
//       }
//     }else res.send(data);
//   });
// };

const getAllCategories = (req, res) => {
  Category.getAllRecords((err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data);
  });
};

const updateCategory = (req, res) => {
  if(!req.body) {
    res.status(400).send({ message: "Content can not be empty."});
  }
  const data = {
    name: req.body.name
  };
  Category.updateByID(req.params.id, data, (err, result) => {
    if(err) {
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found category id: " + req.params.id
        });
      } else {
        res.status(500).send({
          message: "Error update category id: " + req.params.id
        });
      }
    } else res.send(result);
  });
};

const deleteCategory = (req, res) => {
  Category.remove(req.params.id, (err, result)=>{
    if(err){
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found category id: " + req.params.id
        });
      }else{
        res.status(500).send({
          message: "Error delete category id: " + req.params.id
        });
      }
    }
    else res.send(result);
  });
}
module.exports = {
  createNewCategory,
  validCategory,
  //login,
  getAllCategories,
  updateCategory,
  deleteCategory
}