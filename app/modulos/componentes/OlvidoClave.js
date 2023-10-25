import React, {  useRef , useState } from 'react';
import useRootClose from 'react-overlays/useRootClose'

const OlvidoClave = () => {
    const ref = useRef();
    const [show, setShow] = useState(false);
    const handleRootClose = () => setShow(false);

    useRootClose(ref, handleRootClose, {
        disabled: !show,
    });

    return (
        <div>
            {show && (
                <div
                    ref={ref}
                >
                    <span>Para reiniciar su clave por favor comuniquese con el administrador: msanchezr@invias.gov.co, ymendivelso@invias.gov.co</span>
                </div>
            )}

            <p
            className='enlace'
            onClick={() => setShow(true)}
            >
            ¿Has olvidado la contraseña?</p>

            {/* {show && (
                <div
                    ref={ref}
                >
                    <span>Para reiniciar su clave por favor comuniquese con el administrador: msanchezr@invias.gov.co, ymendivelsoo@invias.gov.co</span>
                </div>
            )} */}
        </div>
    );
}

export default OlvidoClave;