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
import {DOMAINS, NO_VALUE_FALLBACK} from "@commercetools-frontend/constants";
import {
    useProductDetailsFetcher,
} from '../../hooks/use-products-connector/use-products-connector';
import {
    useVariantDetailsUpdater
} from '../../hooks/use-variants-connector/use-variants-connector';

import {docToFormValues, formValuesToDoc} from "./conversions";
import {useCallback, useState} from "react";
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
    const variantDetailsUpdater = useVariantDetailsUpdater();
    const [primaryButton, setPrimaryButton] = useState(true);
    const [secondaryButton, setSecondaryButton] = useState(true);

    const variants = product?.masterData.staged.allVariants;
    let variantSku;
    for (let i = 0; i < variants.length; i++) {
        if (parseInt(variants[i].id) === parseInt(variantId)) {
            variantSku = variants[i].sku;
            break;
        }
    }

    const handleSubmit = useCallback(
        async (formikValues, formikHelpers) => {
            const data = formValuesToDoc(formikValues);
            let convertData = [];
            Object.keys(data).forEach(key => {
                if (key !== 'allVariants' && key !== 'version' && key !== 'id') {
                    convertData.push(
                        {
                            changeImageLabel: {
                                imageUrl: key.replaceAll(',', '.'),
                                label: data[key],
                                variantId: parseInt(variantId)
                            }
                        }
                    )
                }
            });

            try {
                await variantDetailsUpdater.execute({
                    originalDraft: product,
                    nextDraft: convertData,
                });
                showNotification({
                    kind: 'success',
                    domain: DOMAINS.SIDE,
                    text: intl.formatMessage(messages.variantUpdated, {
                        "variantSku": variantSku
                    }),
                });
                setPrimaryButton(true);
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

    let initialValues = docToFormValues(product, projectLanguages);
    return (
        <Spacings.Stack scale="xl">
            <VariantDetailsForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isReadOnly={!canManage}
                dataLocale={dataLocale}
                key={variantId}
                primaryButton={setPrimaryButton}
                secondaryButton={setSecondaryButton}
            >
                {(formProps) => {
                    return (
                        <FormModalPage
                            title={variantSku}
                            isOpen
                            onClose={props.onClose}
                            isPrimaryButtonDisabled={
                                primaryButton
                            }
                            isSecondaryButtonDisabled={secondaryButton}
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
                                <ApplicationPageTitle additionalParts={[variantSku]} />
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
