const axios = require('axios');




//const destino = "http://localhost:3000"

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
        return axios.get(destino+uri,{withCredentials: true}).then(resp => {
        return(resp.data);
    });
}

export function redireccionar(error){
    if(error.response.status==403){
        window.location.href = 'bienes-raices/web/login';
    }
}

export function servidorDocs(uri, datos) {

    console.log(datos)
    
    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: true,
        responseType: 'blob',
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','reporte.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();
    });
}


export const url = destino;