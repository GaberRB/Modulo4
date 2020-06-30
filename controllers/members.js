const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')


exports.index =  function(req, res){
    
    return res.render('members/index', {members: data.members})
}
exports.show = function(req, res){
    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if ( !foundMember ) return res.send("Instrutor não encontrado")

    const member = {
        ...foundMember, // espalha o resto das keys do objeto
        age: age(foundMember.birth)
        
    }

    return res.render('members/show',{ member })
}
exports.create = function(req, res){
    return res.render('members/create')
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

    const id = Number(data.members.length +1)
    birth = Date.parse(birth)
    const created_at = Date.now()

    data.members.push({
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

        return res.redirect(`/members/${id}`)

    })

    //return res.send(req.body)
}
exports.edit = function(req, res){

    const { id } = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if ( !foundMember ) return res.send("Membro não encontrado")

    const member = {
        ...foundMember,
        birth:date(foundMember.birth)
    }

    return res.render('members/edit', { member })
}
exports.put = function(req, res){
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){
        if(member.id == id){
            index = foundIndex

            return true
        }
    })

    if ( !foundMember ) return res.send("Membro não encontrado")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send('Write error!')

        return res.redirect(`/members/${id}`)
    })

}
exports.delete = function(req, res){
    const {id} = req.body

    const filteredMember = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMember

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file error')

        return res.redirect('/members')
    })
}