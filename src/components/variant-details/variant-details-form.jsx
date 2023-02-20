import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import {useIntl} from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import Grid from '@commercetools-uikit/grid';
import validate from './validate';
import messages from './messages';
import {useHistory, useParams, useRouteMatch} from "react-router-dom";
import {BinLinearIcon } from '@commercetools-uikit/icons';
import TextField from '@commercetools-uikit/text-field';
import './variant-style.css';
import IconButton from '@commercetools-uikit/icon-button';
import {DOMAINS} from "@commercetools-frontend/constants";
import {transformErrors} from "./transform-errors";
import {useShowApiErrorNotification, useShowNotification} from "@commercetools-frontend/actions-global";
import {useVariantDetailsUpdater} from "../../hooks/use-variants-connector/use-variants-connector";
import FilerobotFormModal from "../filerobot/filerobot";
import {useEffect, useState} from "react";

const VariantDetailsForm = (props) => {
    const intl = useIntl();
    const formik = useFormik({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        enableReinitialize: true,
    });
    const params = useParams();
    const showNotification = useShowNotification();
    const showApiErrorNotification = useShowApiErrorNotification();
    const variantDetailsUpdater = useVariantDetailsUpdater();

    const variants = formik.values.allVariants;
    const variantId = parseInt(params.variantId);
    let variant = variants[0];
    let variantKey;
    for (let i = 0; i < variants.length; i++) {
        if (variants[i].id === variantId) {
            variant = variants[i];
            variantKey = i;
            break;
        }
    }
    const [images, setImages] = useState([]);
    useEffect(() =>{
        setImages(variant.images);
    }, []);


    let gridView;
    if (images.length) {
        gridView = (
            <Grid
                gridGap="16px"
                gridTemplateColumns="repeat(2, 1fr)"
            >
                {images.map((image, index) => (
                    <Grid.Item key={index.toString()}>
                        <Grid
                            gridGap="8px"
                            gridTemplateColumns="0fr 20fr"
                            className={"imageInfo variantKey-" + index.toString()}
                        >
                            <Grid.Item>
                                <div className={"imageContainer"} >
                                    <img src={image.url} alt={image.label} />
                                </div>
                            </Grid.Item>
                            <Grid.Item>
                                <Grid
                                    gridGap="8px"
                                    gridTemplateRows="auto auto"
                                    alignContent="space-between"
                                    style={{ height: "100%" }}
                                >
                                    <Grid.Item>
                                        <div className={"imageLabel"}>
                                            <TextField
                                                name={image.url.replaceAll('.', ',')}
                                                title={intl.formatMessage(messages.variantImageLabel)}
                                                value={image.label}
                                                touched={formik.touched[image.url.replaceAll('.', ',')]}
                                                onChange={(e) => {
                                                    let newImages = images.map((img, key) => {
                                                        if (index === key) {
                                                            props.primaryButton(false);
                                                            props.secondaryButton(false);
                                                            return {
                                                                url: img.url,
                                                                label: e.target.value,
                                                            }
                                                        }
                                                        return img;
                                                    });
                                                    setImages(newImages);
                                                    formik.setFieldValue(image.url.replaceAll('.', ','), e.target.value)
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </Grid.Item>
                                    <Grid.Item>
                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <IconButton icon={<BinLinearIcon />} label={"Deleted Image"} onClick={async () => {
                                                if (window.confirm("Do you want delete it?")) {
                                                    let convertData = [
                                                        {
                                                            removeImage: {
                                                                imageUrl: image.url,
                                                                variantId: variantId
                                                            }
                                                        }
                                                    ];
                                                    try {
                                                        await variantDetailsUpdater.execute({
                                                            originalDraft: formik.values,
                                                            nextDraft: convertData,
                                                        });
                                                        showNotification({
                                                            kind: 'success',
                                                            domain: DOMAINS.SIDE,
                                                            text: intl.formatMessage(messages.variantUpdated, {
                                                                variantSku: variant.sku
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
                                            }}/>
                                        </div>
                                    </Grid.Item>
                                </Grid>
                            </Grid.Item>
                        </Grid>
                    </Grid.Item>
                ))}
            </Grid>
        );
    }

    const formElements = (
        <Spacings.Stack scale="xl">
            <div className={"variantHeader"}>
                <h2>Images</h2>
                <FilerobotFormModal productId={formik.values.id} variantId={variantId.toString()} variant={variant} sku={variant.sku} product={formik.values}/>
            </div>
            {gridView}
        </Spacings.Stack>
    );

    return props.children({
        formElements,
        values: formik.values,
        isDirty: formik.dirty,
        isSubmitting: formik.isSubmitting,
        submitForm: formik.handleSubmit,
        handleReset: formik.handleReset,
    });
};
VariantDetailsForm.displayName = 'VariantDetailsForm';
VariantDetailsForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    isReadOnly: PropTypes.bool.isRequired,
    dataLocale: PropTypes.string.isRequired,
    primaryButton: PropTypes.func.isRequired,
    secondaryButton: PropTypes.func.isRequired
};

export default VariantDetailsForm;