import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageSelector';

const SubjectTopics = ({ subject = 'Physics', onTopicSelect }) => {
  const { currentLanguage, t } = useLanguage();
  const getTopicsForSubject = (subject, language) => {
    const topics = {
      'Physics': {
        'en': [
          { title: "Motion in a Straight Line", description: "Position, displacement, velocity, and acceleration", chapter: "Chapter 3", available: true },
          { title: "Motion in a Plane", description: "Vector addition, projectile motion, and circular motion", chapter: "Chapter 4", available: true },
          { title: "Laws of Motion", description: "Newton's laws, friction, and dynamics of motion", chapter: "Chapter 5", available: true },
          { title: "Work, Energy and Power", description: "Work-energy theorem, conservation of energy", chapter: "Chapter 6", available: true },
          { title: "Gravitation", description: "Universal law of gravitation, planetary motion", chapter: "Chapter 8", available: true },
          { title: "Oscillations", description: "Simple harmonic motion, pendulum", chapter: "Chapter 14", available: true },
          { title: "Waves", description: "Wave properties, sound waves, Doppler effect", chapter: "Chapter 15", available: true }
        ],
        'hi': [
          { title: "सरल रेखा में गति", description: "स्थिति, विस्थापन, वेग और त्वरण", chapter: "अध्याय 3", available: true },
          { title: "समतल में गति", description: "सदिश योग, प्रक्षेप्य गति और वृत्तीय गति", chapter: "अध्याय 4", available: true },
          { title: "गति के नियम", description: "न्यूटन के नियम, घर्षण और गति की गतिकी", chapter: "अध्याय 5", available: true },
          { title: "कार्य, ऊर्जा और शक्ति", description: "कार्य-ऊर्जा प्रमेय, ऊर्जा संरक्षण", chapter: "अध्याय 6", available: true },
          { title: "गुरुत्वाकर्षण", description: "गुरुत्वाकर्षण का सार्वभौमिक नियम, ग्रहीय गति", chapter: "अध्याय 8", available: true },
          { title: "दोलन", description: "सरल आवर्त गति, लोलक", chapter: "अध्याय 14", available: true },
          { title: "तरंगें", description: "तरंग गुण, ध्वनि तरंगें, डॉप्लर प्रभाव", chapter: "अध्याय 15", available: true }
        ]
      },
      'Chemistry': {
        'en': [
          { title: "Some Basic Concepts of Chemistry", description: "Atoms, molecules, mole concept", chapter: "Chapter 1", available: true },
          { title: "Structure of Atom", description: "Electrons, protons, neutrons, quantum numbers", chapter: "Chapter 2", available: true },
          { title: "Chemical Bonding", description: "Ionic, covalent bonds, molecular structure", chapter: "Chapter 4", available: true },
          { title: "States of Matter", description: "Gases, liquids, solids", chapter: "Chapter 5", available: true },
          { title: "Thermodynamics", description: "Enthalpy, entropy, Gibbs energy", chapter: "Chapter 6", available: true },
          { title: "Organic Chemistry", description: "Hydrocarbons, functional groups", chapter: "Chapter 12", available: true }
        ],
        'hi': [
          { title: "रसायन विज्ञान की मूल अवधारणाएँ", description: "परमाणु, अणु, मोल संकल्पना", chapter: "अध्याय 1", available: true },
          { title: "परमाणु की संरचना", description: "इलेक्ट्रॉन, प्रोटॉन, न्यूट्रॉन, क्वांटम संख्याएँ", chapter: "अध्याय 2", available: true },
          { title: "रासायनिक आबंधन", description: "आयनिक, सहसंयोजक आबंध, आण्विक संरचना", chapter: "अध्याय 4", available: true },
          { title: "द्रव्य की अवस्थाएँ", description: "गैस, द्रव, ठोस", chapter: "अध्याय 5", available: true },
          { title: "ऊष्मागतिकी", description: "एन्थैल्पी, एन्ट्रॉपी, गिब्स ऊर्जा", chapter: "अध्याय 6", available: true },
          { title: "कार्बनिक रसायन", description: "हाइड्रोकार्बन, कार्यात्मक समूह", chapter: "अध्याय 12", available: true }
        ]
      },
      'Mathematics': {
        'en': [
          { title: "Sets", description: "Set theory, operations on sets", chapter: "Chapter 1", available: true },
          { title: "Relations and Functions", description: "Types of relations, function definition", chapter: "Chapter 2", available: true },
          { title: "Trigonometric Functions", description: "Trigonometric ratios, identities", chapter: "Chapter 3", available: true },
          { title: "Complex Numbers", description: "Imaginary numbers, quadratic equations", chapter: "Chapter 5", available: true },
          { title: "Permutations and Combinations", description: "Arrangements and selections", chapter: "Chapter 7", available: true },
          { title: "Conic Sections", description: "Circle, parabola, ellipse, hyperbola", chapter: "Chapter 11", available: true }
        ],
        'hi': [
          { title: "समुच्चय", description: "समुच्चय सिद्धांत, संक्रियाएँ", chapter: "अध्याय 1", available: true },
          { title: "संबंध एवं फलन", description: "संबंध के प्रकार, फलन की परिभाषा", chapter: "अध्याय 2", available: true },
          { title: "त्रिकोणमितीय फलन", description: "त्रिकोणमितीय अनुपात, सर्वसमिकाएँ", chapter: "अध्याय 3", available: true },
          { title: "सम्मिश्र संख्याएँ", description: "काल्पनिक संख्याएँ, द्विघातीय समीकरण", chapter: "अध्याय 5", available: true },
          { title: "क्रमचय और संचय", description: "व्यवस्था और चयन", chapter: "अध्याय 7", available: true },
          { title: "शंकु परिच्छेद", description: "वृत्त, परवलय, दीर्घवृत्त, अतिपरवलय", chapter: "अध्याय 11", available: true }
        ]
      },
      'Biology': {
        'en': [
          { title: "The Living World", description: "Classification, nomenclature", chapter: "Chapter 1", available: true },
          { title: "Biological Classification", description: "Five kingdom classification", chapter: "Chapter 2", available: true },
          { title: "Plant Kingdom", description: "Plant classification", chapter: "Chapter 3", available: true },
          { title: "Animal Kingdom", description: "Animal classification", chapter: "Chapter 4", available: true },
          { title: "Cell - The Unit of Life", description: "Cell theory, cell structure", chapter: "Chapter 8", available: true },
          { title: "Photosynthesis", description: "Light reactions, Calvin cycle", chapter: "Chapter 13", available: true }
        ],
        'hi': [
          { title: "जीव जगत", description: "वर्गीकरण, नामकरण", chapter: "अध्याय 1", available: true },
          { title: "जैविक वर्गीकरण", description: "पाँच जगत वर्गीकरण", chapter: "अध्याय 2", available: true },
          { title: "वनस्पति जगत", description: "पादप वर्गीकरण", chapter: "अध्याय 3", available: true },
          { title: "प्राणि जगत", description: "प्राणी वर्गीकरण", chapter: "अध्याय 4", available: true },
          { title: "कोशिका - जीवन की इकाई", description: "कोशिका सिद्धांत, कोशिका संरचना", chapter: "अध्याय 8", available: true },
          { title: "प्रकाश संश्लेषण", description: "प्रकाश अभिक्रिया, केल्विन चक्र", chapter: "अध्याय 13", available: true }
        ]
      }
    };

    return topics[subject]?.[language] || topics['Physics']['en'];
  };

  const availableTopics = getTopicsForSubject(subject, currentLanguage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <BookOpen className="text-blue-600 mr-3" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">
          {currentLanguage === 'hi'
            ? `उपलब्ध ${subject === 'Physics' ? 'भौतिक विज्ञान' : subject === 'Chemistry' ? 'रसायन विज्ञान' : subject === 'Mathematics' ? 'गणित' : subject === 'Biology' ? 'जीव विज्ञान' : subject} कक्षा 11 विषय (NCERT)`
            : `Available ${subject} Class 11 Topics (NCERT)`
          }
        </h3>
      </div>
      
      <div className="space-y-3">
        {availableTopics.map((topic, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              topic.available 
                ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => topic.available && onTopicSelect && onTopicSelect(topic.title)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h4 className="font-medium text-gray-900">{topic.title}</h4>
                  {topic.available && (
                    <CheckCircle className="text-green-600 ml-2" size={16} />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{topic.description}</p>
                <span className="text-xs text-blue-600 font-medium">{topic.chapter}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          {currentLanguage === 'hi'
            ? <>
                <strong>नोट:</strong> ये विषय NCERT {subject === 'Physics' ? 'भौतिक विज्ञान' : subject === 'Chemistry' ? 'रसायन विज्ञान' : subject === 'Mathematics' ? 'गणित' : subject === 'Biology' ? 'जीव विज्ञान' : subject} कक्षा 11 पाठ्यपुस्तक से निकाले गए हैं।
                अपनी प्रश्नोत्तरी या पाठ्यक्रम निर्माण में उपयोग के लिए किसी भी विषय पर क्लिक करें।
              </>
            : <>
                <strong>Note:</strong> These topics are extracted from NCERT {subject} Class 11 textbook.
                Click on any topic to use it in your quiz or curriculum generation.
              </>
          }
        </p>
      </div>
    </div>
  );
};

export default SubjectTopics;
