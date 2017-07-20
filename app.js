const express = require('express')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const firebase = require('firebase').initializeApp({
    serviceAccount:"./MathPro-db7f48576e54.json",
    databaseURL:"https://mathpro-c58e7.firebaseio.com"
})
var os = require('os')
var ref = firebase.database().ref().child('Scale-of-olympiad')

app.all('/version', (req,res) =>
    {
        res.send('v. 0.0.3')
    })

var types = [14,16,15,58,59,62,116]
var scales = ['international','nationalandregional', 'undergraduate','national', 'tst', 'junior', 'new']
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
    function vyvestiVse() {
                var perviy = 0
                types.forEach(x => {
                    fetchTypes(x, perviy)
                    perviy++
                })
                console.log(allTypes);
    }
    // function PushToFire(s, t, y) {
    //     var message = allTypes.text
    //     var de = refer[s].child(t)
    //     var dee = de.child(y)
    //     dee.set(message)
    // }
    function fetchTypes(x, perviy) {
        request.post({
            url: 'https://artofproblemsolving.com/m/community/ajax.php',
            form: {
                sought_category_ids:x,
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
                    'type':nomer,
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
                    allTypes.olymp.push(x)
                })
                // resp.json(allTypes)
                var index = 0
                allTypes.olymp.forEach(x => {
                    fetchYears(x.id, index, nomer, perviy)
                    index++
                })
            }
        })
    }
    function fetchYears(y, k, n, perviy) {
        request.post({
            url: 'https://artofproblemsolving.com/m/community/ajax.php',
            form: {
                category_id: y,
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
                                'name': x.item_text,
                                'type':n,
                                'podtype':k}
                                allTypes.years.push(year)
                })
                var indexx=0
                allTypes.years.forEach(x => {
                    fetchText(x.id, indexx, k , n, perviy)
                    indexx++
                })
        })
    }
    function fetchText(z, indexx, podt, typ, perviy) {
        request.post({
            url: 'https://artofproblemsolving.com/m/community/ajax.php',
                    form: {
                        category_id:z,
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
            var nomera =[]
            var nechislo = 101
            var kolichestvo = 0
            for (var t=0;t<100;t++) {
                nomera.push(t)
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
                            zadachi = {     'podpodtype':h,
                                            'podtype':podt,
                                            'type':typ,
                                            'uslovie':text,
                                            'nomer':items[i].item_text,
                                            'day':1}
                        }
                        else {
                            zadachi = {    'podpodtype':h,
                                            'podtype':podt,
                                            'type':typ,
                                            'uslovie':text,
                                            'nomer':items[i].item_text,
                                            'day':2}
                        }

                        allTypes.text.push(zadachi)
                        var ref = firebase.database().ref().child(perviy + '/' + index + '/' + indexx)
                        ref.update(zadachi)
                }
                else {
                    nechislo = i
                }
            }
            // PushToFire(sections, type, year)
        })
    }
var requestLoop = setInterval(function(){vyvestiVse()},6000)
console.log('server is started')



module.exports = app
