module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/the-ultimate-domain-manager/' : '/',
  pwa: {
    themeColor: '#FFCF2D',
    msTileColor: '#FFCF2D',
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    }
  }
}
