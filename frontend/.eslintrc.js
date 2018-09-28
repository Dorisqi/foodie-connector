module.exports = {
    "extends": "airbnb",
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    "env": {
        "jest": true,
        "browser": true,
    },
    "settings": {
      "import/resolver": {
        "node": {
          "paths": ["src/material-kit"]
        }
      }
    }

};
