module.exports = {
    'extends': [
        'react-app',
        'react-app/jest',
        'eslint:recommended',
    ],
    'rules': {
        'semi': 'warn',
        'quotes': [
            'warn',
            'single',
        ],
        'no-trailing-spaces': 'warn',
        'camelcase': 'warn',
        'eol-last': 'warn',
        'no-var': 'warn',
        'prefer-const': 'warn',
        'consistent-return': 'error',
        'indent': [
            'error',
            4,
        ],
        'comma-dangle': [
            'error',
            {
                'arrays': 'always',
                'objects': 'always',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never',
            },
        ],
    },
};
