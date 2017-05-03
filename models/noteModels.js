const mongoose = require('mongoose');


const notesSchema = mongoose.Schema({
  ID: '',
  Title: '',
  Body: '',
  Username: ''
});



notesSchema.methods.apiRepr = function(type) {
  if (type === 'listview') {
    return {
      ID: this._id,
      Title: this.Title
    }
  }
  return {
    ID: this._id,
    Title: this.Title,
    Body: this.Body
  }
};


module.exports = mongoose.model('notesdbs', notesSchema);