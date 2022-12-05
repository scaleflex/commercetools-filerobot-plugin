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
import {useChannelDetailsFetcher} from "../../hooks/use-channels-connector";
import {useApplicationContext} from "@commercetools-frontend/application-shell-connectors";
import {useIsAuthorized} from "@commercetools-frontend/permissions";
import {PERMISSIONS} from "../../constants";
import {useShowApiErrorNotification, useShowNotification} from "@commercetools-frontend/actions-global";
import {formatLocalizedString} from "@commercetools-frontend/l10n";
import {NO_VALUE_FALLBACK} from "@commercetools-frontend/constants";
import {useProductDetailsFetcher} from "../../hooks/use-products-connector/use-products-connector";

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

    const productName = 'Sample Product';
    return (
        <Spacings.Stack scale={'l'}>
            <FormModalPage
                title={productName}
                isOpen
                onClose={props.onClose}
                isPrimaryButtonDisabled={false}
                isSecondaryButtonDisabled={!formProps.isDirty}
                onSecondaryButtonClick={formProps.handleReset}
                onPrimaryButtonClick={formProps.submitForm}
                labelPrimaryButton={FormModalPage.Intl.save}
                labelSecondaryButton={FormModalPage.Intl.revert}
            >
                {loading && (
                    <Spacings.Stack alignItems="center">
                        <LoadingSpinner/>
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
                    <ApplicationPageTitle additionalParts={[productName]}/>
                )}
                {product === null && <PageNotFound/>}
            </FormModalPage>
        </Spacings.Stack>
    );
};
ProductDetails.displayName = 'ProductDetails';
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ProductDetails;
