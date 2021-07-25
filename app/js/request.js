const axios = require('axios');



const destino = "http://localhost:3000";
// const destino = "https://www.acueducto.com.co/depuracionpredial/bienes-raices";

//const destino="https://nowsoft.app/bienes-raices";

export function servidorPost(uri,datos){

    let data = {};
    Object.keys(datos).forEach((d,i) => {
        // console.log(datos[d]);
        // console.log(d)
        // console.log(i)
        var value = datos[d].toString();
        // var vr = value.replace("%","\%");
        // console.log(value)
        // console.log(vr)
        // if(datos[d].includes("%")){
        //     datos[d].replace("%","\%");
        // }
        data[d] = value;
    })

    // console.log(data);


    return axios({
        method: 'post',
        url: destino+uri,
        data: data,
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