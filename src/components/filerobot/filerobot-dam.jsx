import Filerobot from "@filerobot/core";
import Explorer from "@filerobot/explorer";
import XHRUpload from "@filerobot/xhr-upload";
import '@filerobot/core/dist/style.min.css';
import '@filerobot/explorer/dist/style.min.css';
import React, { useRef, useEffect } from 'react';

const FilerobotDAM = () => {
    const filerobot = useRef(null);

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
                console.dir(files);
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

export default FilerobotDAM;
