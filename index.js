const PORT = 8000
const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio')

const app = express()
const articles = []

// '/' listens to homepage
app.get('/',(req,res)=>{
    
    res.json('Welcome to my SmokeShop API')
})

app.get('/News', (req,res)=>{
    axios.get('https://www.cnbc.com/marijuana/')
    .then((response)=>{ 
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("cannabis")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url
            })
        })
        res.json(articles)
    }).catch((err) => console.log(err))

})

app.listen(PORT, ()=> console.log(`server running on ${PORT}`))