export const docToFormValues = (product, languages) => ({
    variants: product?.masterData.staged.variants ?? [],
    masterVariant: product?.masterData.staged.masterVariant ?? []
});

export const formValuesToDoc = (formValues) => ({
    variants: formValues.variants,
    masterVariant: formValues.masterVariant
});
