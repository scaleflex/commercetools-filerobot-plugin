import {
    useMcQuery,
    useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {createSyncChannels, createSyncProducts} from '@commercetools/sync-actions';
import {
    createGraphQlUpdateActions,
    extractErrorFromGraphQlResponse,
    convertToActionData,
} from '../../helpers';
import UpdateVariantDetailsMutation from "./update-variant-details.ctp.graphql";
import FetchVariantDetailsQuery from './fetch-variant-details.ctp.graphql';
import DeleteVariantImageMutation from "./delete-variant-images.ctp.graphql";

export const useVariantDetailsFetcher = (productId) => {
    const { data, error, loading } = useMcQuery(FetchVariantDetailsQuery, {
        variables: {
            productId,
        },
        context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
    });

    return {
        product: data?.product,
        error,
        loading,
    };
};

export const useVariantImagesDeleter = () => {
    const [deleteVariantImage, { loading }] = useMcMutation(
        DeleteVariantImageMutation
    );

    const syncStores = createSyncProducts();
    const execute = async ({ originalDraft, nextDraft }) => {
        const actions = syncStores.buildActions(
            nextDraft,
            convertToActionData(originalDraft)
        );
        try {
            return await updateProductDetails({
                context: {
                    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
                },
                variables: {
                    productId: originalDraft.id,
                    version: originalDraft.version,
                    actions: createGraphQlUpdateActions(actions),
                },
            });
        } catch (graphQlResponse) {
            throw extractErrorFromGraphQlResponse(graphQlResponse);
        }
    };

    return {
        loading,
        execute,
    };
};

export const useVariantDetailsUpdater = () => {
    const [updateVariantDetails, { loading }] = useMcMutation(
        UpdateVariantDetailsMutation
    );

    const syncStores = createSyncProducts();
    const execute = async ({ originalDraft, nextDraft }) => {
        const actions = syncStores.buildActions(
            nextDraft,
            convertToActionData(originalDraft)
        );
        try {
            return await updateVariantDetails({
                context: {
                    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
                },
                variables: {
                    id: originalDraft.id,
                    version: originalDraft.version,
                    actions: nextDraft
                },
            });
        } catch (graphQlResponse) {
            throw extractErrorFromGraphQlResponse(graphQlResponse);
        }
    };

    return {
        loading,
        execute,
    };
};