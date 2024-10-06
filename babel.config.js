module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@/app/*': './app/*',
            '@/assets/*': './assets/*',
            '@/components/*': './components/*',
            '@/config/*': './config/*',
            '@/constants/*': './constants/*',
            '@/context/*': './context/*',
            '@/hooks/*': './hooks/*',
            '@/lib/*': './lib/*',
            '@/store/*': './store/*',
            '@/supabase/*': './supabase/*',
            '@/types/*': './types/*',
            '@/utils/*': './utils/*',
          },
        },
      ],
    ],
  };
};
