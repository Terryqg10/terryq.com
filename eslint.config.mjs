import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/** Features que existen (spec §4.3). Una nueva feature se añade aquí. */
const features = ['home', 'work', 'services', 'about', 'contact', 'not-found'];

const otherFeatures = (name) => ['@/features/*', `!@/features/${name}`, `!@/features/${name}/**`];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': 'allow-with-description',
          'ts-nocheck': true,
          minimumDescriptionLength: 10,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  // §4.4 regla 2: features/X no importa de features/Y (lo común sube a components/).
  ...features.flatMap((name) => {
    const crossFeature = {
      group: otherFeatures(name),
      message: 'features/X no puede importar de otro features/Y (spec §4.4). Súbelo a components/.',
    };
    return [
      {
        files: [`src/features/${name}/**/*.{ts,tsx}`],
        rules: { 'no-restricted-imports': ['error', { patterns: [crossFeature] }] },
      },
      // Los archivos de primer nivel de una feature no salen de ella con rutas relativas.
      {
        files: [`src/features/${name}/*.{ts,tsx}`],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              patterns: [
                crossFeature,
                {
                  group: ['../*'],
                  message: 'Importa con el alias @/ al salir de la feature (spec §4.4).',
                },
              ],
            },
          ],
        },
      },
    ];
  }),
  // §4.4 regla 3: components/ no importa de features/ ni de content/.
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**', '@/content/**', '**/features/**', '**/content/**'],
              message:
                'components/ recibe los datos por props; no importa de features/ ni de content/ (spec §4.4).',
            },
          ],
        },
      ],
    },
  },
  // §4.4 regla 4 / §17.1: content/ solo datos, tipos y MDX; no importa de components/.
  {
    files: ['src/content/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/**', '**/components/**'],
              message:
                'content/ solo contiene datos y tipos; no importa de components/ (spec §4.4).',
            },
          ],
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);

export default eslintConfig;
