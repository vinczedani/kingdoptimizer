module.exports = {
  /* ... other config ... */
  transpileDependencies: ['vuex-persist'],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/kingdoptimizer/'
    : '/'
}
