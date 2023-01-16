import TextInput from '@commercetools-uikit/text-input';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {
    name: {},
  };

  if (TextInput.isEmpty(formikValues.name)) {
    errors.name.missing = true;
  }
  return omitEmpty(errors);
};

export default validate;
