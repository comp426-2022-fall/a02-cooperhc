#!/usr/bin/env node
//store vargs in args array

import minimist from 'minimist'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

const args = minimist(process.argv.slice(2))


if(args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)
    process.exit(0)
}
async function getData(link){
    const response = await fetch(link)
    const data = await response.json()
    if (args.j){
        console.log(data)
    }
    else{
        var d = 1
        if(args.d == undefined){
            d = 1
        }
        else{
            d = args.d
        }
        var ss = ''
        if(data.daily.precipitation_hours[d] == 0){
            ss = ('You will not need your galoshes')
        }
        else{
            ss = ('You might need your galoshes')
        }
        if(d == 0){
            console.log(ss + ' today.')
        }
        else if(d > 1){
            console.log(ss + " in " + days + " days.")
        }
        else{
            console.log(ss + " tomorrow.")
        }
        
    }
    return await data
}

function createLink(){
    //define lat / long 
    var latitude = 40.71
    var longitude = -74
    if(args.n != undefined || args.s != undefined){
        if(args.n != undefined){
            latitude = args.n
        }
        else{//s
            latitude = args.s * -1
        }
    }
    
    if(args.w != undefined || args.e != undefined){
        if(args.e != undefined){
            longitude = args.e            
        }
        else{//e
            longitude = args.w * -1
        }
    }
    
    //timezone
    const tz = args.z || moment.tz.guess()
    
    var one = ''
    var two = ''
    var i = 0
    while(tz[i] != '/'){
        one = one.concat(tz[i])
        i++
    }
    i++
    while(tz[i] != undefined){
        two = two.concat(tz[i])
        i++
    }
    
    //create link
    const t ='https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&timezone=' + one + '%2F' + two
    return t

}

const link = createLink()
getData(link)


//output (also based on j)





