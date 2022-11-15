import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createFetchRequester } from '@algolia/requester-fetch';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createNullCache } from '@algolia/cache-common';

import { CategoriesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const searchClient = algoliasearch(
  'U9UXVSI686',
  '341cf4d4310a13c8c6e6c9a069959cd5',
  {
    requester: createFetchRequester(),
    responsesCache: createNullCache(),
    requestsCache: createNullCache({ serializable: false })
  }
);

const indexName = "prod_ECOM";


export default function SearchPage({ serverState, serverUrl, navItems, defaultFilterSelected, queryParamsOverrides ={} }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <CategoriesApp
        hideMenu={false}
        defaultFilterSelected={defaultFilterSelected}
        filters={false}
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
        routing={{
          router: history({
            getLocation: () =>
              typeof window === 'undefined' ? new URL(serverUrl) : window.location,
          }),
        }}
        queryParamsOverrides={queryParamsOverrides}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, res }) {
  const defaultFilter = 'category_page_id';
  let filterMode = defaultFilter;
  // Getting custom filter
  if (hasCookie('filterMode', { req, res })) {
    filterMode = getCookie('filterMode', { req, res });
  } else {
    setCookie('filterMode', defaultFilter, { req, res });
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const defaultFilterSelected = filterMode !== 'hierarchical_categories';
  const navItems = [{ url: 'category_pages', title: 'Category pages' }];
  const queryParamsOverrides = { hitsPerPage: 12, ruleContexts: ['browse_search-page'] };
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />);
  return {
    props: {
      serverState,
      serverUrl,
      defaultFilterSelected,
      navItems,
      queryParamsOverrides
    },
  };
}
