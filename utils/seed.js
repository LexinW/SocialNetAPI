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
      username: 'user1',
      email: 'user1@example.com',
    });

    const user2 = await User.create({
      username: 'user2',
      email: 'user2@example.com',
    });

    const thought1 = await Thought.create({
      thoughtText: 'This is thought 1',
      username: 'user1',
    });

    const thought2 = await Thought.create({
      thoughtText: 'This is thought 2',
      username: 'user2',
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
