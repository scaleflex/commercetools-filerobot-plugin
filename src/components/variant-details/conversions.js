export const docToFormValues = (product, languages) => ({
    variants: product?.masterData.staged.variants ?? [],
    masterVariant: product?.masterData.staged.masterVariant ?? [],
    version: product?.version,
    id: product?.id
});

export const formValuesToDoc = (formValues) => (formValues);
