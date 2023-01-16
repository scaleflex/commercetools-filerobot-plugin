import PropTypes from 'prop-types';
import {FormModalPage, PageNotFound} from "@commercetools-frontend/application-components";
import Spacings from "@commercetools-uikit/spacings";
import LoadingSpinner from "@commercetools-uikit/loading-spinner";
import {ContentNotification} from "@commercetools-uikit/notifications";
import Text from "@commercetools-uikit/text";
import messages from "./messages";
import {ApplicationPageTitle} from "@commercetools-frontend/application-shell";
import {useIntl} from "react-intl";
import {useParams} from "react-router-dom";
import {useApplicationContext} from "@commercetools-frontend/application-shell-connectors";
import {useIsAuthorized} from "@commercetools-frontend/permissions";
import {PERMISSIONS} from "../../constants";
import {useShowApiErrorNotification, useShowNotification} from "@commercetools-frontend/actions-global";
import {formatLocalizedString} from "@commercetools-frontend/l10n";
import {DOMAINS, NO_VALUE_FALLBACK} from "@commercetools-frontend/constants";
import {
    useProductDetailsUpdater,
    useProductDetailsFetcher,
} from '../../hooks/use-products-connector/use-products-connector';
import {docToFormValues, formValuesToDoc} from "./conversions";
import {useCallback} from "react";
import {transformErrors} from "./transform-errors";
import ProductDetailsForm from "./product-details-form";

const ProductDetails = (props) => {
    const intl = useIntl();
    const params = useParams();
    const {loading, error, product} = useProductDetailsFetcher(params.id);
    const {dataLocale, projectLanguages} = useApplicationContext((context) => ({
        dataLocale: context.dataLocale ?? '',
        projectLanguages: context.project?.languages ?? [],
    }));
    const canManage = useIsAuthorized({
        demandedPermissions: [PERMISSIONS.Manage],
    });
    const showNotification = useShowNotification();
    const showApiErrorNotification = useShowApiErrorNotification();
    const productDetailsUpdater = useProductDetailsUpdater();
    const handleSubmit = useCallback(
        async (formikValues, formikHelpers) => {
            const data = formValuesToDoc(formikValues);
            try {
                await productDetailsUpdater.execute({
                    originalDraft: product,
                    nextDraft: data,
                });
                showNotification({
                    kind: 'success',
                    domain: DOMAINS.SIDE,
                    text: intl.formatMessage(messages.productUpdated, {
                        productName: formatLocalizedString(formikValues, {
                            key: 'name',
                            locale: dataLocale,
                            fallbackOrder: projectLanguages,
                        }),
                    }),
                });
            } catch (graphQLErrors) {
                const transformedErrors = transformErrors(graphQLErrors);
                if (transformedErrors.unmappedErrors.length > 0) {
                    showApiErrorNotification({
                        errors: transformedErrors.unmappedErrors,
                    });
                }

                formikHelpers.setErrors(transformedErrors.formErrors);
            }
        },
        [
            product,
            productDetailsUpdater,
            dataLocale,
            intl,
            projectLanguages,
            showApiErrorNotification,
            showNotification,
        ]
    );
    console.log(product);
    return (
        <ProductDetailsForm
            initialValues={docToFormValues(product, projectLanguages)}
            onSubmit={handleSubmit}
            isReadOnly={!canManage}
            dataLocale={dataLocale}
        >
            {(formProps) => {
                const productName = formatLocalizedString(
                    {
                        name: formProps.values?.name,
                    },
                    {
                        key: 'name',
                        locale: dataLocale,
                        fallbackOrder: projectLanguages,
                        fallback: NO_VALUE_FALLBACK,
                    }
                );
                return (
                    <FormModalPage
                        title={productName}
                        isOpen
                        onClose={props.onClose}
                        isPrimaryButtonDisabled={
                            formProps.isSubmitting || !formProps.isDirty || !canManage
                        }
                        isSecondaryButtonDisabled={!formProps.isDirty}
                        onSecondaryButtonClick={formProps.handleReset}
                        onPrimaryButtonClick={formProps.submitForm}
                        labelPrimaryButton={FormModalPage.Intl.save}
                        labelSecondaryButton={FormModalPage.Intl.revert}
                    >
                        {loading && (
                            <Spacings.Stack alignItems="center">
                                <LoadingSpinner />
                            </Spacings.Stack>
                        )}
                        {error && (
                            <ContentNotification type="error">
                                <Text.Body>
                                    {intl.formatMessage(messages.channelDetailsErrorMessage)}
                                </Text.Body>
                            </ContentNotification>
                        )}
                        {product && formProps.formElements}
                        {product && (
                            <ApplicationPageTitle additionalParts={[productName]} />
                        )}
                        {product === null && <PageNotFound />}
                    </FormModalPage>
                );
            }}
        </ProductDetailsForm>
    );
};
ProductDetails.displayName = 'ProductDetails';
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ProductDetails;
