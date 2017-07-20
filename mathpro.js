const express = require('express')  
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const firebase = require('firebase').initializeApp({
    serviceAccount:"./MathPro-db7f48576e54.json",
    databaseURL:"https://mathpro-c58e7.firebaseio.com"
})
var os = require('os')
app.all('/version', (req,res) =>
    {
        res.send('v. 0.0.3')
    })
var allTypes = {
            'success':true,
            'olymp':[],
            'years':[],
            'text':[]
}
var idOlympiad
var idParent
var idofText
var types = [14,16,15,58,59,62,116]
var scales = ['international','nationalandregional', 'undergraduate','national', 'tst', 'junior']
function aops() {
    var counterOfScale = 0
    scales.forEach(section => {       
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
                    'type':section,
                    'parentId': JSON.parse(body).response.categories.category_id
                    }
                allTypes.olymp.push(NameOfOlymp) 
            })
                 var counterOfName=0
                allTypes.olymp.forEach(type => {
                    if(type.type == section) {
                        idOlympiad = type.id
                    }
                    if (counterOfName <20) {
                        putYears(section,counterOfScale, type, counterOfName, idOlympiad)
                    }
                    counterOfName++        
                })
                // console.log(allTypes)
        })
}
function putYears(section,counterOfScale, type, counterOfName, idOlympiad) {
            var ref = firebase.database().ref().child(counterOfScale + '/' + counterOfName)
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
                    // console.log(123, body)
                    //  console.log(JSON.parse(body))
                    allTypes.years=[]
                     ref.remove()
                    JSON.parse(body).response.category.items.forEach(x => {
                        
                        var yeaar = {'id': x.item_id,
                                    'name': x.item_text,
                                    'type': type.type
                        }
                        allTypes.years.push(yeaar)
                        ref.push(yeaar)                                                         
                    })
                   

                    // var counterOfYear=0
                    // allTypes.years.forEach(year => {
                    //         if (type.type == year.type) {
                    //             idofText = year.id
                    //         }
                    //     putText(counterOfYear,counterOfScale, counterOfName, year,section, type, idofText)
                    //     counterOfYear++
                    // })    
            })
}
aops()

module.exports = app