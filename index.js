const PORT = process.env.PORT || 8001
const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio')
const app = express()
// ------------ Add WebSites to Scrape for API -----------
const newspapers = [{
        name: 'cnbc',
        address: 'https://www.cnbc.com/marijuana/',
        base: ''
    },
    {
        name: 'apNews',
        address: 'https://apnews.com/hub/marijuana',
        base: 'https://apnews.com/hub/marijuana/'
    },
    {
        name: 'highTimes',
        address: 'https://hightimes.com/news/',
        base: ''
    }
]


const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("cannabis")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {

    res.json('Welcome to my SmokeShop API')
})

app.get('/news', (req, res) => {
    res.json(articles)

})


app.get('/news/:newspaperId', (req, res) => {



    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    // https://youtu.be/GK4Pl-GmPHk?t=2779
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    // https://youtu.be/GK4Pl-GmPHk?t=2665
    axios.get(newspaperAddress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("cannabis")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)

    }).catch(err => console.log(err))
})


app.listen(PORT, () => console.log(`server running on "https//localhost:${PORT}/"`))