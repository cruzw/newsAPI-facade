const cors = require('micro-cors')()
const NewsAPI = require('newsapi')
const newsAPIKEY = process.env.newsAPIKEY || require('./.config')
const newsapi = new NewsAPI(newsAPIKEY)
const localizationConfig = {
  language: 'en',
  country: 'us'
}
const cacheLimit = 1000 * 60 * 60 // 1 hr.

let headlines, lastFetch

module.exports = cors(async (req, res) => {

  let ts = new Date().getTime()

  if (!lastFetch || ts - lastFetch > cacheLimit) {
    await newsapi.v2
      .topHeadlines(localizationConfig)
      .then(response => {
        headlines = response.articles
        lastFetch = ts
      })
  }

  return headlines
})
