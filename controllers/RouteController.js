const Route = require('../models/Route')
const axios = require('axios')

module.exports = (req,res)=>{
    let route = []
    axios.get('https://pilgrimtests.000webhostapp.com/mockapi/getall/',function(response){
        response.on('route',d=>{
            route.push(d)
        }).on('error',e=>{console.log(e)})
        response.on('end',()=>{
            let fetchedRoute = JSON.parse(Buffer.concat(route).toString())
            console.log(fetchedRoute)
            let result = new Route({
                entries:fetchedRoute.entries
            })
            result.save()
            .then(result=>{
                console.log('Entry saved');
            })
            .catch(err =>{
                console.log(err)
            })
            res.send(result)
        })
    })
}
