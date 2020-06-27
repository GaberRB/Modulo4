module.exports = {
    age: function age(timestamp){
        const today = new Date()  //instanciando 
        const birthDate = new Date(timestamp)
    
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
        
    
        if ( month < 0 || month == 0  && today.getDate() < birthDate.getDate()){
            age = age - 1
        }
    
        return age
    },
    date: function(timestamp){
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()

        const month = `0${date.getUTCMonth() + 1}`.slice(-2)  //o mes vai de 0 a 11 em js

        const day = `0${date.getUTCDate()}`.slice(-2) 

        return `${year}-${month}-${day}`
    }

}
