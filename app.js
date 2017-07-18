const express = require('express')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const firebase = require('firebase').initializeApp({
    serviceAccount:"",
    databaseURL:"https://mathpro-c58e7.firebaseio.com/"
})
var os = require('os')


app.all('/version', (req,res) =>
    {
        res.send('v. 0.0.3')
    })

var types = [14,16,15,58,59,62,116]
var scales = ['international','national and regional', 'undergraduate','national', 'tst', 'junior', 'new']
function aops() {
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
    if (sections && type && year) {
        for (var j=0; j < types.length; j++) {
                var olympiad = scales[j]
                var a = types[j]
                request.post({
                    url: 'https://artofproblemsolving.com/m/community/ajax.php',
                    form: {
                        sought_category_ids:types[j],
                        parent_category_id:13,
                        seek_items:0,
                        log_visit:1,
                        a:'fetch_items_categories',
                        aops_logged_in:false,
                        aops_user_id:1
                    }
                },
                (err,res,body) => {
                    //console.log(res)
                    counter++
                    var id = JSON.parse(body).response.categories.category_id
                    for (var i = 0; i<types.length;i++) {
                        if (types[i] == id) {
                            var nomer = i
                            break;
                        }
                    }

                    JSON.parse(body).response.categories.items.forEach(x => {
                        var typeOfOlymp = {
                            'id':x.item_id,
                            'name':x.item_text,
                            'type':scales[nomer],
                            'parentId':types[nomer]
                        }
                        object.olymp.push(typeOfOlymp)
                    })
                    console.log(counter)
                    if (counter == types.length) {
                        // console.log(object)
                        object.olymp.forEach(x => {
                            // var podobject = {'parentId':a,
                            //                 'name':x.name,
                            //                   'id':x.id}
                            if (x.type == sections) {
                                allTypes.olymp.push(x)
                                category.push(x.id)
                            }

                        })
                    console.log(allTypes)
                    // resp.json(allTypes)

                    allTypes.olymp.forEach( x => {
                        if (x.name == type) {
                            idOlympiad = x.id
                            idParent = x.parentId
                        }
                        else { idOlympiad == 3222}
                    })
                            request.post({
                                url: 'https://artofproblemsolving.com/m/community/ajax.php',
                                form: {
                                    category_id: idOlympiad,
                                    a:'fetch_category_data',
                                    aops_logged_in:false,
                                    aops_user_id:1
                                    }
                                },
                                (err,res,body) => {
                                    // console.log(body)
                                    // console.log(JSON.parse(body))
                                    JSON.parse(body).response.category.items.forEach(x => {
                                        var year = {'id': x.item_id,
                                                    'name': x.item_text}
                                                    allTypes.years.push(year)
                                    })
                                    allTypes.years.forEach(x => {
                                        if (x.name == year) {
                                            idofText = x.id
                                        }
                                    })
                                    request.post({
                                        url: 'https://artofproblemsolving.com/m/community/ajax.php',
                                                form: {
                                                    category_id:idofText,
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
                                console.log(allTypes)
                        }
                })
        }

console.log('de')
}
})
}
var requestLoop = setInterval(function(){aops()},6000)
 console.log('server is started')



module.exports = app
