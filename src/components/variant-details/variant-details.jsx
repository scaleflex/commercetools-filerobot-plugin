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
import VariantDetailsForm from "./variant-details-form";

const VariantDetails = (props) => {
    const intl = useIntl();
    const params = useParams();
    const {loading, error, product} = useProductDetailsFetcher(params.id);
    const variantId = params.variantId;
    const {dataLocale, projectLanguages} = useApplicationContext((context) => ({
        dataLocale: context.dataLocale ?? '',
        projectLanguages: context.project?.languages ?? [],
    }));
    const canManage = useIsAuthorized({
        demandedPermissions: [PERMISSIONS.Manage],
    });
    const showNotification = useShowNotification();
    const showApiErrorNotification = useShowApiErrorNotification();
    const variantDetailsUpdater = useProductDetailsUpdater();

    const handleSubmit = useCallback(
        async (formikValues, formikHelpers) => {
            const data = formValuesToDoc(formikValues);
            try {
                await variantDetailsUpdater.execute({
                    originalDraft: product,
                    nextDraft: data,
                });
                showNotification({
                    kind: 'success',
                    domain: DOMAINS.SIDE,
                    text: intl.formatMessage(messages.variantUpdated, {
                        variantSku: data.variants.sku
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
            variantDetailsUpdater,
            dataLocale,
            intl,
            projectLanguages,
            showApiErrorNotification,
            showNotification,
        ]
    );

    return (
        <Spacings.Stack scale="xl">
            <VariantDetailsForm
                initialValues={docToFormValues(product, projectLanguages)}
                onSubmit={handleSubmit}
                isReadOnly={!canManage}
                dataLocale={dataLocale}
            >
                {(formProps) => {
                    const variants = formProps.values.variants.concat(formProps.values.masterVariant);
                    let variantName;
                    for (let i = 0; i < variants.length; i++) {
                        if (parseInt(variants[i].id) === parseInt(variantId)) {
                            variantName = variants[i].sku;
                            break;
                        }
                    }

                    return (
                        <FormModalPage
                            title={variantName}
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
                                        {intl.formatMessage(messages.variantDetailsErrorMessage)}
                                    </Text.Body>
                                </ContentNotification>
                            )}
                            {product && formProps.formElements}
                            {product && (
                                <ApplicationPageTitle additionalParts={[variantName]} />
                            )}
                            {product === null && <PageNotFound />}
                        </FormModalPage>
                    );
                }}
            </VariantDetailsForm>
        </Spacings.Stack>
    );
};
VariantDetails.displayName = 'VariantDetails';
VariantDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default VariantDetails;
