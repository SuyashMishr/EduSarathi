#!/usr/bin/env node
const axios = require('axios');

(async () => {
  const base = process.env.BACKEND_URL || 'http://localhost:5001';
  const post = async (name, path, data) => {
    process.stdout.write(`- ${name}... `);
    try {
      const res = await axios.post(base + path, data, { timeout: 20000 });
      if (res.data && (res.data.success === true || res.status === 200)) {
        console.log('OK');
        return true;
      }
      console.log('FAIL');
      return false;
    } catch (e) {
      console.log('ERROR', e.message);
      return false;
    }
  };

  const results = [];
  results.push(await post('Quiz', '/api/quiz/generate', { subject: 'Physics', topic: 'Motion', grade: 11, questionCount: 3, questionTypes: ['mcq'], difficulty: 'medium', language: 'en' }));
  results.push(await post('Curriculum', '/api/curriculum/generate', { subject: 'Physics', grade: 11, duration: '1 semester' }));
  results.push(await post('Slides', '/api/slides/generate', { subject: 'Physics', topic: 'Vectors', grade: '11', slideCount: 4, theme: 'default', template: 'education', difficulty: 'intermediate', language: 'en', includeImages: false }));
  results.push(await post('Mindmap', '/api/mindmap/generate', { subject: 'Physics', topic: 'Gravitation', grade: 11, mindmapType: 'conceptual', language: 'en' }));
  results.push(await post('Lecture Plan', '/api/lecture-plan/generate', { subject: 'Physics', topic: 'Work and Energy', grade: '11', duration: 45, learningObjectives: ['Define work'], difficulty: 'intermediate', teachingStrategies: ['TPS'], language: 'en' }));
  results.push(await post('Grading', '/api/grading/evaluate', { question: 'Define displacement.', student_answer: 'Change in position in a direction', correct_answer: 'Shortest vector between positions', subject: 'Physics', grade: 11, max_points: 5 }));
  results.push(await post('Translation', '/api/translate', { text: 'Welcome', sourceLanguage: 'en', targetLanguage: 'hi', domain: 'general' }));

  const passed = results.filter(Boolean).length;
  const failed = results.length - passed;
  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
