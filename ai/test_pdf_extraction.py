#!/usr/bin/env python3
"""
Simple test script to extract NCERT PDF data without full dependencies
"""

import json
import os
from pathlib import Path

def create_sample_extracted_data():
    """Create sample extracted data from Physics 11th PDFs"""
    
    # Sample data structure based on the PDF files we found
    physics_11_data = {
        "grade": 11,
        "subject": "physics",
        "book_title": "Physics - Class XI",
        "chapters": [
            {
                "filename": "UNITS&MEASUREMENT.pdf",
                "title": "Units and Measurement",
                "sections": [
                    {"title": "1.1 Introduction", "content": "Physics is a quantitative science, based on measurement of physical quantities..."},
                    {"title": "1.2 The International System of Units", "content": "The International System of Units (SI) is the modern form of the metric system..."},
                    {"title": "1.3 Measurement of Length", "content": "Length is one of the fundamental quantities in physics..."},
                    {"title": "1.4 Measurement of Mass", "content": "Mass is a fundamental property of matter..."},
                    {"title": "1.5 Measurement of Time", "content": "Time is a fundamental quantity in physics..."}
                ],
                "key_concepts": [
                    "Physical Quantities", "Fundamental Units", "Derived Units", "SI System", 
                    "Measurement", "Precision", "Accuracy", "Significant Figures", "Dimensions"
                ],
                "examples": [
                    {"number": "1.1", "content": "Express the following in SI units: (a) 1 light year (b) 1 parsec"},
                    {"number": "1.2", "content": "Calculate the number of significant figures in the following measurements"}
                ],
                "exercises": [
                    "1. What are the fundamental and derived units in SI system?",
                    "2. Explain the concept of significant figures with examples.",
                    "3. Convert 1 light year into meters."
                ],
                "full_text": "Units and Measurement: Physics is a quantitative science based on measurement of physical quantities. Measurement is the process of comparison of the given physical quantity with the known standard quantity of the same nature. The result of measurement of a physical quantity is expressed by a number accompanied by a unit..."
            },
            {
                "filename": "MOTION_IN_A_STRAIGHT_LINE.pdf",
                "title": "Motion in a Straight Line",
                "sections": [
                    {"title": "2.1 Introduction", "content": "Motion is common to everything in the universe..."},
                    {"title": "2.2 Position, Path Length and Displacement", "content": "To describe motion, we need to specify the position of the object..."},
                    {"title": "2.3 Average Velocity and Average Speed", "content": "The average velocity is defined as the change in position divided by time interval..."},
                    {"title": "2.4 Instantaneous Velocity and Speed", "content": "The instantaneous velocity is the velocity at a particular instant of time..."},
                    {"title": "2.5 Acceleration", "content": "Acceleration is the rate of change of velocity with respect to time..."}
                ],
                "key_concepts": [
                    "Position", "Displacement", "Distance", "Velocity", "Speed", 
                    "Acceleration", "Uniform Motion", "Equations of Motion", "Graphs"
                ],
                "examples": [
                    {"number": "2.1", "content": "A car travels 100 km in 2 hours. Calculate its average speed."},
                    {"number": "2.2", "content": "A ball is thrown vertically upward with initial velocity 20 m/s. Find the maximum height."}
                ],
                "exercises": [
                    "1. Distinguish between distance and displacement.",
                    "2. Derive the equations of motion for uniformly accelerated motion.",
                    "3. A car accelerates from rest at 2 m/s². Find its velocity after 10 seconds."
                ],
                "full_text": "Motion in a Straight Line: Motion is common to everything in the universe. The earth revolves around the sun, the sun moves through the galaxy, and the galaxy moves through space. Motion is change in position of an object with time. The study of motion without considering the forces that cause it is called kinematics..."
            },
            {
                "filename": "MOTION_IN_A_PLANE.pdf",
                "title": "Motion in a Plane",
                "sections": [
                    {"title": "3.1 Introduction", "content": "In this chapter we shall study motion in two dimensions..."},
                    {"title": "3.2 Scalars and Vectors", "content": "Physical quantities can be classified into scalars and vectors..."},
                    {"title": "3.3 Multiplication of Vectors by Real Numbers", "content": "A vector can be multiplied by a real number..."},
                    {"title": "3.4 Addition and Subtraction of Vectors", "content": "Vectors can be added using graphical and analytical methods..."},
                    {"title": "3.5 Projectile Motion", "content": "Projectile motion is the motion of an object thrown into the air..."}
                ],
                "key_concepts": [
                    "Vectors", "Scalars", "Vector Addition", "Vector Components", 
                    "Projectile Motion", "Circular Motion", "Relative Motion"
                ],
                "examples": [
                    {"number": "3.1", "content": "Find the resultant of two vectors of magnitude 3 and 4 units."},
                    {"number": "3.2", "content": "A projectile is fired at 30° to the horizontal. Find its range."}
                ],
                "exercises": [
                    "1. What is the difference between scalar and vector quantities?",
                    "2. Derive the expression for range of a projectile.",
                    "3. Two vectors have magnitudes 5 and 12 units. Find their resultant."
                ],
                "full_text": "Motion in a Plane: In this chapter we shall study motion in two dimensions. We shall learn about vectors and their properties. We shall also study projectile motion and circular motion. Vector quantities have both magnitude and direction, while scalar quantities have only magnitude..."
            },
            {
                "filename": "LAWS_OF_MOTION.pdf",
                "title": "Laws of Motion",
                "sections": [
                    {"title": "4.1 Introduction", "content": "In the previous chapters we studied motion without considering what causes motion..."},
                    {"title": "4.2 Aristotle's Fallacy", "content": "Aristotle's ideas about motion were based on common sense observations..."},
                    {"title": "4.3 The Law of Inertia", "content": "Newton's first law states that an object at rest stays at rest..."},
                    {"title": "4.4 Newton's First Law of Motion", "content": "Every object continues in its state of rest or uniform motion..."},
                    {"title": "4.5 Newton's Second Law of Motion", "content": "The rate of change of momentum is proportional to the applied force..."}
                ],
                "key_concepts": [
                    "Force", "Inertia", "Newton's Laws", "Momentum", "Impulse", 
                    "Friction", "Circular Motion", "Centripetal Force"
                ],
                "examples": [
                    {"number": "4.1", "content": "A force of 10 N acts on a mass of 2 kg. Find the acceleration."},
                    {"number": "4.2", "content": "Calculate the friction force when coefficient of friction is 0.3."}
                ],
                "exercises": [
                    "1. State and explain Newton's three laws of motion.",
                    "2. Define momentum and derive its conservation law.",
                    "3. A 5 kg block slides down a rough incline. Find the acceleration."
                ],
                "full_text": "Laws of Motion: In the previous chapters we studied motion without considering what causes motion. In this chapter we shall study the cause of motion - force. We shall learn about Newton's three laws of motion and their applications. Force is a push or pull that can change the state of motion of an object..."
            },
            {
                "filename": "WORK_ENERGY_AND_POWER.pdf",
                "title": "Work, Energy and Power",
                "sections": [
                    {"title": "5.1 Introduction", "content": "In everyday life, work has different meanings..."},
                    {"title": "5.2 Notions of Work and Kinetic Energy", "content": "Work is done when a force acts on an object and displaces it..."},
                    {"title": "5.3 Work", "content": "Work is defined as the dot product of force and displacement..."},
                    {"title": "5.4 Kinetic Energy", "content": "Kinetic energy is the energy possessed by a body due to its motion..."},
                    {"title": "5.5 Work-Energy Theorem", "content": "The work done on an object equals the change in its kinetic energy..."}
                ],
                "key_concepts": [
                    "Work", "Energy", "Power", "Kinetic Energy", "Potential Energy", 
                    "Conservation of Energy", "Work-Energy Theorem", "Collisions"
                ],
                "examples": [
                    {"number": "5.1", "content": "Calculate work done when a 10 N force moves an object 5 m."},
                    {"number": "5.2", "content": "Find the kinetic energy of a 2 kg object moving at 10 m/s."}
                ],
                "exercises": [
                    "1. Define work and state its SI unit.",
                    "2. Prove the work-energy theorem.",
                    "3. A 1000 kg car accelerates from 0 to 20 m/s. Find the work done."
                ],
                "full_text": "Work, Energy and Power: In everyday life, work has different meanings. In physics, work has a specific definition. Work is done when a force acts on an object and causes displacement. Energy is the capacity to do work. Power is the rate of doing work. These concepts are fundamental to understanding mechanics..."
            }
        ]
    }
    
    return physics_11_data

def save_extracted_data():
    """Save the sample extracted data to the expected location"""
    
    # Create the directory structure
    output_dir = Path("../data/ncert/grade_11/physics")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate sample data
    physics_data = create_sample_extracted_data()
    
    # Save to file
    output_file = output_dir / "chapters_from_pdf.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(physics_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Sample NCERT Physics Class 11 data saved to: {output_file}")
    print(f"📚 Generated {len(physics_data['chapters'])} chapters")
    
    # Print summary
    for i, chapter in enumerate(physics_data['chapters']):
        print(f"   {i+1}. {chapter['title']}")
        print(f"      - Sections: {len(chapter['sections'])}")
        print(f"      - Key Concepts: {len(chapter['key_concepts'])}")
        print(f"      - Examples: {len(chapter['examples'])}")
        print(f"      - Exercises: {len(chapter['exercises'])}")

if __name__ == "__main__":
    print("🚀 Creating sample NCERT PDF extracted data...")
    save_extracted_data()
    print("\n✅ Sample data creation completed!")
    print("\n📝 This sample data simulates what would be extracted from actual NCERT PDFs.")
    print("   In production, the PDF extractor would read the actual PDF files and extract:")
    print("   - Chapter titles and sections")
    print("   - Key concepts and definitions") 
    print("   - Examples and solved problems")
    print("   - Exercise questions")
    print("   - Full text content for AI processing")