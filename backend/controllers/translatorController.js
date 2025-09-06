const logger = require('../utils/logger');
const axios = require('axios');

// Translate text using AI service (OpenRouter-backed)
const translateText = async (req, res) => {
  try {
    const {
      text,
      sourceLanguage = 'en',
      targetLanguage,
      domain = 'general'
    } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Text and target language are required'
      });
    }

    if (sourceLanguage === targetLanguage) {
      return res.status(200).json({
        success: true,
        data: {
          originalText: text,
          translatedText: text,
          sourceLanguage,
          targetLanguage,
          confidence: 1.0
        }
      });
    }

  // Use AI service translation endpoint
  logger.info(`Translating text from ${sourceLanguage} to ${targetLanguage} using AI service`);

  const translationResponse = await axios.post(`${process.env.AI_SERVICE_URL}/translate`, {
      text,
      sourceLanguage,
      targetLanguage,
      domain
    }, {
      timeout: parseInt(process.env.AI_SERVICE_TIMEOUT) || 30000
    });

    const translationResult = translationResponse.data;

    res.status(200).json({
      success: true,
      message: 'Text translated successfully',
      data: {
        originalText: text,
        translatedText: translationResult.translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: translationResult.confidence || 0.9,
        processingTime: translationResult.processingTime || 0,
  method: 'ai-service'
      }
    });

  } catch (error) {
    logger.error('Error translating text:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Translation service is currently unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to translate text',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fallback translation for basic Hindi-English pairs
const performFallbackTranslation = async (text, sourceLanguage, targetLanguage) => {
  // This is a very basic fallback - in production you'd want a more sophisticated approach
  const basicTranslations = {
    'en_to_hi': {
      'hello': 'नमस्ते',
      'welcome': 'स्वागत',
      'quiz': 'प्रश्नोत्तरी',
      'home': 'होम',
      'physics': 'भौतिक विज्ञान',
      'chemistry': 'रसायन विज्ञान',
      'mathematics': 'गणित',
      'biology': 'जीव विज्ञान'
    },
    'hi_to_en': {
      'नमस्ते': 'hello',
      'स्वागत': 'welcome',
      'प्रश्नोत्तरी': 'quiz',
      'होम': 'home',
      'भौतिक विज्ञान': 'physics',
      'रसायन विज्ञान': 'chemistry',
      'गणित': 'mathematics',
      'जीव विज्ञान': 'biology'
    }
  };

  const translationKey = `${sourceLanguage}_to_${targetLanguage}`;
  const translations = basicTranslations[translationKey] || {};

  return translations[text.toLowerCase()] || text;
};

// Translate curriculum content
const translateCurriculum = async (req, res) => {
  try {
    const { curriculumId, targetLanguage } = req.body;

    if (!curriculumId || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Curriculum ID and target language are required'
      });
    }

    // This would integrate with curriculum model
    // For now, we'll simulate the translation process
    logger.info(`Translating curriculum ${curriculumId} to ${targetLanguage}`);

    // Call AI service for curriculum translation
    const translationResponse = await axios.post(`${process.env.AI_SERVICE_URL}/translate/curriculum`, {
      curriculumId,
      targetLanguage
    }, {
      timeout: 60000 // Longer timeout for curriculum translation
    });

    const translatedCurriculum = translationResponse.data;

    res.status(200).json({
      success: true,
      message: 'Curriculum translated successfully',
      data: translatedCurriculum
    });

  } catch (error) {
    logger.error('Error translating curriculum:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to translate curriculum'
    });
  }
};

// Translate quiz content
const translateQuiz = async (req, res) => {
  try {
    const { quizId, targetLanguage } = req.body;

    if (!quizId || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Quiz ID and target language are required'
      });
    }

    logger.info(`Translating quiz ${quizId} to ${targetLanguage}`);

    // Call AI service for quiz translation
    const translationResponse = await axios.post(`${process.env.AI_SERVICE_URL}/translate/quiz`, {
      quizId,
      targetLanguage
    }, {
      timeout: 60000
    });

    const translatedQuiz = translationResponse.data;

    res.status(200).json({
      success: true,
      message: 'Quiz translated successfully',
      data: translatedQuiz
    });

  } catch (error) {
    logger.error('Error translating quiz:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to translate quiz'
    });
  }
};

// Get supported languages
const getSupportedLanguages = async (req, res) => {
  try {
    // This would typically come from the translation service
    const supportedLanguages = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
    ];

    res.status(200).json({
      success: true,
      data: {
        languages: supportedLanguages,
        totalCount: supportedLanguages.length
      }
    });

  } catch (error) {
    logger.error('Error fetching supported languages:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supported languages'
    });
  }
};

// Detect language of text
const detectLanguage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for language detection'
      });
    }

    logger.info('Detecting language for provided text');

    // Call AI service for language detection
    const detectionResponse = await axios.post(`${process.env.AI_SERVICE_URL}/translate/detect`, {
      text
    }, {
      timeout: 10000
    });

    const detectionResult = detectionResponse.data;

    res.status(200).json({
      success: true,
      message: 'Language detected successfully',
      data: {
        detectedLanguage: detectionResult.language,
        confidence: detectionResult.confidence,
        alternativeLanguages: detectionResult.alternatives || []
      }
    });

  } catch (error) {
    logger.error('Error detecting language:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to detect language'
    });
  }
};

// Batch translate multiple texts
const batchTranslate = async (req, res) => {
  try {
    const {
      texts,
      sourceLanguage = 'en',
      targetLanguage,
      domain = 'general'
    } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Texts array is required and must not be empty'
      });
    }

    if (!targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Target language is required'
      });
    }

    if (texts.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 100 texts can be translated in a single batch'
      });
    }

    logger.info(`Batch translating ${texts.length} texts from ${sourceLanguage} to ${targetLanguage}`);

    // Call AI service for batch translation
    const translationResponse = await axios.post(`${process.env.AI_SERVICE_URL}/translate/batch`, {
      texts,
      sourceLanguage,
      targetLanguage,
      domain
    }, {
      timeout: 120000 // 2 minutes for batch translation
    });

    const translationResults = translationResponse.data;

    res.status(200).json({
      success: true,
      message: 'Batch translation completed successfully',
      data: {
        translations: translationResults.translations,
        sourceLanguage,
        targetLanguage,
        totalTexts: texts.length,
        successfulTranslations: translationResults.successCount || texts.length,
        processingTime: translationResults.processingTime || 0
      }
    });

  } catch (error) {
    logger.error('Error in batch translation:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to complete batch translation'
    });
  }
};

// Get translation history
const getTranslationHistory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sourceLanguage,
      targetLanguage,
      startDate,
      endDate
    } = req.query;

    // This would typically come from a translation history model
    // For now, we'll return a mock response
    const mockHistory = {
      translations: [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(limit)
      }
    };

    res.status(200).json({
      success: true,
      data: mockHistory
    });

  } catch (error) {
    logger.error('Error fetching translation history:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch translation history'
    });
  }
};

module.exports = {
  translateText,
  translateCurriculum,
  translateQuiz,
  getSupportedLanguages,
  detectLanguage,
  batchTranslate,
  getTranslationHistory
};