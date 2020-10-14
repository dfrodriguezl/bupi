const axios = require('axios');




//const destino = "http://localhost:3000/bienes-raices"

const destino="https://nowsoft.app/bienes-raices";



export function servidorPost(uri,datos){


    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: true
        })

}

export function servidorGet(uri){
        return axios.get(uri).then(resp => {
        return(resp.data);
    });
}

export function redireccionar(error){
    if(error.response.status==403){
        window.location.href = destino+'/html/login.html';
    }
}




export const url = destino;