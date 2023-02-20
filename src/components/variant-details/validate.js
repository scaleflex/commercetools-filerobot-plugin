import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {

  };

  return omitEmpty(errors);
};

export default validate;
