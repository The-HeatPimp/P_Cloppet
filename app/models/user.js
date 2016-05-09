var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  created_at: Date,
  updated_at: Date,
  access: Array,
  password: { type: String, required: true},
  admin: Boolean,
  token: String
});


UserSchema.pre('save',
    function(next) {
        // Save the Date of creation and updates
        var currentDate = new Date();
        this.updated_at = currentDate;
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    }
);


module.exports = mongoose.model('Users', UserSchema);