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
import {formatLocalizedString, transformLocalizedFieldToLocalizedString} from "@commercetools-frontend/l10n";
import {NO_VALUE_FALLBACK} from "@commercetools-frontend/constants";
import {
    useProductDetailsFetcher,
} from '../../hooks/use-products-connector/use-products-connector';
import {docToFormValues, formValuesToDoc} from "./conversions";
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

    return (
        <Spacings.Stack scale="xl">
            <ProductDetailsForm
                initialValues={docToFormValues(product, projectLanguages)}
            >
                {(formProps) => {
                    const productName = formatLocalizedString(
                        { name: transformLocalizedFieldToLocalizedString(product?.masterData.staged.nameAllLocales) },
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
                            onSecondaryButtonClick={(e) => {return false;}}
                            onPrimaryButtonClick={(e) => {return false;}}
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
                                        {intl.formatMessage(messages.productDetailsErrorMessage)}
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
        </Spacings.Stack>
    );
};
ProductDetails.displayName = 'ProductDetails';
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ProductDetails;
