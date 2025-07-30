#!/usr/bin/env node

/**
 * Demo Data Generator for EduSarathi
 * Generates sample curricula and quizzes for demonstration
 */

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import models
const Curriculum = require('../backend/models/Curriculum');
const Quiz = require('../backend/models/Quiz');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edusarathi');
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const sampleCurricula = [
  {
    title: "Physics Class 11 - Motion and Forces",
    subject: "Physics",
    grade: 11,
    duration: "2 months",
    description: "Comprehensive curriculum covering motion in straight line, motion in plane, and laws of motion",
    learningObjectives: [
      "Understand concepts of displacement, velocity, and acceleration",
      "Apply Newton's laws of motion to solve problems",
      "Analyze projectile motion and circular motion"
    ],
    topics: [
      {
        name: "Motion in a Straight Line",
        duration: "2 weeks",
        subtopics: ["Position and displacement", "Velocity", "Acceleration", "Equations of motion"]
      },
      {
        name: "Motion in a Plane", 
        duration: "2 weeks",
        subtopics: ["Vector addition", "Projectile motion", "Circular motion"]
      },
      {
        name: "Laws of Motion",
        duration: "3 weeks", 
        subtopics: ["Newton's first law", "Newton's second law", "Newton's third law", "Friction"]
      }
    ],
    prerequisites: ["Basic mathematics", "Vector concepts"],
    resources: [
      "NCERT Physics Class 11 Textbook",
      "Laboratory manual for physics experiments",
      "Online simulation tools"
    ],
    assessmentStrategy: {
      formative: "Weekly quizzes and problem-solving sessions",
      summative: "Unit tests and practical examinations"
    },
    difficulty: "intermediate",
    language: "en",
    tags: ["physics", "class11", "motion", "forces"],
    status: "published"
  }
];

const sampleQuizzes = [
  {
    title: "Motion in a Straight Line - Basic Concepts",
    subject: "Physics",
    topic: "Motion in a Straight Line",
    grade: 11,
    difficulty: "easy",
    description: "Test your understanding of basic concepts in linear motion",
    questions: [
      {
        question: "What is the SI unit of displacement?",
        type: "mcq",
        options: ["meter", "meter per second", "meter per second squared", "kilogram"],
        correctAnswer: "meter",
        points: 1,
        explanation: "Displacement is a vector quantity representing change in position, measured in meters."
      },
      {
        question: "A car travels 100m in 10 seconds. What is its average speed?",
        type: "mcq", 
        options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"],
        correctAnswer: "10 m/s",
        points: 2,
        explanation: "Average speed = Total distance / Total time = 100m / 10s = 10 m/s"
      },
      {
        question: "Define acceleration in your own words.",
        type: "short_answer",
        correctAnswer: "Acceleration is the rate of change of velocity with respect to time.",
        points: 3,
        explanation: "Acceleration measures how quickly velocity changes over time."
      }
    ],
    timeLimit: 15,
    totalPoints: 6,
    language: "en",
    tags: ["physics", "motion", "kinematics"],
    status: "published"
  }
];

const generateDemoData = async () => {
  try {
    console.log('🚀 Starting demo data generation...');
    
    // Clear existing demo data
    await Curriculum.deleteMany({ tags: { $in: ['demo', 'physics'] } });
    await Quiz.deleteMany({ tags: { $in: ['demo', 'physics'] } });
    console.log('🧹 Cleared existing demo data');
    
    // Insert sample curricula
    const curricula = await Curriculum.insertMany(sampleCurricula);
    console.log(`✅ Created ${curricula.length} sample curricula`);
    
    // Insert sample quizzes
    const quizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`✅ Created ${quizzes.length} sample quizzes`);
    
    console.log('🎉 Demo data generation completed!');
    console.log('📊 Summary:');
    console.log(`   • Curricula: ${curricula.length}`);
    console.log(`   • Quizzes: ${quizzes.length}`);
    
  } catch (error) {
    console.error('❌ Error generating demo data:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
};

// Run the script
if (require.main === module) {
  connectDB().then(generateDemoData);
}

module.exports = { generateDemoData };
