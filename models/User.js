const { isEmail} = require('validator');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//create a schema for the model
const userSchema = new mongoose.Schema({
email: {
  type: String,
  required: [true, 'Please enter an email'],
  //the mail becomes unique and no user signs tice
  unique: true,
  lowercase: true,
  validate: [isEmail, 'Please enter a valid email']
},

password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters']
}
})

//fire a function after saving a doc
userSchema.post('save', function(doc, next) {
  console.log('new user was created', doc);
  next();
})


//fire a function before a doc is saved to db
userSchema.pre('save', async function (next) {
  // console.log('user about to be created and saved', this);

  //generate a salt
  const salt = await bcrypt.genSalt();
 this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static methd to login a user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({email});

  //check if we have a user to compare the password 
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user
    }
    throw Error ('Invalid password');

  } throw Error('Invalid email or password')
}
//create  modl based on the schema
const User = mongoose.model('user', userSchema);

module.exports = User;