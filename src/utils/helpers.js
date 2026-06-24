const _ = require('lodash');
const moment = require('moment');
const validator = require('validator');

/**
 * Format user data for API responses
 * Uses vulnerable lodash version
 */
function formatUserData(user) {
  return _.pick(user, ['id', 'username', 'email', 'createdAt', 'updatedAt']);
}

/**
 * Validate request body contains required fields
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 */
function validateRequest(body, requiredFields) {
  if (!_.isObject(body)) {
    return false;
  }
  
  return _.every(requiredFields, field => {
    return _.has(body, field) && !_.isEmpty(_.toString(body[field]));
  });
}

/**
 * Generate a random user for testing
 * Demonstrates various lodash utilities
 */
function generateRandomUser() {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica', 'Ryan', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['example.com', 'test.org', 'sample.net', 'demo.co'];
  
  const firstName = _.sample(firstNames);
  const lastName = _.sample(lastNames);
  const username = _.toLower(`${firstName}${lastName}${_.random(100, 999)}`);
  const email = `${username}@${_.sample(domains)}`;
  
  return {
    username,
    email,
    createdAt: moment().subtract(_.random(1, 100), 'days').toISOString(),
    profile: {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      joinDate: moment().subtract(_.random(1, 365), 'days').format('YYYY-MM-DD')
    }
  };
}

/**
 * Sanitize user input (basic implementation)
 * Uses vulnerable validator version
 */
function sanitizeInput(input) {
  if (!_.isString(input)) {
    return '';
  }
  
  // Basic sanitization - in reality this should be more comprehensive
  return _.trim(input).replace(/[<>]/g, '');
}

/**
 * Check if string is a valid username
 * @param {string} username 
 */
function isValidUsername(username) {
  if (!_.isString(username)) {
    return false;
  }
  
  // Basic validation using lodash
  return username.length >= 3 && 
         username.length <= 20 && 
         _.isMatch(username, /^[a-zA-Z0-9_]+$/);
}

/**
 * Deep clone object using vulnerable lodash version
 * This demonstrates the potential for prototype pollution
 */
function deepCloneObject(obj) {
  return _.cloneDeep(obj);
}

/**
 * Merge user data with defaults
 * Uses vulnerable lodash merge (prototype pollution risk)
 */
function mergeUserDefaults(userData) {
  const defaults = {
    role: 'user',
    active: true,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    },
    metadata: {
      lastLogin: null,
      loginCount: 0,
      createdBy: 'system'
    }
  };
  
  // This merge operation is vulnerable to prototype pollution in lodash 4.17.4
  return _.merge(defaults, userData);
}

/**
 * Get user statistics using various lodash methods
 */
function getUserStats(users) {
  if (!_.isArray(users)) {
    return null;
  }
  
  const now = moment();
  const activeUsers = _.filter(users, user => {
    const lastActive = moment(user.updatedAt || user.createdAt);
    return now.diff(lastActive, 'days') <= 30;
  });
  
  return {
    total: users.length,
    active: activeUsers.length,
    inactive: users.length - activeUsers.length,
    newest: _.maxBy(users, user => moment(user.createdAt).unix()),
    oldest: _.minBy(users, user => moment(user.createdAt).unix()),
    byDomain: _.countBy(users, user => {
      const email = user.email || '';
      return email.includes('@') ? email.split('@')[1] : 'unknown';
    })
  };
}

/**
 * Process external API data
 * Demonstrates potentially unsafe data processing
 */
function processExternalData(data) {
  if (!_.isArray(data)) {
    return [];
  }
  
  return _.map(data, item => {
    // Unsafe merge that could lead to prototype pollution
    const processed = _.merge({}, item);
    
    return {
      id: processed.id,
      name: processed.name,
      email: processed.email,
      processedAt: moment().toISOString(),
      // This could be dangerous if the external data contains malicious properties
      ...processed.metadata
    };
  });
}

module.exports = {
  formatUserData,
  validateRequest,
  generateRandomUser,
  sanitizeInput,
  isValidUsername,
  deepCloneObject,
  mergeUserDefaults,
  getUserStats,
  processExternalData
}; 