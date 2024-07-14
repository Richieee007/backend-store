const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://richieeeojok:j1Md0ChI35o04IME@cluster0.wtdjxfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
