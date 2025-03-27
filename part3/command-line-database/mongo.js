const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log('please provide a number as well');
  process.exit(1);
}

const [, , password, name, number] = process.argv;
const url = `mongodb+srv://kyledinardi:${password}@cluster0.xjmdhwi.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
