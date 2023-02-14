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
import FetchProductsQuery from './fetch-products.ctp.graphql';
import FetchProductDetailsQuery from './fetch-product-details.ctp.graphql';
import UpdateProductDetailsMutation from "./update-product-details.ctp.graphql";

export const useProductsFetcher = ({ page, perPage, tableSorting }) => {
  const { data, error, loading } = useMcQuery(FetchProductsQuery, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    productsPaginatedResult: data?.products,
    error,
    loading,
  };
};


export const useProductDetailsFetcher = (productId) => {
  const { data, error, loading } = useMcQuery(FetchProductDetailsQuery, {
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

export const useProductDetailsUpdater = () => {
  const [updateProductDetails, { loading }] = useMcMutation(
      UpdateProductDetailsMutation
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