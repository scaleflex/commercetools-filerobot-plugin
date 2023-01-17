import { defineMessages } from 'react-intl';

export default defineMessages({
  backToProductsList: {
    id: 'ProductDetails.backToProductsList',
    defaultMessage: 'Back to products list',
  },
  duplicateKey: {
    id: 'ProductDetails.duplicateKey',
    defaultMessage: 'A product with this key already exists.',
  },
  productUpdated: {
    id: 'ProductDetails.productUpdated',
    defaultMessage: 'Product {productName} updated',
  },
  productKeyLabel: {
    id: 'ProductDetails.productKeyLabel',
    defaultMessage: 'Product key',
  },
  productNameLabel: {
    id: 'ProductDetails.productNameLabel',
    defaultMessage: 'Product name',
  },
  productRolesLabel: {
    id: 'ProductDetails.productRolesLabel',
    defaultMessage: 'Product roles',
  },
  hint: {
    id: 'ProductDetails.hint',
    defaultMessage:
      'This page demonstrates for instance how to use forms, notifications and how to update data using GraphQL, etc.',
  },
  modalTitle: {
    id: 'ProductDetails.modalTitle',
    defaultMessage: 'Edit product',
  },
  productDetailsErrorMessage: {
    id: 'ProductDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the product details. Please check your connection, the provided product ID and try again.',
  },
  changeVariantImage: {
    id: 'ProductDetails.changeVariantImage',
    defaultMessage: 'Change Image'
  }
});
