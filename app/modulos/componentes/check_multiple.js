import React, { Fragment, useState, useEffect } from "react";
import { useController } from "react-hook-form";


const CheckMultiple = (props) => {
  const { options, name, isDisabled, defaultValue, control, onChange } = props;
  const { field } = useController({
    control,
    name,
    value: defaultValue
  });
  const [value, setValue] = useState(field.value ||  new Array(options.length).fill(null));

  useEffect(() => {
    let valueCopy = [...value];

    if(defaultValue){
     const actValue = defaultValue.map((df, idx) => {
        valueCopy[idx] = df.value;
      },[])

      setValue(valueCopy)
    }

  },[])

  const onHandleChange = (e, index) => {
    const valueCopy = [...value];
    
    valueCopy.map((vc, idx) => {
      if(vc === e.target.value){
        valueCopy[idx] = e.target.checked ? e.target.value : null;
      } else {
        valueCopy[index] = e.target.checked ? e.target.value : null;
      }
    },[])

    field.onChange(valueCopy);

    setValue(valueCopy);
  }

return (
  <form>
    {options.map((o, idx) => {
      return (
        <Fragment>
          <input type="checkbox" name={name} value={o.value} onChange={(e) => {onHandleChange(e,idx)}} disabled={isDisabled ? true : false} 
          defaultChecked={defaultValue ? defaultValue.length > 0 ? defaultValue.filter((f) => f.value !== null && f.value === o.value).length === 1 ? true : false : false: false} />
          <label htmlFor={"saneamiento" + idx}> {o.label}</label><br />
        </Fragment>
      )
    }, [])}
  </form>
)

}

export default CheckMultiple;