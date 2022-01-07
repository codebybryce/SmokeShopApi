const PORT = 8000
const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'cnbc',
        address: 'https://www.cnbc.com/marijuana/',
    },
    {
        name:'apNews',
        address: 'https://apnews.com/hub/marijuana'
    },
    {
        name:'highTimes',
        address: 'https://hightimes.com/news/'
    }
]
const articles = []

// '/' listens to homepage



newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("cannabis")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url,
                source: newspaper.name
            })
    })
})})

app.get('/',(req,res)=>{
    
    res.json('Welcome to my SmokeShop API')
})

app.get('/News', (req,res)=>{
    res.json(articles)

})

app.listen(PORT, ()=> console.log(`server running on ${PORT}`))