const express = require('express')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const firebase = require('firebase').initializeApp({
    serviceAccount:"./NewPro-24e34c8abaf6.json",
    databaseURL:"https://choco-1999.firebaseio.com/"
})
site =  "https://chocolife.me/"
request.post({
            url: '',
            form: {
                page:1,
                page_size:12,
                q:'Назарбаев Университет',
                region_id:68,
                viewpoint1:71.16394042968751,51.273514645715544,
                viewpoint2:71.78604125976564,51.00511401428095,
                locale:'ru_KZ',
                fields:dym,request_type,items.adm_div,items.attribute_groups,items.contact_groups,items.flags,items.address,items.rubrics,items.name_ex,items.point,items.region_id,items.external_content,items.org,items.group,items.schedule,items.ads.options,items.stat,context_rubrics,widgets,filters,items.reviews,search_attributes,
                key:'rutnpt3272'
            }
        },
        (err,res,body) => {
