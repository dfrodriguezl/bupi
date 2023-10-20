const axios = require('axios');



const destino = "http://localhost:3000";
// const destino = "http://172.19.26.22/predios";
// const destino = "http://161.35.107.85/bienes-raices";
// const destino = "https://www.acueducto.com.co/depuracionpredial/bienes-raices";
// const destino = "http://192.168.56.10/bienes-raices";
//const destino="https://nowsoft.app/bienes-raices";
// const destino = "http://bupi.invias.col/predios";

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

export function servidorGetAbs(uri){

    return axios({
        method: 'get',
        url: uri,
        withCredentials: true
        })
}

export function redireccionar(error){
    if(error.response.status==403){
        window.location.href = 'predios/web/login';
    }
}

export function servidorDocs(uri, datos) {

    // console.log(datos)
    
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
            return response;
    });
}

export function servidorDocs2(uri, datos) {

    // console.log(datos)
    
    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: true,
        responseType: 'blob',
        }).then(response => {
            return response;
    });
}


export const url = destino;