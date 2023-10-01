const mongoose = require('mongoose');
const db = require('../config/connection');
const User = require('../models/User');
const Thought = require('../models/Thought');

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Thought.deleteMany();

    const user1 = await User.create({
      username: 'test',
      email: 'test@subject.com',
    });

    const user2 = await User.create({
      username: 'Lexin',
      email: 'Lexin@Lexin.com',
    });

    const thought1 = await Thought.create({
      thoughtText: 'I am a test subject',
      username: 'test',
    });

    const thought2 = await Thought.create({
      thoughtText: 'I am a real test subject',
      username: 'Lexin',
    });

    // Add thoughts to user's thoughts array
    user1.thoughts.push(thought1);
    user2.thoughts.push(thought2);

    // Save the users with their updated thoughts arrays
    await user1.save();
    await user2.save();

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
