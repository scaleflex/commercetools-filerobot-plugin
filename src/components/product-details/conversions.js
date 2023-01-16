import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (product, languages) => ({
  name: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(product?.masterData.staged.nameAllLocales ?? [])
  ),
});

export const formValuesToDoc = (formValues) => ({
  name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
});
