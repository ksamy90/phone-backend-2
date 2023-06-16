const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("please provide password");
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://todojs:${password}@cluster0.xlsfe.mongodb.net/phone-app-2?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phone = mongoose.model("Phone", phoneSchema);

const phoneData = new Phone({
  name,
  number,
});

if (process.argv.length === 5) {
  phoneData.save().then((result) => {
    console.log("phone data saved");
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Phone.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((user) => {
      console.log(`${user.name} ${user.number}`);
    });
    mongoose.connection.close();
  });
}
