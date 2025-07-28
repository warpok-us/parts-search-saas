# @partsy/tsconfig

Shared TypeScript configurations for the Partsy monorepo.

## Configurations

- **`base.json`** - Base TypeScript configuration
- **`nextjs.json`** - Next.js specific settings
- **`react-library.json`** - React library configuration

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@partsy/tsconfig/base.json",
  "compilerOptions": {
    // Project-specific overrides
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Next.js Projects

```json
{
  "extends": "@partsy/tsconfig/nextjs.json"
}
```

## React Libraries

```json
{
  "extends": "@partsy/tsconfig/react-library.json"
}
```

## Features

- Strict TypeScript configuration
- Path mapping support for monorepo
- Modern target (ES2020+)
- Optimized for build performance
- Consistent across all packages
