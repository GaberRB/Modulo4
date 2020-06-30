const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')


exports.index =  function(req, res){
    
    return res.render('instructors/index', {instructors: data.instructors})
}
exports.show = function(req, res){
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if ( !foundInstructor ) return res.send("Instrutor não encontrado")

    const instructor = {
        ...foundInstructor, // espalha o resto das keys do objeto
        age: age(foundInstructor.birth),
        services:foundInstructor.services.split(','), //transformando em um array
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render('instructors/show',{ instructor })
}
exports.create = function(req, res){
    return res.render('instructors/create')
}
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

        return res.redirect(`/instructors/${id}`)

    })

    //return res.send(req.body)
}
exports.edit = function(req, res){

    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if ( !foundInstructor ) return res.send("Instrutor não encontrado")

    const instructor = {
        ...foundInstructor,
        birth:date(foundInstructor.birth)
    }

    return res.render('instructors/edit', { instructor })
}
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if(instructor.id == id){
            index = foundIndex

            return true
        }
    })

    if ( !foundInstructor ) return res.send("Instrutor não encontrado")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write error!')

        return res.redirect(`/instructors/${id}`)
    })

}
exports.delete = function(req, res){
    const {id} = req.body

    const filteredInstructor = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructor

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file error')

        return res.redirect('/instructors')
    })
}