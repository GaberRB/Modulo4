const fs = require('fs')
const data = require('./data.json')

exports.post = function(req, res){
    //cria uma array de chaves
    const keys = Object.keys(req.body)

    for (key of keys ){
        //req.body.percorre cada chave do array
        if (req.body[key] == "" ) //quando o if tem apenas uma linha não precisa do bloco {}
            return res.send('Preencha todos os campos')
    }
        //destruction
    let {avatar_url, birth, name, services, gender} = req.body

    const id = Number(data.instructors.length +1)
    birth = Date.parse(birth)
    const created_at = Date.now()

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile('data.json',JSON.stringify(data, null, 2), function(err){
        if(err) {
            return res.send('write file error')
        }            

        return res.redirect('/instructors')

    })

    //return res.send(req.body)
}