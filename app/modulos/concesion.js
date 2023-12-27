import React, { useState, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';

import { useParams } from 'react-router-dom'

import { url, servidorPost, servidorGetAbs } from '../js/request'


import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import DeleteIcon from '@material-ui/icons/Delete';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

import { useForm, Controller } from "react-hook-form";

import { getPermisos } from '../variables/permisos'


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactSelect from "react-select";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { FlujoSan } from './saneamientos/flujo_san'


import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var moment = require('moment');
import date from 'date-and-time';

import Popup from 'reactjs-popup';

import CargueDocumentos from './cargue_expedientes'
import { notificacion } from '../variables/notificaciones';
import ListaComunicados from './lista_comunicados';
import EditarComunicado from './editar_comunicado';
import EncabezadoSaneamiento from './componentes/encabezado_saneamiento';
import ExcelAll from './componentes/excell_all';
import RenderSelect from './componentes/render_select';
import CurrencyInput, { formatValue } from 'react-currency-input-field';
import CheckMultiple from './componentes/check_multiple';
import { ErrorMessage } from '@hookform/error-message';
import PopupAdvertencia from './popup_advertencia';


const gestionPermisos = (index) => {


    var tipo_permiso = [0];
    if (index == 17) {
        tipo_permiso = [6, 7, 11];
    } else if (index == 19) {
        tipo_permiso = [6, 7, 11];
    }
    else if ([1, 2, 3, 4].includes(index)) {

        tipo_permiso = [18];//editar formulario técnico  
    } else if ([5, 6, 15, 16, 20, 21, 22, 14].includes(index)) {

        tipo_permiso = [7];//editar formulario juridico  
    } else if ([7].includes(index)) {
        tipo_permiso = [5];//revisar formulario juridico    
    } else if ([8].includes(index)) {
        tipo_permiso = [4];//revisar formulario tecnico    
    } else if ([24, 25, 26, 27, 28, 29, 30, 31, 32, 33].includes(index)) {
        tipo_permiso = [11];//editar formulario social 
    } else if ([36].includes(index)) {
        tipo_permiso = [12];
    } else if ([38].includes(index)) {
        tipo_permiso = [13];
    } else if ([37].includes(index)) {
        tipo_permiso = [14];
    } else if ([39].includes(index)) {
        tipo_permiso = [15];
    } else if ([40].includes(index)) {
        tipo_permiso = [16];
    } else if ([43].includes(index)) {
        tipo_permiso = [17];
    } else if ([11].includes(index)) {
        tipo_permiso = [12];
    } else if ([44].includes(index)) {
        tipo_permiso = [2];
    }


    return tipo_permiso;

}



const DatePicker = ({ selected, onChange }) => {
    const [fecha, setDate] = React.useState(selected);

    return (
        <ReactDatePicker
            className="form_input"
            selected={fecha}
            onChange={fecha => {
                setDate(fecha);
                onChange(fecha);
            }}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
        />
    )
};



const Form = ({ tbl, index, refresh, consecutivo }) => {


    const [fields, setFields] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [lectura, setLectura] = React.useState(true);
    const [view, setView] = React.useState(false);
    const [defecto, setDefecto] = React.useState(true);
    const [permiso, setpermiso] = React.useState(false);
    const [reload, setReload] = React.useState(false);
    const [listaValidacion, setListaValidacion] = React.useState({});
    const [valueTexto, setValueTexto] = React.useState({});
    const [externalData, setExternalData] = React.useState({});
    const [listDomains, setListDomains] = React.useState({});
    const [chip, setChip] = React.useState(null);
    const [textDomains, setTextDomains] = React.useState({});
    const [superTec, setSuperTec] = React.useState(false);
    const [superJur, setSuperJur] = React.useState(false);
    const [saneamientoSeleccionado, setSaneamientoSeleccionado] = React.useState(null);
    // const [inputValue, setInputValue] = useState('');



    let { id } = useParams();

    const { register, handleSubmit, watch, control, errors, setValue, formState: { isValid, isDirty} } = useForm({
        mode: 'onChange'
    });
    const isFormEdited = isDirty;

    const registerOptions = {
        titular: { required: "Role is required" }
    };

    useEffect(() => {
        // console.log("cambios")
        setView(false)
        setpermiso(false)

        const getBloqueo = (id_exp) => {


            const data = {
                codigo_bupi: id_exp,
                id_consulta: 'get_observacion'
            }

            return servidorPost('/backend', data);
        }

        var data = {
            "id_consulta": "info_header_form",
            "codigo_bupi": id,
        }

        // console.log(data)

        servidorPost('/backend', data).then((response) => {
            // setChip(response.data[0].chip_cat)
        })

        // useEffect(() => {

        //     var data = {
        //         "id_consulta": "info_header_form",
        //         "codigo_bupi": id,
        //     }

        //     // console.log(data)

        //     servidorPost('/backend', data).then((response) => {
        //         setChip(response.data[0].chip_cat)
        //     })



        // }, [false])

        if (index > 0) {



            var data = {
                "id_consulta": tbl,
                "id_concesion": id,
                "consecutivo": consecutivo
            }

            servidorPost('/backend', data).then((response1) => {

                var data = {
                    "tabla": index,
                    "id_consulta": "get_formulario_concesion",
                    "id_concesion": id
                }
                // console.log("datos primero")
                // console.log(response1)

                servidorPost('/backend', data).then((response) => {

                    var datos = response.data;

                    // console.log("estructura segundo")
                    // console.log(datos)

                    var datosNorm = datos.map((v) => {
                        // console.log(v)
                        if (v.doc.enum != null) {
                            v.doc.enum.push({ value: null, label: null, padre: null, padre_valor: null })
                        }
                        return v;
                    }, [])

                    // console.log("estructura tercero")
                    // console.log(datosNorm)



                    var tipo_permiso = gestionPermisos(index);

                    console.log("tipo_permiso", tipo_permiso)

                    getPermisos().then((response) => {

                        if (response.some(r => r === 4)) {
                            setSuperTec(true)
                        }

                        if (response.some(r => r === 5)) {
                            setSuperJur(true)
                        }

                        if (response.some(r => r == 10)) {

                            setpermiso(true)
                            setLectura(false)
                        } else {
                            console.log("res", response.some(r => tipo_permiso.includes(r)))

                            setpermiso(response.some(r => tipo_permiso.includes(r)))

                            if (response.some(r => r === 17) || response.some(r => r === 12) && response.some(r => tipo_permiso.includes(r)) == true){
                                setLectura(false)
                            } else {
                                let responseUp = response;

                                var data = { id_consulta: index === 39 || index === 40 ? 'tengo_predio_saneamiento' : 'tengo_predio', codigo_bupi: id }

                                var data = { id_consulta: 'tengo_concesion', id_concesion: id }

                                // servidorPost('/backend', data).then((response) => {
                                //     if (data.id_consulta === "tengo_predio" && !response.data[0].exists) {
                                //         let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                                //         servidorPost('/backend', data2).then((responseSan) => {
                                //             if (responseSan.data[0].exists) {

                                //             } else {

                                //             }
                                //         });
                                //     }
                                // })

                                servidorPost('/backend', data).then((response) => {
                                    getBloqueo(id).then((r) => {
                                        if (r.data.length > 0) {
                                            if (r.data[0].bloqueo_predio) {
                                                setLectura(true)
                                            } else {
                                                if (index === 37 && responseUp.some(r => r == 14)) {
                                                    setLectura(false)
                                                } else {
                                                    if (responseUp.some(r => r == 13)) {
                                                        setLectura(false)
                                                    } else {
                                                        if (!response.data[0].exists) {
                                                            let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                                                            servidorPost('/backend', data2).then((responseSan) => {
                                                                setLectura(!responseSan.data[0].exists)
                                                            })
                                                        } else {
                                                            setLectura(!response.data[0].exists)
                                                        }

                                                    }
                                                }
                                            }
                                        } else {
                                            if (index === 37 && responseUp.some(r => r == 14)) {
                                                setLectura(false)
                                            } else {
                                                if (responseUp.some(r => r == 13)) {
                                                    setLectura(false)
                                                } else {
                                                    if (!response.data[0].exists) {
                                                        let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                                                        servidorPost('/backend', data2).then((responseSan) => {
                                                            setLectura(!responseSan.data[0].exists)
                                                        })
                                                    } else {
                                                        setLectura(!response.data[0].exists)
                                                    }

                                                }
                                            }
                                        }

                                    })

                                    // console.log("lectura")
                                });
                            }

                            // if (response.some(r => tipo_permiso.includes(r)) == false) {
                            //     let responseUp = response;

                            //     var data = { id_consulta: index === 39 || index === 40 ? 'tengo_predio_saneamiento' : 'tengo_predio', codigo_bupi: id }

                            //     var data = { id_consulta: 'tengo_predio', codigo_bupi: id }

                            //     // servidorPost('/backend', data).then((response) => {
                            //     //     if (data.id_consulta === "tengo_predio" && !response.data[0].exists) {
                            //     //         let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                            //     //         servidorPost('/backend', data2).then((responseSan) => {
                            //     //             if (responseSan.data[0].exists) {

                            //     //             } else {

                            //     //             }
                            //     //         });
                            //     //     }
                            //     // })

                            //     servidorPost('/backend', data).then((response) => {
                            //         getBloqueo(id).then((r) => {
                            //             if (r.data.length > 0) {
                            //                 if (r.data[0].bloqueo_predio) {
                            //                     setLectura(true)
                            //                 } else {
                            //                     if (index === 37 && responseUp.some(r => r == 14)) {
                            //                         setLectura(false)
                            //                     } else {
                            //                         if (responseUp.some(r => r == 13)) {
                            //                             setLectura(false)
                            //                         } else {
                            //                             if (!response.data[0].exists) {
                            //                                 let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                            //                                 servidorPost('/backend', data2).then((responseSan) => {
                            //                                     setLectura(!responseSan.data[0].exists)
                            //                                 })
                            //                             } else {
                            //                                 setLectura(!response.data[0].exists)
                            //                             }

                            //                         }
                            //                     }
                            //                 }
                            //             } else {
                            //                 if (index === 37 && responseUp.some(r => r == 14)) {
                            //                     setLectura(false)
                            //                 } else {
                            //                     if (responseUp.some(r => r == 13)) {
                            //                         setLectura(false)
                            //                     } else {
                            //                         if (!response.data[0].exists) {
                            //                             let data2 = { id_consulta: 'tengo_predio_saneamiento', codigo_bupi: id };
                            //                             servidorPost('/backend', data2).then((responseSan) => {
                            //                                 setLectura(!responseSan.data[0].exists)
                            //                             })
                            //                         } else {
                            //                             setLectura(!response.data[0].exists)
                            //                         }

                            //                     }
                            //                 }
                            //             }

                            //         })

                            //         // console.log("lectura")
                            //     });
                            // } else {
                            //     setLectura(false)
                            // }                            


                        }
                    })


                    if (response1.data.length > 0) {
                        response1.data.map((rd1) => {
                            if (index === 40 && rd1.saneamiento != null) {
                                setSaneamientoSeleccionado(rd1.saneamiento)
                            }

                        }, [])
                        setFields({ data: datosNorm, info: response1.data[0] });

                        setView(true)
                        datos.map((f) => {
                            if (f.doc.form === 'texto' && f.doc.listener === 'change') {
                                let json = {}
                                json[f.doc.field] = response1.data[0][f.doc.field];
                                setValueTexto(json)
                            }
                        })
                    } else {
                        setView(false)
                    }





                })


            })
        }

    }, [index, refresh, reload]);

    const getRegex = (str) => {
        /*
        var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        var str = regex.toString(); 
        */

        if (str) {
            var parts = /\/(.*)\/(.*)/.exec(str);
            var restoredRegex = new RegExp(parts[1], parts[2]);
            // console.log(restoredRegex)
            return restoredRegex;

        } else {
            return str;
        }

    }








    const onSubmit = datos => {

        console.log("datos-------")
        console.log(datos)
        var data = datos;
        // console.log("TBL", index)


        Object.keys(data).forEach(function (key) {

            var item = fields.data.filter(item => item.doc.field == key).map(item => {
                return item.doc.form
            });

            var itemMoneda = fields.data.filter(item => item.doc.field == key).map(item => {
                return item.doc.moneda
            });

            if (data[key] != "") {
                if (Array.isArray(data[key])) {
                    // console.log("array")
                    // var item = fields.data.filter(item => item.doc.field == key).map(item => {
                    //     return item.doc.form
                    // });
                    // console.log(item)


                    if (item[0] === "select") {

                        if (data[key][0] === null) {
                            data[key] = null

                        } else {
                            // console.log(data[key][0].value)
                            data[key] = data[key][0].value

                        }
                    }
                    else if (item[0] === "select_multiple") {

                        var arr = data[key].map(item => { return item.value });

                        data[key] = arr;

                    }

                }
                else {
                    if (item[0] === "select") {
                        if (data[key] === null || data[key] === undefined) {
                            data[key] = null

                        } else {

                            data[key] = data[key].value

                        }
                    }
                }
            } else {
                if (item == "select" || item == "fecha" || item == "numero" || item == "consulta") {
                    data[key] = null
                }
            }

            if (typeof data[key] === 'undefined') {
                delete data[key];
            }

            if (itemMoneda[0]) {
                // console.log("DATA KEY", data[key])
                if (data[key] !== null || data[key] === '') {
                    data[key] = parseFloat(data[key].replaceAll(".", "").replaceAll("$", "").replaceAll(",", "."));
                }

            }
        });
        // console.log(data)

        if (index === 37) {
            if (data.fecha_sol_usu_prestamo != null && data.fecha_dev_usu_prestamo == null) {
                // Insertar notificacion (tarea) para agregar tarea
                let dataNot = data;
                dataNot.ruta = -2;
                const usuario_prestamo = data.usuario_prestamo;
                servidorPost('/backend', {
                    id_consulta: "check_prestamo",
                    tarea_next: 8,
                    ruta_destino: 13,
                    usuario: usuario_prestamo,
                    codigo_bupi: id
                }).then(function (response) {
                    const exists = response.data[0].exists;
                    if (!exists) {
                        notificacion({
                            codigo_bupi: id,
                            usuario_prestamo: usuario_prestamo,
                            ruta: -2
                        });
                        delete dataNot.ruta;
                        delete dataNot.opcion;
                        delete dataNot.id_consulta;
                        delete dataNot.tarea_next;
                        delete dataNot.ruta_destino;
                        delete dataNot.usuario;
                        delete data.ruta;
                    }

                    // if(data){
                    //     delete data.ruta;
                    // }

                })


            } else if (data.fecha_sol_usu_prestamo != null && data.fecha_dev_usu_prestamo != null) {
                // TODO Cerrar tarea de préstamo
                let dataNot = data;
                dataNot.ruta = -3;
                notificacion(dataNot)
                delete dataNot.ruta;
                delete dataNot.id_consulta;
                delete dataNot.usuario_prestamo;
                delete dataNot.opcion;
            }
        }


        delete data.ruta;

        var key = ""
        for (var k in data) {
            key = key + k + "=$" + k + ","
        }
        key = key.replace(/,\s*$/, "");
        data.upd = key
        data.id_consulta = "update_" + tbl;
        data.id_concesion = id;

        let data_guardar = data;

        servidorPost('/backend', data).then(function (response) {
            var result = response.data;
            if (result == "error") {
                console.log(response, "respuesta");
                toast.error("Hubo un error al almacenar");

            } else {
                toast.success("Información almacenada de: " + result[0].id_concesion);
                // validar(index, result[0].codigo_bupi, data_guardar)
                // validar(index,result[0].codigo_bupi)
            }
        });

        data = null

    };




    const change = (msg, e) => {
        // console.log("MSG", msg);
        // let value = msg[0].value;
        let value = msg.value;
        if (e.child_domain != null) {
            let fieldChild = fields.data.filter((f) => f.doc.enum_name == e.child_domain);
            // console.log(fieldChild[0].doc.enum)
            let valuesChild = fieldChild[0].doc.enum.filter((v) => v.padre_valor == value || v.padre_valor == null);
            let dominios = {};
            dominios[e.field_child] = valuesChild;
            setListDomains(dominios);
        }

        if (e.caso_especial != null) {
            if (e.caso_especial.includes("accion_saneamiento")) {
                // console.log("CASO ESPECIAL", e)
                // console.log("MSG", msg)
                const dataSaneamiento = {
                    id_consulta: 'get_descripcion_saneamientos',
                    accion_saneamiento: msg.value,
                    dominio: e.enum_name
                }
                servidorPost('/backend', dataSaneamiento).then(function (response) {
                    // console.log("RESPONSE ENUM", response)
                    const childs = e.field_child.split(",");
                    // console.log("CHILDS", childs);
                    setTextDomains({
                        [childs[0]]: response.data[0][childs[0]],
                        [childs[1]]: response.data[0][childs[1]]
                    })
                })
            }

        }

        if (e.field === "saneamiento" && index === 40) {
            setSaneamientoSeleccionado(msg.value)
        }

        return msg;
    }


    const crear_registro = () => {


        var data = {
            "tabla": "maritima." + tbl,
            "id_consulta": "insertar_vacio_concesiones",
            "id_concesion": id
        }


        servidorPost('/backend', data).then((response) => {

            var datos = response.data;

            toast.success("Registro creado: " + datos[0].codigo_bupi);
            setReload(Math.random())
        })



    }
    const handleMultiChange = selectedOption => {
        // console.log(selectedOption)
        //setValue('mot_dev_tec', selectedOption);
        return selectedOption[0];
    };

    // const handleMultiCheckChange = (selectedOption) => {
    //     // console.log(selectedOption)
    //     //setValue('mot_dev_tec', selectedOption);
    //     return selectedOption[0];
    // };

    const default_multiple = (listado, compare) => {

        if (compare !== null) {
            var arr = listado.filter(option => compare.includes(option.value))
            return arr;

        } else {
            return null;
        }


    }

    async function validar(id_form, id_exp, datos_guardar) {
        const data = {
            formulario: id_form,
            expediente: id_exp,
            id_consulta: 'eval_validadores'
        }

        const dataGet = {
            formulario: id_form,
            expediente: id_exp,
            id_consulta: 'get_validadores'
        }

        const dataServicios = {
            id_formulario: id_form,
            id_consulta: 'get_servicios'
        }

        let resultsList = [];

        let resultados_validacion = {};

        // let serv = servidorPost('/backend', dataServicios).then(function (response_servicios) {
        //     let data_res = response_servicios.data;

        //     if (data_res.length > 0) {
        //         let results2 = [];
        //         data_res.forEach((dr) => {
        //             let url_completa = dr.url + "?where=PRECHIP='" + chip + "' and " + dr.query_external + "='" + datos_guardar[dr.query_local] + "'&outFields=*&f=json";
        //             servidorGetAbs(url_completa).then((res_serv) => {
        //                 let features = res_serv.data.features;
        //                 let dataValServ = {
        //                     id_validador: dr.id_validador,
        //                     id_condicion: dr.id_servicio,
        //                     codigo_bupi: id_exp,
        //                     estado: features.length > 0 ? true : false,
        //                     id_consulta: 'insert_valor_validacion'
        //                 }
        //                 // console.log(features)
        //                 // console.log(dataValServ)

        //                 let promise = servidorPost('/backend', dataValServ).then(function (response_insert) {
        //                     return response_insert.data;
        //                 })



        //                 resultsList.push(promise);

        //             })
        //         })
        //     }
        // })

        let promiseJur = servidorPost('/backend', data).then(function (response) {
            return response.data;
        })


        resultsList.push(promiseJur);

        await Promise.all(resultsList).then((r) => {
            servidorPost('/backend', dataGet).then(function (response_2) {
                // console.log("reponse", response_2)
                response_2.data.forEach((v) => {
                    if (resultados_validacion.hasOwnProperty(v.campo)) {
                        resultados_validacion[v.campo].push(v);
                    } else {
                        resultados_validacion[v.campo] = []
                        resultados_validacion[v.campo].push(v);
                    }

                }, []);

                setListaValidacion(resultados_validacion);

            })
        });
    };

    const handleChange = (consulta, e) => {
        let value = e.target.value;
        setValueTexto(value)
        const dataConsulta = {
            proyecto: value,
            id_consulta: consulta
        }

        servidorPost('/backend', dataConsulta).then(function (response) {
            // console.log(response.data[0])
            setExternalData(response.data[0])
        });

    }

    // const matchingOptions = (options) => {
    //     console.log("options", options);
    //     if (inputValue.length >= 4) {
    //         const new_options = options.filter(option => {
    //             if (option.label != null) {
    //                 option.label.includes(inputValue)
    //             }
    //         });
    //         console.log("options newww", new_options)
    //         return new_options;
    //     }
    // }

    // const handleInputChange = (newValue) => {
    //     setInputValue(newValue);
    // }


    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="form-container">

                {view ?



                    <>
                        {/* {console.log("renderizando...")} */}
                        <Fragment>
                            {index === 39 || index === 40 ?
                                <Fragment>
                                    <EncabezadoSaneamiento tipo={index} codigo_bupi={id} consecutivo={consecutivo} />
                                    {/* <FlujoSan tipo={index} consecutivo={consecutivo} /> */}
                                </Fragment>
                                : null}
                        </Fragment>

                        {fields.data.map((i, e) =>


                            <div className="formulario">

                                {index === 40 && i.doc.field === "gravamen" ?
                                    saneamientoSeleccionado === "2" ?
                                        <p className="form_title">{i.doc.label}</p> : null :
                                    (i.doc.type === "hidden" ? null : <p className="form_title">{i.doc.label}</p>)

                                }



                                {i.doc.editable ?
                                    <>

                                        {i.doc.form == 'select' ?

                                            <>


                                                {i.doc.field_father ?

                                                    // <Controller
                                                    //     as={<ReactSelect />}
                                                    //     options={
                                                    //         listDomains[i.doc.field]
                                                    //     }


                                                    //     isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                    //     name={i.doc.field}
                                                    //     isClearable={true}
                                                    //     control={control}
                                                    //     defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                    //     onChange={(e) => {change(e, i.doc)}}
                                                    //     // rules={{
                                                    //     //     required: true
                                                    //     // }}

                                                    // />
                                                    <Controller
                                                        name={i.doc.field}
                                                        control={control}
                                                        defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                        render={(props) =>
                                                            <ReactSelect onChange={(e) => {
                                                                props.onChange(e);
                                                                change(e, i.doc);
                                                            }}
                                                                options={listDomains[i.doc.field]}
                                                                isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                                name={props.name}
                                                                isClearable={true}
                                                                rules={i.doc.required ? { required: i.doc.message } : undefined}
                                                                defaultValue={props.value}
                                                            />
                                                        }
                                                    />
                                                    // <ReactSelect
                                                    //     name={i.doc.field}
                                                    //     isClearable
                                                    //     options={listDomains[i.doc.field]}
                                                    //     defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                    //     onChange={(e) => change(e, i.doc)}
                                                    //     isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                    //     ref={register}
                                                    // /> 
                                                    :

                                                    // <ReactSelect
                                                    //     name={i.doc.field}
                                                    //     isClearable
                                                    //     options={i.doc.enum}
                                                    //     defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                    //     onChange={(e) => change(e, i.doc)}
                                                    //     isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                    //     ref={register}
                                                    //      />

                                                    index === 40 && i.doc.field === "gravamen" ?
                                                        saneamientoSeleccionado === "2" &&
                                                        <Controller
                                                            name={i.doc.field}
                                                            control={control}
                                                            defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                            render={(props) =>
                                                                <ReactSelect onChange={(e) => {
                                                                    props.onChange(e);
                                                                    change(e, i.doc);
                                                                    // if(i.doc.field === "saneamiento" && index === 40){
                                                                    //     setSaneamientoSeleccionado(e.valor)
                                                                    // }
                                                                }}
                                                                    options={i.doc.enum}
                                                                    isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                                    name={props.name}
                                                                    isClearable={true}
                                                                    defaultValue={props.value}
                                                                />
                                                            }
                                                            rules={i.doc.required ? { required: i.doc.message } : undefined}
                                                        />
                                                        : <Controller
                                                            name={i.doc.field}
                                                            control={control}
                                                            defaultValue={defecto ? i.doc.enum.filter(option => (option.value) === String(fields.info[i.doc.field])) : ''}
                                                            render={(props) =>
                                                                <ReactSelect onChange={(e) => {
                                                                    props.onChange(e);
                                                                    change(e, i.doc);
                                                                    // if(i.doc.field === "saneamiento" && index === 40){
                                                                    //     setSaneamientoSeleccionado(e.valor)
                                                                    // }
                                                                    }}
                                                                    options={i.doc.enum}
                                                                    isDisabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                                    name={props.name}
                                                                    isSearchable ={true}
                                                                    // onInputChange={(value) => {
                                                                    //     console.log("value1", value)
                                                                    // }}
                                                                    // onInputChange={handleInputChange}
                                                                    isClearable={true}
                                                                    defaultValue={props.value}
                                                                />
                                                            }
                                                            rules={i.doc.required ? { required: i.doc.message } : undefined}
                                                        />

                                                }

                                            </>

                                            : ''
                                        }

                                        {i.doc.form == 'select_multiple' ?

                                            <>
                                                <Controller
                                                    as={ReactSelect}
                                                    options={
                                                        i.doc.enum
                                                    }
                                                    isDisabled={lectura}
                                                    name={i.doc.field}
                                                    isClearable
                                                    isMulti
                                                    control={control}
                                                    onChange={handleMultiChange}
                                                    defaultValue={defecto ? default_multiple(i.doc.enum, fields.info[i.doc.field]) : ''}
                                                    rules={i.doc.required ? { required: i.doc.message } : undefined}
                                                />
                                            </>

                                            : ''
                                        }

                                        {i.doc.form == 'check_multiple' ?

                                            <>
                                                <CheckMultiple
                                                    isDisabled={lectura}
                                                    name={i.doc.field}
                                                    options={i.doc.enum}
                                                    control={control}
                                                    defaultValue={defecto ? default_multiple(i.doc.enum, fields.info[i.doc.field]) : ''}
                                                // onChange={handleMultiChange}
                                                // ref={register}
                                                />
                                                {/* <Controller 
                                                    as={CheckMultiple}
                                                    control={control}
                                                    isDisabled={lectura}
                                                    name={i.doc.field}
                                                    options={i.doc.enum}
                                                    defaultValue={defecto ? default_multiple(i.doc.enum, fields.info[i.doc.field]) : ''}
                                                    onChange={handleMultiChange}
                                                /> */}
                                            </>

                                            : ''
                                        }

                                        {i.doc.form == 'texto' ?
                                            <>
                                                {/* {console.log("ERT", i.doc.size)} */}
                                                {i.doc.field_father ?
                                                    <input type={i.doc.type}
                                                        className='form_input'
                                                        name={i.doc.field}
                                                        disabled={lectura}
                                                        value={textDomains ? textDomains[i.doc.field] : ''}
                                                        defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                                        ref={register({
                                                            required: i.doc.required ? { required: i.doc.message } : undefined,
                                                            pattern: {
                                                                value: getRegex(i.doc.regex),
                                                                message: i.doc.message,
                                                                maxLength: i.doc.size !== null ? i.doc.size : undefined,
                                                            }
                                                        })} />

                                                    : <input type={i.doc.type}
                                                        className='form_input'
                                                        name={i.doc.field}
                                                        disabled={lectura}
                                                        defaultValue={defecto ? fields.info[i.doc.field] : null}
                                                        maxLength={i.doc.size ? i.doc.size : undefined}
                                                        minLength={i.doc.min_size ? i.doc.min_size : undefined}
                                                        ref={register({
                                                            required: i.doc.required ? i.doc.message : undefined,
                                                            pattern: {
                                                                value: getRegex(i.doc.regex),
                                                                message: i.doc.message,
                                                                maxLength: i.doc.size !== null ? i.doc.size : undefined,
                                                            }
                                                        })} />}

                                                {/* } */}

                                                {errors[i.doc.field] && <span className="msg-error">{errors[i.doc.field].message}</span>}
                                            </>
                                            : ''
                                        }
                                        {i.doc.form == 'numero' ?

                                            i.doc.moneda ?
                                                <CurrencyInput
                                                    name={i.doc.field}
                                                    defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                                    ref={register({
                                                        required: i.doc.required ? i.doc.message : undefined
                                                    })}
                                                    prefix="$"
                                                    decimalSeparator=","
                                                    groupSeparator="."
                                                />
                                                : <input type="text"
                                                    pattern="[0-9.]+"
                                                    name={i.doc.field}
                                                    disabled={lectura}
                                                    defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                                    ref={register({ 
                                                        required: i.doc.required ? i.doc.message : undefined,
                                                        min: 0 })} />
                                            : ''
                                        }
                                        {i.doc.form == 'area' ?

                                            i.doc.field_father ?
                                                <textarea
                                                    className='form_input'
                                                    name={i.doc.field}
                                                    disabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                    value={textDomains ? textDomains[i.doc.field] : ''}
                                                    defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                                    ref={register}
                                                    rows="4"
                                                />
                                                :
                                                <textarea
                                                    className='form_input'
                                                    name={i.doc.field}
                                                    disabled={index === 39 && i.doc.rol_edicion === 6 ? superTec ? false : true : index === 40 && i.doc.rol_edicion === 5 ? superJur ? false : true : lectura}
                                                    defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                                    ref={register}
                                                    rows="4"
                                                />


                                            : ''
                                        }
                                        {i.doc.form == 'fecha' ?

                                            <Controller
                                                as={DatePicker}
                                                control={control}
                                                name={i.doc.field}
                                                selected={(fields.info[i.doc.field] ? date.parse(fields.info[i.doc.field], 'YYYY-MM-DD') : '')}
                                                defaultValue={(fields.info[i.doc.field] ? date.parse(fields.info[i.doc.field], 'YYYY-MM-DD') : '')}
                                                onChange={([selected]) => selected}
                                                rules={
                                                    {required: i.doc.required ? i.doc.message : undefined}
                                                }
                                            />
                                            : ''


                                        }
                                        {i.doc.form == 'check' ?

                                            <>
                                                <input type="checkbox"
                                                    name={i.doc.field}
                                                    id={i.doc.field}
                                                    defaultChecked={defecto ? fields.info[i.doc.field] : false}
                                                    style={{ width: '2%' }}
                                                    ref={register}
                                                />
                                                {/* <label htmlFor={i.doc.field}> {i.doc.label}</label><br /> */}

                                            </>

                                            : ''
                                        }
                                        {errors[i.doc.field] && <span className="msg-error">{errors[i.doc.field].message}</span>}
                                        {/* <ErrorMessage errors={errors} name={i.doc.field} /> */}
                                    </>
                                    : <input type={i.doc.type}
                                        className='form_input_static'
                                        name={i.doc.field}
                                        readOnly={false}
                                        defaultValue={defecto ? fields.info[i.doc.field] : ''}
                                        ref={register} />}

                                {i.doc.type === "hidden" ? null : <p className="form_helper">{i.doc.helper}</p>}
                            </div>

                        )}

                        {index === 40 ?
                            <Fragment>
                                <ListaComunicados codigo_bupi={id} consecutivo={consecutivo} tabla={index} tipoSaneamiento={saneamientoSeleccionado} />
                            </Fragment>
                            : null}

                        {Object.keys(errors).length > 0 ? <span className="msg-error">Existen validaciones pendientes, revise en cual campo falta</span> : null}
                        {console.log("cosas", permiso, lectura)}
                        {permiso && !lectura ? <ModalValidacion open={<button className='primmary' type="submit">Guardar</button>} lista={listaValidacion} ></ModalValidacion> : <p className="no-permiso">No cuentas con permisos para editar la información</p>}
                    </>
                    : ''}



            </form>

            {view ? '' :
                <>
                    {permiso && !lectura ? <>
                        <p>Este expediente aún no tiene un registro para esta tabla, debe crear uno primero</p>
                        <button onClick={crear_registro}>Crear registro</button>
                    </> : <p>Este expediente aún no tiene un registro para esta tabla</p>}
                </>
            }

        </>

    )



}

const Files = ({ titulo, cod }) => {

    const [filename, setFilename] = useState(null)
    const [uri, setUri] = useState(false)
    const [refresh, setRefresh] = useState(false)


    let { id } = useParams();



    useEffect(() => {

        var data = {
            "id_consulta": "get_soportes",
            "identificador": id + '-' + cod
        }
        // console.log(data)

        servidorPost('/backend', data).then((response) => {

            if (response.data.length > 0) {
                setFilename(response.data[0].nombre)
                setUri(response.data[0].id)
            }


        })

    }, [refresh])

    const download = () => {

        window.open(url + '/descargar/' + uri)

    }

    const upload = e => {

        const files = e.target.files
        // console.log(files[0].name)
        setFilename(id + '-' + cod + '.pdf')



        const formData = new FormData()

        formData.append("file", files[0], id + '-' + cod + '.pdf')

        servidorPost('/upload/' + id + '-' + cod, formData).then((response) => {
            // console.log(response)
            if (response.status == 200) {
                toast.success("Documento cargado al sistema: " + titulo);
                setRefresh(!refresh)
            } else {
                toast.error("Problema al cargar documento");

            }
        })




    }

    return (
        <div className="upload_file">
            <div >
                <label htmlFor={titulo} className="label-input" >{uri ? 'Actualizar' : 'Anexar'} {titulo}
                    <input type="file" id={titulo} onChange={upload} className="input" accept="application/pdf" />
                </label>
            </div>
            {uri && <ImageSearchIcon onClick={download} />}
            <div><p>{filename}</p></div>

        </div>
    )
}


const Alerta = ({ btn, msg, action }) => {


    return (

        <Popup
            trigger={btn}
            modal
            nested
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> Confirmación </div>
                    <div className="content">{msg}</div>
                    <div className="actions">
                        <button
                            className="button"
                            onClick={() => {
                                action()
                                close();
                            }}

                        >
                            Si
                        </button>
                        <button
                            className="button"
                            onClick={() => {
                                close();
                            }}
                        >
                            No
                        </button>
                    </div>
                </div>
            )}
        </Popup>


    )

}




const FormMultiple = ({ tbl, index, titulo }) => {

    const [activate, setActivate] = React.useState(false)
    const [multiple, setMultiple] = React.useState(false)
    const [consecutivo, setConsecutivo] = React.useState(0)
    const [opciones, setOpciones] = React.useState([])
    const [refresh, setRefresh] = React.useState(false)
    const [autoref, setAutoref] = React.useState(0)
    const [permiso, setPermiso] = React.useState(false)

    let { id } = useParams();

    useEffect(() => {
        setActivate(false)
        setMultiple(false)

        var tipo_permiso = gestionPermisos(index);
        // console.log("TIPO PERMISO", tipo_permiso)

        getPermisos().then((response) => {
            // console.log("permisos-multiple")
            // console.log(response)
            // console.log(tipo_permiso)
            if (response.some(r => r == 10)) {

                setPermiso(true)
                // setLectura(false)
            } else {
                setPermiso(response.some(r => tipo_permiso.includes(r)))
            }


            // console.log(permiso)
        })

        // if ([17, 18, 6, 7, 8, 9, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 39, 40].includes(index)) {
        if ([2, 4].includes(index)) {
            setMultiple(true)


            var data = {
                "id_consulta": "get_consecutivos_concesiones",
                "id_concesion": id,
                "tabla": "maritima." + tbl
            }

            // console.log(data)

            servidorPost('/backend', data).then((response) => {

                if (response.data.length > 0) {
                    setOpciones(response.data)
                } else {
                    setOpciones([])

                }


            })







        } else {
            setActivate(true)

        }


    }, [index, autoref])

    const activar = (con) => () => {
        setConsecutivo(con)
        setActivate(true)
        setRefresh(Math.random())
    }

    const add_tarea_saneamiento = () => {

    }

    const add_registro = () => {

        var data = {
            "id_consulta": "insert_consecutivo_concesiones",
            "id_concesion": id,
            "tabla": "maritima." + tbl
        };

        servidorPost('/backend', data).then((response) => {

            // console.log(response)
            if (response.data.length > 0) {
                toast.success("Registro creado satisfactoriamente");
                setAutoref(Math.random())
            }


        })


    }

    const delete_registro = (con) => {

        var data = {
            "id_consulta": "delete_consecutivo_maritima",
            "id_concesion": id,
            "tabla": "maritima." + tbl,
            "consecutivo": con
        }


        servidorPost('/backend', data).then((response) => {

            // console.log(response)
            if (response.data.length > 0) {
                toast.success("Registro borrado satisfactoriamente");
                setAutoref(Math.random())
            }


        })


    }


    return (

        <div className="form-big">
            <h3>{titulo}</h3>
            <p>Formulario para la edición de información relaciona a: {titulo}</p>
            {multiple && <>
                <p>Seleccione un registro para ver su información</p>
                {opciones.map((i, e) =>
                    <>
                        <div className="grupo-multiple">
                            <button onClick={activar(i.consecutivo)}>Ver registro {i.consecutivo}</button>


                            {permiso ? <Alerta
                                btn={<DeleteIcon />}
                                msg="Se encuentra seguro de borrar este registro?"
                                action={() => delete_registro(i.consecutivo)}
                            /> : ''}


                        </div>

                    </>
                )}
                {permiso ? <Alerta
                    btn={<button className="primmary" >Adicionar registro</button>}
                    msg="Se encuentra seguro de adicionar un nuevo registro?"
                    action={add_registro}
                /> : ''}
            </>}

            {activate && <Form tbl={tbl} index={index} refresh={refresh} consecutivo={consecutivo} />}


        </div>
    )




}

const Ayuda = () => {

    const [info, setInfo] = React.useState([])

    let { id } = useParams();

    useEffect(() => {

        var data = {
            "id_consulta": "info_header_form",
            "codigo_bupi": id,
        }

        // console.log(data)

        servidorPost('/backend', data).then((response) => {

            setInfo(response.data[0])
            // setChip(response.data[0].chip_cat)

        })



    }, [false])


    return (

        <div className="header-help-form">
            <div><p>Matrícula inmobiliaria: </p>   <p>{info.num_mi}</p></div>
            {/* <div><p>CHIP: </p> <p>{info.chip_cat}</p></div> */}
            <div><p>Número predial nacional: </p>   <p>{info.numero_predial_nacional}</p></div>

        </div>

    )

}

const ModalValidacion = ({ open, lista }) => {

    // console.log("Lista validadores")
    // console.log(lista)

    return (
        <Popup
            trigger={open}
            modal
            nested
        >
            {Object.keys(lista).length > 0 ?
                <div className="modal" style={{ maxHeight: '400px', overflow: 'auto', width: '1000px' }}>
                    <div id="seccion">
                        <div id="titulo_seccion">Resultados validación</div>
                        <p id="descripcion_seccion">A continuación se listan los resultados de la validación para el formulario</p>

                        <div id="documentos">
                            <div className="item head" >
                                <p>Campo</p>
                                <p>Condición</p>
                                <p style={{ textAlign: 'center' }}>Estado</p>
                                <p style={{ textAlign: 'center' }}>Obligatorio</p>
                            </div>
                            {Object.keys(lista).map((v) => {
                                return (
                                    <Fragment>
                                        {lista[v].map((c) => {
                                            return (
                                                <div className="item" key={c.id_condicion}>
                                                    <p>{v}</p>
                                                    <p>{c.etiqueta}</p>
                                                    <p style={{ textAlign: 'center' }}> {c.estado ?
                                                        <CheckIcon style={{ color: '#07bc0c', fontSize: '1rem' }} /> :
                                                        <CloseIcon style={{ color: 'red', fontSize: '1rem' }} />}
                                                    </p>
                                                    <p style={{ textAlign: 'center' }}>{c.obligatorio ? "SI" : "NO"}</p>
                                                </div>
                                            )
                                        })}
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div> : null}



        </Popup>
    )
}


const Concesion = (props) => {

    const [index, setIndex] = React.useState(0)
    const [tbl, setTbl] = React.useState(null)

    const [active, setActive] = React.useState(0)
    const [recarga, setRecarga] = React.useState(null)
    const [titulo, setTitulo] = React.useState(null)
    const { session } = props;
    const [usuario, setUsuario] = React.useState(session);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [openPopup, setOpenPopup] = React.useState(false);


    const getForm = (id, form, descripcion) => {

        setIndex(id)
        setTbl(form)
        setActive(id)
        setTitulo(descripcion)

        setRecarga(Math.random())
    }

    useEffect(() => {
        setUsuario(session);
        setTabIndex(usuario.usuario_rol === 10 ? 1 : 0);
        if (session.usuario_rol === 10) {
            getForm(40, "info40_san_jur", "Gestión saneamiento jurídico");
        }
    }, [session, setUsuario, setTabIndex, usuario])



    return (
        <div id="seccion">
            <div id="titulo_seccion">CONCESIÓN</div>
            <p id="descripcion_seccion">Sección para edición de la información de la concesión portuaria, por favor seleccione un item y luego un formulario para observar el detalle.</p>
            <Tabs onSelect={(index) => {
                setIndex(0)
                setTabIndex(index)
            }}
                selectedIndex={tabIndex}>
                <TabList>
                    <Tab>Estructuración</Tab>
                    {/* <Tab>Saneamientos</Tab>
                    <Tab>Asignaciones</Tab>
                    <Tab>Jurídico</Tab>
                    <Tab>Financiera</Tab>
                    <Tab>Social</Tab>
                    <Tab>Documentos</Tab>
                    <Tab>Saneamientos</Tab>
                    <Tab>Documental</Tab> */}
                </TabList>
                <TabPanel>

                    <h3>Formularios concesión</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>
                    <div className="grupo-formularios">
                                <button onClick={() => getForm(1, "concesion", "Concesión")}
                                    className={active == 1 ? 'active' : ''}  >
                                    Concesión
                                </button>
                                <button onClick={() => getForm(2, "predios", "Predios")} className={active == 2 ? 'active' : ''}>
                                    Predios
                                </button>
                                <button onClick={() => getForm(3, "infraestructura", "Infraestructura")} className={active == 42 ? 'active' : ''}>
                                    Infraestructura
                                </button>
                                <button onClick={() => getForm(4, "aledanos", "Aledaños")} className={active == 41 ? 'active' : ''}>
                                    Aledaños
                                </button>

                    </div>

                    {/* <h3>Documentos</h3>
                    <Files titulo="Soporte" cod={1} />
                    <Files titulo="Concepto técnico" cod={2} />
                    <Ayuda /> */}
                </TabPanel>

                {/* <TabPanel>

                    <h3>Formularios Jurídicos</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>

                    <div className="grupo-formularios">
                        <button onClick={() => getForm(5, "info5_juridicos", "Información juridica")} className={active == 5 ? 'active' : ''}>
                            juridica
                        </button>
                        <button onClick={() => getForm(21, "info21_juridicos", "Información juridica Adquisición")} className={active == 21 ? 'active' : ''}>
                            juridica - adquisición
                        </button>
                        <button onClick={() => getForm(6, "info6_propietario_anterior_juridico", "Propietario anterior juridico")} className={active == 6 ? 'active' : ''}>
                            propietario anterior juridico
                        </button>

                        <button onClick={() => getForm(8, "info8_propietario_juridico", "Propietario según folio")} className={active == 8 ? 'active' : ''}>
                            propietario según folio
                        </button>
                        <button onClick={() => getForm(15, "info15_saneamiento_juridico", "Saneamiento Juridico")} className={active == 15 ? 'active' : ''} >
                            saneamiento juridico
                        </button>



                        <button onClick={() => getForm(19, "info19_mutacion_predial", "Mutación predial")} className={active == 19 ? 'active' : ''}>
                            Mutación predial
                        </button>


                        <button onClick={() => getForm(17, "info17_documentos_requeridos", "Documentos requeridos")} className={active == 17 ? 'active' : ''}>
                            Documentos requeridos
                        </button>

                        <button onClick={() => getForm(13, "info13_control_calidad_juridico", "Control de calidad juridico")} className={active == 13 ? 'active' : ''}>
                            control de calidad juridico
                        </button>

                    </div>
                    <h3>Documentos</h3>
                    <Files titulo="soporte" cod={3} />

                    <Ayuda />

                </TabPanel> */}

                {/* <TabPanel> */}
                {/* <button onClick={() => getForm(16, "info16_tributaria", "Información tributaria")} className={active == 16 ? 'active' : ''}>
                        tributaria
                    </button> */}
                {/* <button onClick={() => getForm(38, "info38_financiero", "Información financiera")} className={active == 38 ? 'active' : ''}>
                        Financiero
                    </button> */}




                {/* </TabPanel> */}
                {/* <TabPanel>

                    <h3>Formularios sociales</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>

                    <div className="grupo-formularios">
                        <button onClick={() => getForm(24, "info24_social", "Social")} className={active == 24 ? 'active' : ''}>
                            Social
                        </button>
                        <button onClick={() => getForm(25, "info25_unidades_sociales", "Unidades sociales")} className={active == 25 ? 'active' : ''}>
                            Unidades sociales
                        </button>
                        <button onClick={() => getForm(26, "info26_personas_unidad_social", "Personas unidad social")} className={active == 26 ? 'active' : ''}>
                            Personas unidad social
                        </button>
                        <button onClick={() => getForm(27, "info27_servicios_publicos", "Servicios públicos")} className={active == 27 ? 'active' : ''}>
                            Servicios públicos
                        </button>
                        <button onClick={() => getForm(28, "info28_avaluo_actividad_economica", "Avaluo actividad económica")} className={active == 28 ? 'active' : ''}>
                            Avaluo actividad económica
                        </button>
                        <button onClick={() => getForm(29, "info29_compensaciones_y_reconocimientos_economicos", "Compensaciones y reconocimientos económicos")} className={active == 29 ? 'active' : ''}>
                            Compensaciones y reconocimientos económicos
                        </button>
                        <button onClick={() => getForm(30, "info30_liquidacion_dano_emergente_y_lucrocesante", "Liquidación daño emergente y lucro cesante")} className={active == 30 ? 'active' : ''}>
                            Liquidación daño emergente y lucro cesante
                        </button>
                        <button onClick={() => getForm(31, "info31_acta_de_aceptacion", "Acta de aceptación")} className={active == 31 ? 'active' : ''}>
                            Acta de aceptación
                        </button>
                        <button onClick={() => getForm(32, "info32_negociacion_construcciones", "Negociación construcciones")} className={active == 32 ? 'active' : ''}>
                            Negociación construcciones
                        </button>
                        <button onClick={() => getForm(33, "info33_reasentamiento", "Reasentamiento")} className={active == 33 ? 'active' : ''}>
                            Reasentamiento
                        </button>
                    </div>

                </TabPanel> */}
                {/* <TabPanel>
                    <CargueDocumentos />
                </TabPanel> */}
                {/* <TabPanel>
                    <h3>Formularios saneamientos</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>
                    <div className="grupo-formularios">
                        <button onClick={() => getForm(39, "info39_gestion_san_tec", "Gestión saneamiento catastral")} className={active == 39 ? 'active' : ''}>
                            Gestión saneamiento catastral
                        </button>
                        <button onClick={() => getForm(40, "info40_san_jur", "Gestión saneamiento jurídico")} className={active == 40 ? 'active' : ''}>
                            Gestión saneamiento jurídico
                        </button>
                    </div>
                </TabPanel> */}
                {/* <TabPanel>
                    <h3>Asignaciones</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>
                    <div className="grupo-formularios">
                        <button onClick={() => getForm(44, "info44_asignacion_saneamiento", "Asignaciones")} className={active == 44 ? 'active' : ''}>
                            Asignación saneamientos
                        </button>
                    </div>
                </TabPanel> */}
                {/* <TabPanel>
                    <h3>Formularios documental</h3>
                    <p>A continuación seleccione un formulario para visualizar su información en caso de que tenga datos almacenados en la base de datos.</p>
                    <div className="grupo-formularios">
                        <button onClick={() => getForm(36, "info36_documental", "Documental")} className={active == 36 ? 'active' : ''}>
                            Documental
                        </button>
                        <button onClick={() => getForm(37, "info37_prestamo_expedientes", "Préstamo expedientes")} className={active == 37 ? 'active' : ''}>
                            Préstamo expedientes
                        </button>
                    </div>
                </TabPanel> */}

            </Tabs>




            {index > 0 ? <FormMultiple tbl={tbl} index={index} titulo={titulo} /> : ''}

            <ToastContainer />
        </div>

    )

}


export default Concesion