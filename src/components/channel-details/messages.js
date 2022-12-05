import { defineMessages } from 'react-intl';

export default defineMessages({
  backToChannelsList: {
    id: 'ProductDetails.backToChannelsList',
    defaultMessage: 'Back to channels list',
  },
  duplicateKey: {
    id: 'ProductDetails.duplicateKey',
    defaultMessage: 'A channel with this key already exists.',
  },
  channelUpdated: {
    id: 'ProductDetails.channelUpdated',
    defaultMessage: 'Channel {channelName} updated',
  },
  channelKeyLabel: {
    id: 'ProductDetails.channelKeyLabel',
    defaultMessage: 'Channel key',
  },
  channelNameLabel: {
    id: 'ProductDetails.channelNameLabel',
    defaultMessage: 'Channel name',
  },
  channelRolesLabel: {
    id: 'ProductDetails.channelRolesLabel',
    defaultMessage: 'Channel roles',
  },
  hint: {
    id: 'ProductDetails.hint',
    defaultMessage:
      'This page demonstrates for instance how to use forms, notifications and how to update data using GraphQL, etc.',
  },
  modalTitle: {
    id: 'ProductDetails.modalTitle',
    defaultMessage: 'Edit channel',
  },
  channelDetailsErrorMessage: {
    id: 'ProductDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the channel details. Please check your connection, the provided channel ID and try again.',
  },
});
