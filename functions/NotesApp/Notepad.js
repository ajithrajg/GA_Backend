const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/Notepad', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Define the schema
const myNotesSchema = new mongoose.Schema({
  notesID: {
    type: Number,
    unique: true,
    required: [true, 'Required field']
  },
  name: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  data: {
    type: String,
    required: [true, 'Required field']
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the model
const NotesModel = mongoose.model('mynotes', myNotesSchema);

module.exports = NotesModel;
