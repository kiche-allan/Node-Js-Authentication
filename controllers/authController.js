// controller actions

const User = require('../models/User');

const jwt = require('jsonwebtoken');


//handling errors

const handleErrors = (err) => {
  console.log(err.message, err.code);
  //create an error object
  let errors = {email: '', password: ''};

  //incorrect emai

  if (err.message === 'Invalid email or password') {
    errors.email = 'that email is not registered'
  }

  //incorrect password
  if (err.message === 'Invalid password') {
    errors.password = 'the password is incorrect'
  }


  //dupliate error code
  if (err.code === 11000) {
    errors.email = 'the email is already registered';
    return errors;
  }

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
    errors[properties.path] = properties.message;
    });
}
return errors;
}

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({id }, 'allan kiche secret', {
    expiresIn: maxAge
});
}
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try{
   const user = await User.create({ email, password });
   const token = createToken(user._id);
   res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge *1000})
   res.status(201).json({user: user._id});
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});

  }

//   console.log(email, password);
//   res.send('new signup');
// }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  // User.login(email, password)

  // console.log(email, password);
  // res.send('user login');

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token , {httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({user: user._id});

  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req, res) => {
  //we can replace the jwt with a blank cookie

  res.cookie('jwt', '', {maxAge: 1})
  //redirect to homeage one logged out
  res.redirect('/');
}