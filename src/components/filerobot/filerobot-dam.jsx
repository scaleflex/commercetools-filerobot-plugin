import Filerobot from "@filerobot/core";
import Explorer from "@filerobot/explorer";
import XHRUpload from "@filerobot/xhr-upload";
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import messages from "./messages";
import {useShowApiErrorNotification, useShowNotification} from "@commercetools-frontend/actions-global";
import {useVariantDetailsUpdater} from "../../hooks/use-variants-connector/use-variants-connector";
import {useIntl} from "react-intl";
import {DOMAINS} from "@commercetools-frontend/constants";
import {transformErrors} from "./transform-errors";

const FilerobotDAM = (props) => {
    const filerobot = useRef(null);
    const showNotification = useShowNotification();
    const showApiErrorNotification = useShowApiErrorNotification();
    const variantDetailsUpdater = useVariantDetailsUpdater();
    const intl = useIntl();

    useEffect(() => {
        filerobot.current = Filerobot({
            securityTemplateID : 'SECU_53CA06BC35B94787B4F8F0EEA7E923E5',
            container          : 'fkklnkdm'
        })
            .use(Explorer, {
                config: {
                    rootFolderPath: '/wp_demo'
                },
                target: '#filerobot-widget',
                inline: true,
                width: 10000,
                height: 1000,
                disableExportButton: true,
                hideExportButtonIcon: true,
                preventExportDefaultBehavior: true,
                resetAfterClose: true,
                dismissUrlPathQueryUpdate: true,
                hideSearch: true,
            })
            .use(XHRUpload)
            .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
                for (const selected of files) {
                    console.log(selected);
                    let convertData = [
                        {
                            addExternalImage: {
                                image: {
                                    url: selected.file.url.cdn,
                                    label: "",
                                    dimensions: {
                                        width: selected.file.info.img_w,
                                        height: selected.file.info.img_h
                                    }
                                },
                                staged: true,
                                variantId: parseInt(props.variantId)
                            }
                        }
                    ];
                    try {
                        await variantDetailsUpdater.execute({
                            originalDraft: props.product,
                            nextDraft: convertData,
                        });
                        showNotification({
                            kind: 'success',
                            domain: DOMAINS.SIDE,
                            text: intl.formatMessage(messages.variantUpdated, {
                                variantSku: props.sku
                            }),
                        });
                    } catch (graphQLErrors) {
                        const transformedErrors = transformErrors(graphQLErrors);
                        if (transformedErrors.unmappedErrors.length > 0) {
                            showApiErrorNotification({
                                errors: transformedErrors.unmappedErrors,
                            });
                        }
                    }
                }
            })
            .on('complete', async ({ failed, uploadID, successful }) => {

            });

        return () => {
            filerobot.current.close();
        }
    }, []);
    return (
        <div></div>
    );
}

FilerobotDAM.propTypes = {
    productId: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
    product: PropTypes.object.isRequired,
    variantId: PropTypes.string.isRequired,
    variant: PropTypes.object.isRequired
};
export default FilerobotDAM;
