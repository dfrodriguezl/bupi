import Select from 'react-select';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RenderSelect = (props) => {
  const {
    field: {
      value,
      onChange,
    },
    data,
  } = props;

  const [selectedOption, setSelectedOption] = useState();
  const handleChange = (e) => {
    onChange(e.value);
    setSelectedOption(e);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={data}
    />
  );
};
RenderSelect.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  field: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired,
    ]),
    onChange: PropTypes.func.isRequired,
  }),
};

RenderSelect.defaultProps = {
  field: { onChange: () => {}, value: '' },
};

export default RenderSelect;