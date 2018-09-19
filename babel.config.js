module.exports = function(api) {
  api.cache.using(() => process.env.NODE_ENV === 'development');

  const presets = [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-react',
  ];
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
  ];

  return {
    presets,
    plugins,
  };
};
