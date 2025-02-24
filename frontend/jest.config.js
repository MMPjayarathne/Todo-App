module.exports = {
    setupFilesAfterEnv: ["@testing-library/jest-dom"], 
    transform: {
      "^.+\\.jsx?$": "babel-jest", 
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", 
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", 
      "/node_modules/(?!react-router-dom)/",
    ],
    testEnvironment: 'jsdom',
  };