import Filerobot from "@filerobot/core";
import Explorer from "@filerobot/explorer";
import XHRUpload from "@filerobot/xhr-upload";
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import './custom-style.css';
import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import messages from "./messages";
import {useShowApiErrorNotification, useShowNotification} from "@commercetools-frontend/actions-global";
import {useVariantDetailsUpdater} from "../../hooks/use-variants-connector/use-variants-connector";
import {useIntl} from "react-intl";
import {DOMAINS} from "@commercetools-frontend/constants";
import {transformErrors} from "./transform-errors";
import filerobotConfig from "../../filerobot-config.json";

const FilerobotDAM = (props) => {
    const filerobot = useRef(null);
    const showNotification = useShowNotification();
    const showApiErrorNotification = useShowApiErrorNotification();
    const variantDetailsUpdater = useVariantDetailsUpdater();
    const intl = useIntl();

    useEffect(() => {
        filerobot.current = Filerobot({
            securityTemplateID : filerobotConfig.configFilerobot.sec,
            container          : filerobotConfig.configFilerobot.token
        })
            .use(Explorer, {
                config: {
                    rootFolderPath: filerobotConfig.configFilerobot.uploadDirectory
                },
                target: '#filerobot-widget',
                inline: true,
                width: "100%",
                height: "100%",
                disableExportButton: false,
                hideExportButtonIcon: true,
                preventExportDefaultBehavior: true,
                resetAfterClose: true,
                dismissUrlPathQueryUpdate: true,
                locale: {
                    strings: {
                        mutualizedExportButtonLabel: intl.formatMessage(messages.insertLabel),
                        mutualizedDownloadButton: intl.formatMessage(messages.insertLabel),
                    }
                },
            })
            .use(XHRUpload)
            .on('export', async (files, popupExportSuccessMsgFn, downloadFilesPackagedFn, downloadFileFn) => {
                let version = props.product.version;
                /**
                 * Check input file type
                 * Accept file type: jpg, jpeg, png, svg, gif, bmp, tiff
                 */
                let checkError = false;
                for (const selected of files) {
                    if (selected.file.extension !== 'jpg' && selected.file.extension !== 'jpeg'
                        && selected.file.extension !== 'png' && selected.file.extension !== 'svg'
                        && selected.file.extension !== 'gif' && selected.file.extension !== 'bmp'
                        && selected.file.extension !== 'tiff'
                    ) {
                        checkError = true;
                        showNotification({
                            kind: 'error',
                            domain: DOMAINS.SIDE,
                            text: intl.formatMessage(messages.errorFileType, {
                                type: selected.file.extension
                            }),
                        });
                    }
                }

                if (!checkError) {
                    for (const selected of files) {
                        // console.log(selected);
                        let filerobotURL = selected.file.url.cdn;
                        let newFilerobotUrl = new URL(filerobotURL);
                        if (newFilerobotUrl.searchParams.has('vh')) {
                            newFilerobotUrl.searchParams.delete('vh');
                        }

                        if (filerobotConfig.configFilerobot.cname !== '') {
                            newFilerobotUrl.host = filerobotConfig.configFilerobot.cname;
                            newFilerobotUrl.hostname = filerobotConfig.configFilerobot.cname;
                        }

                        filerobotURL = newFilerobotUrl.href;
                        let convertData = [
                            {
                                addExternalImage: {
                                    image: {
                                        url: filerobotURL,
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
                            props.product.version = parseInt(version) + 1;
                        } catch (graphQLErrors) {
                            const transformedErrors = transformErrors(graphQLErrors);
                            if (transformedErrors.unmappedErrors.length > 0) {
                                showApiErrorNotification({
                                    errors: transformedErrors.unmappedErrors,
                                });
                            }
                        }
                    }

                    showNotification({
                        kind: 'success',
                        domain: DOMAINS.SIDE,
                        text: intl.formatMessage(messages.variantUpdated, {
                            variantSku: props.sku
                        }),
                    });

                    setTimeout(function () {
                        location.reload();
                    }, 500);
                } else {
                    showNotification({
                        kind: 'error',
                        domain: DOMAINS.SIDE,
                        text: intl.formatMessage(messages.variantUpdateFail, {
                            variantSku: props.sku
                        }),
                    });
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
