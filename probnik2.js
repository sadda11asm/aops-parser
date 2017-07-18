const express = require('express')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
var os = require('os')

app.all('/version', (req,res) =>
    {
        res.send('v. 0.0.3')
    })

var types = [14,16,15,58,59,62,116]
var scales = ['international','national and regional', 'undergraduate','national', 'tst', 'junior', 'new']

app.all('/',(req,resp) => {
    let sections = req.query.sections
    let type =req.query.type
    let year = req.query.year
    var object = {
        'success':true,
        'olymp':[],
        'years':[],
        'text':[]
    }
    var category = []
    var idOlympiad
    var idParent
    var allTypes = {
        'success':true,
        'olymp':[],
        'years':[],
        'text':[]
    }
    var idofText
    var counter = 0
    request.post({
        url: 'https://artofproblemsolving.com/m/community/ajax.php',
                form: {
                    category_id:294448,
                    last_item_score:5,
                    last_item_level:0,
                    log_visit:1,
                    start_num:1,
                    fetch_all:1,
                    a:'fetch_more_items',
                    aops_logged_in:false,
                    aops_user_id:1
                    }

         },
    (err,res,body) => {
        var items = JSON.parse(body).response.items
        allTypes.text.push(items[0].post_data.category_name)
        for (var i=0; i<items.length; i++){
                if (i!=3) {
                    var text = ' '
                    text += items[i].item_text + '.'
                    text += '  '
                    text += items[i].post_data.post_canonical
                    text += os.EOL
                    //text += items[i].post_data.category_name.toString()
                    text += ''
                    if (i>3) {
                        var zadachi = {'uslovie':text,
                                        'nomer':i}
                    } else {
                        zadachi = {'uslovie':text,
                                    'nomer':i+1}
                    }
                    allTypes.text.push(zadachi)
            }
        }
        resp.json(allTypes)
    })
})
    console.log('server is started[probnik2]')



    module.exports = app
