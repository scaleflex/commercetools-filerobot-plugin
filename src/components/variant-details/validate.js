import TextInput from '@commercetools-uikit/text-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-field';
import omitEmpty from 'omit-empty-es';

const validate = (formikValues) => {
  const errors = {
    key: {},
    sku: {}
  };

  if (TextInput.isEmpty(formikValues.key)) {
    errors.key.missing = true;
  }

  if (TextInput.isEmpty(formikValues.sku)) {
    errors.sku.missing = true;
  }
  return omitEmpty(errors);
};

export default validate;
