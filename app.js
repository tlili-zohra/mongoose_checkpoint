// 1. Require necessary modules
const mongoose = require("mongoose");
require("dotenv").config(); // To load the .env file
//Import Schema
const { Schema } = mongoose;

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to the database:", err));

//Create a person with this prototype:
// 2. Define the Person Schema
const personSchema = new Schema({
  name: { type: String, required: true }, // Name is required
  age: { type: Number }, // Age is optional
  favoriteFoods: { type: [String] }, // Array of favorite foods
});

// Create the Person model based on the schema
const Person = mongoose.model("Person", personSchema);
//console.log(Person);
//3. Create and Save a Record of a Model:

const person = new Person({
  name: "John Doe",
  age: 30,
  favoriteFoods: ["pizza", "pasta"],
});

// Save the document using then/catch
/*person
  .save()
  .then((savedPerson) => {
    console.log("Person saved:", savedPerson);
  })
  .catch((err) => {
    console.error("Error saving person:", err);
  });*/

//4.Create Many Records with model.create()
const peopleArray = [
  { name: "Alice", age: 25, favoriteFoods: ["Sushi", "Salad"] },
  { name: "Bob", age: 35, favoriteFoods: ["Pasta", "Ice Cream"] },
  { name: "Mary", age: 20, favoriteFoods: ["Sushi", "Salad"] },
];
//simple way
//Person.create(peopleArray);
//with function
// Create many records using model.create()
const createPeople = async () => {
  try {
    const createdPeople = await Person.create(peopleArray);
    console.log("People created:", createdPeople);
  } catch (err) {
    console.error("Error creating people:", err);
  }
};

// Call the function to create multiple records
//createPeople();

//createManyPeople(peopleArray);

//5. Use model.find() to Search Your Database
const findByName = async (name) => {
  const people = await Person.find({ name });
  console.log("Found people:", people);
};

//findByName("John Doe");

//6. Use model.findOne() to Return a Single Matching Document
const findOneByFood = async (food) => {
  const person = await Person.findOne({
    favoriteFoods: { $in: [new RegExp(food, "i")] },
  });
  console.log("Found person:", person);
};

//findOneByFood("Pizza");

//7.Use model.findById() to Search Your Database By _id
const findById = async (personId) => {
  const person = await Person.findById(personId);
  console.log("Found person by ID:", person);
};

//findById("680da1625324de1c9f9dfa18");

//8.Perform Classic Updates by Running Find, Edit, Then Save
const updateFavoriteFood = async (personId) => {
  try {
    // Find the person by ID
    const person = await Person.findById(personId);

    // Add a new favorite food
    person.favoriteFoods.push("Hamburger");

    // Save the updated document
    const updatedPerson = await person.save();

    // Log the updated person document
    console.log("Updated person:", updatedPerson);
  } catch (err) {
    // Handle any errors
    console.log("Error saving updated person:", err);
  }
};

//updateFavoriteFood("680da1625324de1c9f9dfa18");

//9.Perform New Updates on a Document Using model.findOneAndUpdate()
const updateAge = async (personName) => {
  const updatedPerson = await Person.findOneAndUpdate(
    { name: personName },
    { age: 20 },
    { new: true } // Return the updated document
  );
  console.log("Updated person:", updatedPerson);
};

//updateAge("John Doe");

//10.Delete One Document Using model.findByIdAndRemove
const deletePersonById = async (personId) => {
  const deletedPerson = await Person.findByIdAndDelete(personId);
  console.log("Deleted person:", deletedPerson);
};

//deletePersonById("680da8fa818347425640d2ca");

//11.Delete Many Documents with model.remove()
const deleteManyPeople = async () => {
  try {
    // Delete all people with the name "Mary"
    const deletedPeople = await Person.deleteMany({ name: "Mary" });

    // Check how many people were deleted
    if (deletedPeople.deletedCount > 0) {
      console.log(`Deleted ${deletedPeople.deletedCount} person(s)`);
    } else {
      console.log("No people named 'Mary' were found to delete.");
    }
  } catch (err) {
    // Handle any errors that occur during deletion
    console.log("Error deleting people:", err.message);
  }
};

//deleteManyPeople();

//12.Chain Search Query Helpers to Narrow Search Results
const findBurritoLovers = async () => {
  const results = await Person.find({ favoriteFoods: "Burritos" })
    .sort({ name: 1 }) // Sort by name in ascending order
    .limit(2) // Limit to 2 results
    .select("account_id name favoriteFoods -_id") // Exclude _id
    .exec();

  console.log("Burrito lovers:", results);
};

//findBurritoLovers();
