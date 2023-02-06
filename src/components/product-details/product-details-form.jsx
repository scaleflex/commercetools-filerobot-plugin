import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import validate from './validate';
import messages from './messages';
import DataTable from '@commercetools-uikit/data-table';
import {FormModalPage} from "@commercetools-frontend/application-components";
import {formatLocalizedString, transformLocalizedFieldToLocalizedString} from "@commercetools-frontend/l10n";
import {NO_VALUE_FALLBACK} from "@commercetools-frontend/constants";
import {useDataTableSortingState} from "@commercetools-uikit/hooks";
import {useApplicationContext} from "@commercetools-frontend/application-shell-connectors";

const ProductDetailsForm = (props) => {
    const intl = useIntl();
    const formik = useFormik({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        validate,
        enableReinitialize: true,
    });

    const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
    const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
        dataLocale: context.dataLocale,
        projectLanguages: context.project.languages,
    }));

    const columns = [
        { key: 'id', label: 'Variant ID', isSortable: true },
        { key: 'sku', label: 'SKU' },
        { key: 'key', label: 'Key'},
        { key: 'images', label: 'Image'}
    ];

    const itemRenderer = (item, column, dataLocale, projectLanguages) => {
        switch (column.key) {
            case 'images':
                return item[column.key][0].url;
            default:
                return item[column.key];
        }
    };

    const formElements = (
        <Spacings.Stack scale="xl">

            <Grid
                gridGap="16px"
                gridAutoColumns="1fr"
                gridTemplateColumns="repeat(2, 1fr)"
            >
                <Grid.Item>
                    <LocalizedTextField
                        name="name"
                        title={intl.formatMessage(messages.productNameLabel)}
                        value={formik.values.name}
                        errors={formik.errors.name}
                        touched={Boolean(formik.touched.name)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        selectedLanguage={props.dataLocale}
                        isReadOnly={props.isReadOnly}
                        horizontalConstraint={13}
                    />
                </Grid.Item>
                <Grid.Item>
                    <TextField
                        name="key"
                        title={intl.formatMessage(messages.productKeyLabel)}
                        value={formik.values.key}
                        errors={formik.errors.key}
                        touched={formik.touched.key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isReadOnly={props.isReadOnly}
                        renderError={(errorKey) => {
                            if (errorKey === 'duplicate') {
                                return intl.formatMessage(messages.duplicateKey);
                            }
                            return null;
                        }}
                        isRequired
                        horizontalConstraint={13}
                    />
                </Grid.Item>
            </Grid>

            <h3>Variants</h3>

            <DataTable
                isCondensed
                columns={columns}
                rows={formik.values.allVariants}
                itemRenderer={(item, column) =>
                    itemRenderer(item, column, dataLocale, projectLanguages)
                }
                maxHeight={600}
                sortedBy={tableSorting.value.key}
                sortDirection={tableSorting.value.order}
                onSortChange={tableSorting.onChange}
            />
                {formik.values.allVariants.map(value => (
                    <Grid
                        gridGap="16px"
                        gridAutoColumns="1fr"
                        gridTemplateColumns="repeat(5, 1fr)"
                        key={value.id}
                    >
                        <Grid.Item>
                            Variant ID: {value?.id}
                        </Grid.Item>
                        <Grid.Item>
                            Sku: {value?.sku}
                        </Grid.Item>
                        <Grid.Item>
                            Key: {value?.key}
                        </Grid.Item>
                        <Grid.Item>
                            <img src={value?.images[0].url} alt="" width={200}/>
                        </Grid.Item>
                        <Grid.Item>
                            <PrimaryButton
                                label={intl.formatMessage(messages.changeVariantImage)}
                                onClick={() => {
                                    alert('click')
                                    return true;
                                }}
                                isDisabled={false}
                            />
                        </Grid.Item>
                    </Grid>
                    )
                )}
        </Spacings.Stack>
    );

    return props.children({
        formElements,
        values: formik.values,
        isDirty: formik.dirty,
        isSubmitting: formik.isSubmitting,
        submitForm: formik.handleSubmit,
        handleReset: formik.handleReset,
    });
};
ProductDetailsForm.displayName = 'ProductDetailsForm';
ProductDetailsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        id: PropTypes.string,
        key: PropTypes.string,
        name: PropTypes.object,
        version: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
    isReadOnly: PropTypes.bool.isRequired,
    dataLocale: PropTypes.string.isRequired,
};

export default ProductDetailsForm;
