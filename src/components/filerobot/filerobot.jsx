import {InfoModalPage, useModalState} from "@commercetools-frontend/application-components";
import SecondaryButton from "@commercetools-uikit/secondary-button";
import {PlusThinIcon} from "@commercetools-uikit/icons";
import messages from "../variant-details/messages";
import Spacings from "@commercetools-uikit/spacings";
import FilerobotDAM from "./filerobot-dam";

const FilerobotFormModal = () => {
    const pageModalState = useModalState();

    return (
        <Spacings.Stack scale="xl">
            <SecondaryButton iconLeft={<PlusThinIcon />} label="Add image" onClick={pageModalState.openModal}/>
            <InfoModalPage
                title="Filerobot DAM"
                isOpen={pageModalState.isModalOpen}
                onClose={pageModalState.closeModal}
                topBarCurrentPathLabel="Filerobot DAM"
                topBarPreviousPathLabel={messages.backToForm}
            >
                <div id={"filerobot-widget"}>Loading...</div>
                <FilerobotDAM />
            </InfoModalPage>
        </Spacings.Stack>
    );
}

export default FilerobotFormModal;
