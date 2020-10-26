import { servidorPost } from '../js/request'

export function getPermisos() {
    

    var permisos=""
    var data = { "id_consulta": "get_permisos" }
    
    return servidorPost('/backend/', data).then((response) => {
        
        permisos = response.data[0].permisos;
        return permisos;

    })

    

}
