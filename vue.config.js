module.exports = {
  assetsDir : 'it',
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' },
      disableHostCheck: true
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}