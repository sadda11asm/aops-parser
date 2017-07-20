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
var int = ref.child('international')
var nar = ref.child('national and regional')
var und = ref.child('undergraduate')
var nat = ref.child('national')
var tst = ref.child('tst')
var jnr = ref.child('junior')
var nec = ref.child('new')

app.all('/version', (req,res) =>
    {
        res.send('v. 0.0.3')
    })

var types = [14,16,15,58,59,62,116]
var scales = ['international','nationalandregional', 'undergraduate','national', 'tst', 'junior', 'new']
var refer = ['int', nar, und,nat,tst,jnr,nec]
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
    function vyvestiBezTypov() {
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
                            if (x.type == sections) {
                                allTypes.olymp.push(x)
                                category.push(x.id)
                            }

                        })
                    console.log(allTypes)
                    resp.json(allTypes)
            }
    })
    }
    }
    function vyvestiBezTexta() {
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
                                if (x.type == sections) {
                                    allTypes.olymp.push(x)
                                    category.push(x.id)
                                }

                            })
                            console.log(allTypes)
                        // resp.json(allTypes)
                            var index=0
                            allTypes.olymp.forEach( x => {
                                if (index == type) {
                                    idOlympiad = x.id
                                    idParent = x.parentId
                                } else { idOlympiad == 3222}
                                index++
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
                                    })
                                    console.log(allTypes)
                                    resp.json(allTypes)
                        }
                })
            }
        }
    function vyvestiVse() {
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
                            if (x.type == sections) {
                                allTypes.olymp.push(x)
                                category.push(x.id)
                            }
                        })
                    console.log(allTypes)
                    // resp.json(allTypes)
                    var index = 0
                    allTypes.olymp.forEach(x => {
                        if (index == type) {
                            idOlympiad = x.id
                            idParent = x.parentId
                        }
                        else { idOlympiad == 3222}
                        index++
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
                                    var indexx = 0
                                    allTypes.years.forEach(x => {
                                        if (indexx == year) {
                                            idofText = x.id
                                        }
                                        indexx++
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
                                                        zadachi = {'uslovie':text,
                                                                        'nomer':items[i].item_text,
                                                                        'day':1}
                                                    }
                                                    else {
                                                        zadachi = {'uslovie':text,
                                                                        'nomer':items[i].item_text,
                                                                        'day':2}
                                                    }

                                                    allTypes.text.push(zadachi)
                                            }
                                            else {
                                                nechislo = i
                                            }
                                        }
                                        resp.json(allTypes)
                                        // PushToFire(sections, type, year)
                                    })

                            })
                                console.log(allTypes)
                        }
                })
        }
    }
    // function PushToFire(s, t, y) {
    //     var message = allTypes.text
    //     var de = refer[s].child(t)
    //     var dee = de.child(y)
    //     dee.set(message)
    // }

    if (sections && type && year) {
        vyvestiVse()
    }  else {
        if (sections && type) {
            vyvestiBezTexta()
        } else {
             if (sections) {
                vyvestiBezTypov()
             }
             else {
                resp.send("Error")
             }
        }
    }
    })
}
var requestLoop = setInterval(function(){aops()},6000)
console.log('server is started')



module.exports = app
