import {InfoModalPage, useModalState} from "@commercetools-frontend/application-components";
import SecondaryButton from "@commercetools-uikit/secondary-button";
import {PlusThinIcon} from "@commercetools-uikit/icons";
import messages from "../variant-details/messages";
import Spacings from "@commercetools-uikit/spacings";
import FilerobotDAM from "./filerobot-dam";
import PropTypes from "prop-types";

const FilerobotFormModal = (props) => {
    const pageModalState = useModalState();

    return (
        <Spacings.Stack scale="xl">
            <SecondaryButton iconLeft={<PlusThinIcon />} label="Add image" onClick={pageModalState.openModal}/>
            <InfoModalPage
                title="Filerobot DAM"
                isOpen={pageModalState.isModalOpen}
                onClose={pageModalState.closeModal}
                topBarCurrentPathLabel="Scaleflex DAM"
                topBarPreviousPathLabel={messages.backToForm}
            >
                <div id={"filerobot-widget"}>Loading...</div>
                <FilerobotDAM productId={props.productId} variantId={props.variantId} variant={props.variant} sku={props.sku} product={props.product}/>
            </InfoModalPage>
        </Spacings.Stack>
    );
}

FilerobotFormModal.propTypes = {
    productId: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    variantId: PropTypes.string.isRequired,
    variant: PropTypes.object.isRequired
};
export default FilerobotFormModal;

