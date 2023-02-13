import TextInput from '@commercetools-uikit/text-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-field';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {

  };

  return omitEmpty(errors);
};

export default validate;
