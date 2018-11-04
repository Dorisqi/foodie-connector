module.exports = {
  'extends': [
    'react-app',
    'airbnb',
  ],
  'rules': {
    'react/jsx-filename-extension': ['error', {
      'extensions': ['.js', '.jsx']
    }],
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        'src/setupTests.js',
        'src/__tests__/**/*.js',
      ],
    }],
    'react/prefer-stateless-function': ['off'],
    'react/forbid-prop-types': ['error', {
      'forbid': ['any'],
    }],
    'react/destructuring-assignment': ['off'],
    'prefer-destructuring': ['off'],
  },
  'env': {
    'jest': true,
    'browser': true,
  },
  'settings': {
    'import/resolver': {
      'node': {
        'paths': [
          'src/',
        ],
      },
    },
  },
};
