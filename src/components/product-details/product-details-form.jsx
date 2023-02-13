import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import validate from './validate';
import messages from './messages';
import DataTable from '@commercetools-uikit/data-table';
import {useDataTableSortingState} from "@commercetools-uikit/hooks";
import {useApplicationContext} from "@commercetools-frontend/application-shell-connectors";
import {Switch, useHistory, useRouteMatch} from "react-router-dom";
import {SuspendedRoute} from "@commercetools-frontend/application-shell";
import VariantDetails from "../variant-details/variant-details";

const ProductDetailsForm = (props) => {
    const intl = useIntl();
    const formik = useFormik({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        validate,
        enableReinitialize: true,
    });
    const match = useRouteMatch();
    const { push } = useHistory();
    const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
    const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
        dataLocale: context.dataLocale,
        projectLanguages: context.project.languages,
    }));

    const columns = [
        { key: 'id', label: 'Variant ID' },
        { key: 'sku', label: 'SKU', isSortable: true },
        { key: 'key', label: 'Key'},
        { key: 'images', label: 'Image'},
    ];

    const itemRenderer = (item, column, dataLocale, projectLanguages) => {
        switch (column.key) {
            case 'images':
                return <img src={item[column.key][0].url} alt="" style={{ maxWidth: 200, maxHeight: 100 }}/>;
            default:
                return item[column.key];
        }
    };

    const allVariants = formik.values.variants.concat(formik.values.masterVariant);
    const formElements = (
        <Spacings.Stack scale="xl">
            <h3>Variants</h3>
            <DataTable
                isCondensed
                columns={columns}
                rows={allVariants}
                itemRenderer={(item, column) =>
                    itemRenderer(item, column, dataLocale, projectLanguages)
                }
                maxHeight={600}
                sortedBy={tableSorting.value.key}
                sortDirection={tableSorting.value.order}
                onSortChange={tableSorting.onChange}
                onRowClick={(row) => push(`${match.url}/variants/${row.id}`)}
            />
            <Switch>
                <SuspendedRoute path={`${match.path}/variants/:variantId`}>
                    <VariantDetails onClose={() => push(`${match.url}`)} />
                </SuspendedRoute>
            </Switch>
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
        version: PropTypes.number,
    }),
    isReadOnly: PropTypes.bool.isRequired,
    dataLocale: PropTypes.string.isRequired,
};

export default ProductDetailsForm;
