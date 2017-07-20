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
    'text' : []
}
var types = [14,16,15,58,59,62,116]
var scales = ['international','nationalandregional', 'undergraduate','national', 'tst', 'junior', 'new']
function aops() {
    //  var ref = firebase.database().ref().child(294448)
    request.post({
        url: 'https://artofproblemsolving.com/m/community/ajax.php',
        form: {
            category_id:294448,
            a:'fetch_category_data',
            aops_logged_in:false,
            aops_user_id:1      
        }                                                    
    },
    (err,res,body) => {
        // try {
        var items = JSON.parse(body).response.category.items
        // allTypes.text.push(items[0].post_data.category_name)
        var nomera =[]
        var nechislo = 101
        var kolichestvo = 0
        for (var counterZadach=0;counterZadach<100;counterZadach++) {
            nomera.push(counterZadach)
        }
        allTypes.text=[]
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
                // ref.update(zadachi)
            }
            else {
                nechislo = i
            }
        }
        // }
        // catch(e) {
            // console.log(body)
        // }
        console.log(allTypes)
    })
}
arrayOfIds = [3222,3223,3224,3226,3267,3225,3231,3242,3230,3234]
// arrayOfIds.forEach(x => {
    aops()
// })
console.log('server is started')



module.exports = app
