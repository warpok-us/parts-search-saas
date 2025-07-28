# @partsy/eslint-config

ESLint configurations for the Partsy monorepo.

## Configurations

- **`@partsy/eslint-config/base`** - Base TypeScript configuration
- **`@partsy/eslint-config/next-js`** - Next.js specific rules
- **`@partsy/eslint-config/react-internal`** - React library rules

## Usage

In your `eslint.config.js`:

```javascript
import baseConfig from '@partsy/eslint-config/base';
import nextConfig from '@partsy/eslint-config/next-js';

export default [
  ...baseConfig,
  ...nextConfig,
  // Your custom rules
];
```

## Features

- TypeScript support with `typescript-eslint`
- React and React Hooks rules
- Next.js specific linting
- Prettier integration
- Turbo monorepo support
- Configured for ESLint 9+ flat config
