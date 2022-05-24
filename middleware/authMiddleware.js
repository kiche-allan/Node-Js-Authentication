// const jwt = require('jsonwebtoken')

// const requireAuth = (req, res, next) =>  {
//    const token = req.cookies.jwt;
//     //check if json web token exiss
//    if (token) {
//        jwt.verify(token, 'allan kiche secret', (err, decodedToken) => {
//            if (err) {
//                console.log(err.message);

//                res.redirect('/login');
//            } else {
//                console.log(decodedToken);
            
//             next();

//             //get email from user ans inext int views in te future

//            }
//        })
//    }
//     else {
//        res.redirect('/login')
//    }
// }

// //check current user
// const checkUser = (req,res, next) => {
//     //get the token from the cookies
//     const token = req.cookies.jwt;
//     //check if the token exists

//     if (token) {
     
//         jwt.verify(token, 'allan kiche secret', async (err, decodedToken) => {
//             if (err) {
//                 console.log(err.message);
//                 res.locals.user = null;
//                 next();
//             } else {
//                 console.log(decodedToken);
//                 let user = await user.findById(decodedToken.id);
//                 res.locals.user = user;
//              next()
//             }
//         })

//     } else{
//    res.locals.user = null;
//    next();
//     }
// }
// module.exports = { requireAuth, checkUser};

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'allan kiche secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'allan kiche secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };