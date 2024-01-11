export const docToFormValues = (product, languages) => ({
    allVariants: product?.masterData.staged.allVariants ?? [],
    version: product?.version,
    id: product?.id
});

export const formValuesToDoc = (formValues) => (formValues);
