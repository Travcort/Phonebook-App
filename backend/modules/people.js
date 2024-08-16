require ('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MongoDbURL;
if (!url) {
    console.error('Failed to fetch the Password');
    return process.exit(1);
}

mongoose.set('strictQuery', false);
// Connecting to the Database
mongoose.connect(url)
.then(response => {
    console.log('Successfully connected to the Database');
})
.catch(error => {
    console.error('Failed to connect to the Database', error.message);
})


// Defining the Schema and model for the database
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! It should be in the format xx-xxxxxx or xxx-xxxxx.`
        }  
    }
});
const Person = mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);