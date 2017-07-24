const express = require('express')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const firebase = require('firebase').initializeApp({
    serviceAccount:"./NewPro-d42af2fb7cb0.json",
    databaseURL:"https://newpro-7496a.firebaseio.com"
})
var os = require('os')
var allTypes = {
            'success':true,
            'olymp':[],
            'years':[],
            'text':[]
}
var idOlympiad
// var idParent
var idofText
var types = [14,16,15,58,59,62,116]
var scales = ['international','nationalandregional','undergraduate','national', 'tst', 'junior', 'new']
function aops() {
    allTypes.olymp=[]
    allTypes.years=[]
    allTypes.text=[]
    var counterOfScale = 0
    scales.forEach(function(section) {       
        vyvestiVse(counterOfScale, section)
        counterOfScale++
    })
    console.log(allTypes)
}
function vyvestiVse(counterOfScale, section) {   
    request.post({
            url: 'https://artofproblemsolving.com/m/community/ajax.php',
            form: {
                sought_category_ids:types[counterOfScale],
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
            allTypes.olymp = []
            JSON.parse(body).response.categories.items.forEach(x => {
                var NameOfOlymp = {
                    'id':x.item_id,
                    'name':x.item_text,
                    'section':section,
                    'parentId': JSON.parse(body).response.categories.category_id
                }
                allTypes.olymp.push(NameOfOlymp)
            })
                // resp.json(allTypes)
                var counterOfName=0
                allTypes.olymp.forEach(type => {
                    if(type.section==section) {
                        idOlympiad = type.id
                        var typetype = type.name
                    }
                    if (counterOfName < 40) {
                        putYears(section,counterOfScale, typetype, counterOfName, idOlympiad)
                    }
                    counterOfName++        
                })
                // console.log(allTypes)
        })
}

function putYears(section,counterOfScale, typetype, counterOfName, idOlympiad) {
            request.post({
                url: 'https://artofproblemsolving.com/m/community/ajax.php',
                form: {
                    category_id: idOlympiad,
                    a:'fetch_category_data',
                    aops_logged_in:false,
                    aops_user_id:1
                },
                headers:{
                    "Cookie": '__cfduid=da5084780cfe95be141b2d5eecf02c3661497336367; aopsuid=1; aopssid=qUybZoKhi2Jv15005356566443Zlu0uvLPQLbL; _gat=1; cmty_init_time=1500538090; _ga=GA1.2.1595935870.1497336375; _gid=GA1.2.52564398.1500386429; _uetsid=_ueta3e97c31',
                    'Referer':'https://artofproblemsolving.com/community/c14_international_contests'
                }
            },
            (err,res,body) => {
                    // console.log(123, body)
                    // console.log(JSON.parse(body))
                    
                   try {
                       allTypes.years=[]
                        JSON.parse(body).response.category.items.forEach(x => {
                        var yeaar = {'id': x.item_id,
                                    'name': x.item_text,
                                    'type': typetype
                        }
                        allTypes.years.push(yeaar)                                                            
                    })
                    // console.log(allTypes)

                    var counterOfYear=0
                    allTypes.years.forEach(year => {
                            if (typetype == year.type) {
                                idofText = year.id
                                var yearyear = year.name
                            }
                        if (counterOfYear < 40) {
                            putText(counterOfYear,counterOfScale, counterOfName, yearyear,section, typetype, idofText)
                        }
                        counterOfYear++
                    })   
                    console.log('good') 
                   }
                catch(e) {
                    console.log('error')
                }
            })
}
function putText(counterOfYear, counterOfScale, counterOfName, yearyear, section, typetype, idofText) {
    var ref = firebase.database().ref().child(section + '/' + typetype + '/' + yearyear)
    request.post({
        url: 'https://artofproblemsolving.com/m/community/ajax.php',
        form: {
            category_id:idofText,
            a:'fetch_category_data',
            aops_logged_in:false,
            aops_user_id:1
        }                                                    
    },
    (err,res,body) => {
        try {
           
            var items = JSON.parse(body).response.category.items
        // allTypes.text.push(items[0].post_data.category_name)
        var nomera =[]
        var nechislo = 101
        var kolichestvo = 0
        allTypes.text=[]
        for (var counterZadach=0;counterZadach<100;counterZadach++) {
            nomera.push(counterZadach)
        }
        for (var i=0; i<items.length; i++){
            var chislo = 0
            nomera.forEach(x => {
                if (x==items[i].item_text) {
                   chislo = 1
                }
            })
            if (chislo == 1) {
                var text = ' '
                text += items[i].item_text + '.'
                text += '  '
                text += items[i].post_data.post_canonical
                text += os.EOL
                //text += items[i].post_data.category_name.toString()
                text += ''
                if (nechislo > i) {
                    zadachi = {'uslovie':text,
                       'nomer':items[i].item_text,
                        'day':1
                    }
                }
                else {
                    zadachi = {'uslovie':text,
                                'nomer':items[i].item_text,
                                'day':2
                    }
                }
                allTypes.text.push(zadachi)
                var reff = ref.child(i)
                reff.update(zadachi)
            }
            else {
                nechislo = i
            }
        }
        console.log('good')
        }
        catch(e) {
            console.log('Error')
        }
        
    })
}
// var requestLoop = setInterval(function(){aops()},60000*60)
var requestLoop = setInterval(function(){aops()},240000)
console.log('server is started')
module.exports = app
