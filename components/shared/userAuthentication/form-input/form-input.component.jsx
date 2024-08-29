const FormInput = ({ label, ...otherProps }) => {
    return (
      <div id="authentication-panel" className='group'>
        <input className='form-input' {...otherProps} />
        {label && (
          <label
            className={`${
              otherProps.value.length ? 'shrink' : ''
            } form-input-label`}
          >
            {label}
          </label>
        )}
      </div>
    );
  };
  
  export default FormInput;