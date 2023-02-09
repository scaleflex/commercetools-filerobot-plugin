import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import {transformLocalizedFieldToLocalizedString} from '@commercetools-frontend/l10n';

export const docToFormValues = (product, languages) => ({
    name: LocalizedTextInput.createLocalizedString(
        languages,
        transformLocalizedFieldToLocalizedString(product?.masterData.staged.nameAllLocales ?? [])
    ),
    key: product?.key ?? '',
    variants: product?.masterData.staged.variants ?? [],
    masterVariant: product?.masterData.staged.masterVariant ?? []
});

export const formValuesToDoc = (formValues) => ({
    name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
    key: formValues.key,
    variants: formValues.variants,
    masterVariant: formValues.masterVariant
});
