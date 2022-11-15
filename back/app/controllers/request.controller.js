//const bcrypt = require("bcryptjs");
const Request = require("../models/Request");
const createNewRequest = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  //const salt = bcrypt.genSaltSync(10);
  const requestObj = new Request({
    user_id: req.body.user_id,
    total_price: req.body.total_price,
    request_date: req.body.request_date,
    status: req.body.status
  });
  Request.create(requestObj, (err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."

      })
    }else res.send(data)
  });
}

const validRequest = (req, res) => {
  Request.checkRequest(req.params.us, (err, data) => {
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

//   Request.login(account, (err, data) => {
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

const getAllRequests = (req, res) => {
  Request.getAllRecords((err, data) => {
    if(err) {
      res.status(500).send({
        message: err.message || "Some error occured while creating."
      })
    }else res.send(data);
  });
};

const updateRequest = (req, res) => {
  if(!req.body) {
    res.status(400).send({ message: "Content can not be empty."});
  }
  const data = {
    user_id: req.body.user_id,
    total_price: req.body.total_price,
    request_date: req.body.request_date,
    status: req.body.status
  };
  Request.updateByID(req.params.id, data, (err, result) => {
    if(err) {
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id
        });
      } else {
        res.status(500).send({
          message: "Error update user id: " + req.params.id
        });
      }
    } else res.send(result);
  });
};

const deleteRequest = (req, res) => {
  Request.remove(req.params.id, (err, result)=>{
    if(err){
      if(err.kind == "not_found") {
        res.status(401).send({
          message: "Not found user id: " + req.params.id
        });
      }else{
        res.status(500).send({
          message: "Error delete user id: " + req.params.id
        });
      }
    }
    else res.send(result);
  });
}
module.exports = {
  createNewRequest,
  validRequest,
  //login,
  getAllRequests,
  updateRequest,
  deleteRequest
}