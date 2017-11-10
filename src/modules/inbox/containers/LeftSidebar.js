import React from 'react';
import PropTypes from 'prop-types';
import { compose, gql, graphql } from 'react-apollo';
import { TAG_TYPES } from 'modules/tags/constants';
import { LeftSidebar as LeftSidebarComponent } from '../components';
import { Wrapper } from 'modules/layout/components';
import { Spinner } from 'modules/common/components';
import { KIND_CHOICES as INTEGRATIONS_TYPES } from 'modules/settings/integrations/constants';
import { queries } from '../graphql';

const LeftSidebar = props => {
  const {
    conversationsQuery,
    channelsQuery,
    brandsQuery,
    tagsQuery,
    conversationCountsQuery
  } = props;

  if (
    conversationsQuery.loading ||
    channelsQuery.loading ||
    brandsQuery.loading ||
    tagsQuery.loading ||
    conversationCountsQuery.loading
  ) {
    return (
      <Wrapper.Sidebar wide full>
        <Spinner />
      </Wrapper.Sidebar>
    );
  }

  const conversations = conversationsQuery.conversations;
  const channels = channelsQuery.channels || [];
  const brands = brandsQuery.brands || [];
  const tags = tagsQuery.tags || [];
  const counts = conversationCountsQuery.conversationCounts || {};

  const integrations = INTEGRATIONS_TYPES.ALL_LIST.map(item => ({
    _id: item,
    name: item
  }));

  const updatedProps = {
    ...props,
    conversations,
    channels,
    brands,
    tags,
    integrations,
    counts
  };

  return <LeftSidebarComponent {...updatedProps} />;
};

LeftSidebar.propTypes = {
  conversationsQuery: PropTypes.object,
  channelsQuery: PropTypes.object,
  brandsQuery: PropTypes.object,
  tagsQuery: PropTypes.object,
  conversationCountsQuery: PropTypes.object
};

export default compose(
  graphql(gql(queries.conversationList), {
    name: 'conversationsQuery',
    options: ({ queryParams }) => {
      const params = { ...queryParams };
      delete params._id;

      return {
        variables: { params }
      };
    }
  }),
  graphql(gql(queries.channelList), {
    name: 'channelsQuery',
    options: ({ queryParams }) => {
      return {
        variables: { params: queryParams }
      };
    }
  }),
  graphql(gql(queries.brandList), {
    name: 'brandsQuery',
    options: () => ({
      fetchPolicy: 'network-only'
    })
  }),
  graphql(gql(queries.tagList), {
    name: 'tagsQuery',
    options: () => {
      return {
        variables: {
          type: TAG_TYPES.CONVERSATION
        },
        fetchPolicy: 'network-only'
      };
    }
  }),
  graphql(gql(queries.conversationCounts), {
    name: 'conversationCountsQuery',
    options: ({ queryParams }) => ({
      variables: {
        params: {
          ...queryParams
        }
      }
    })
  })
)(LeftSidebar);
