require('dotenv').config();

module.exports = {
  PORT:            process.env.PORT || 5000,
  NODE_ENV:        process.env.NODE_ENV || 'development',
  TINYFISH_API_KEY: process.env.TINYFISH_API_KEY || 'sk-tinyfish-W_FP631-vIwcW9XTzLZ-qBG6F4IgWO5-',
  CLIENT_URL:      process.env.CLIENT_URL || 'http://localhost:5173',

  // TinyFish base URLs
  TINYFISH_SEARCH_URL:   'https://api.search.tinyfish.ai',
  TINYFISH_FETCH_URL:    'https://api.fetch.tinyfish.ai',
  TINYFISH_AGENT_URL:    'https://agent.tinyfish.ai/v1/automation',
  TINYFISH_RUNS_URL:     'https://agent.tinyfish.ai/v1/runs',
};
