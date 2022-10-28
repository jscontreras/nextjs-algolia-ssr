import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createFetchRequester } from '@algolia/requester-fetch';
import { hasCookie, getCookie } from 'cookies-next';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createNullCache } from '@algolia/cache-common';

import { CategoriesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
  {
    requester: createFetchRequester(),
    responsesCache: createNullCache(),
    requestsCache: createNullCache({ serializable: false })
  }
);

const indexName = "instant_search";


export default function SearchPage({ serverState, serverUrl, navItems, defaultFilterSelected }) {
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
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, res }) {
  const defaultFilter = 'category';
  let filterMode = defaultFilter;
  if (hasCookie('filterMode', { req, res })) {
    filterMode = getCookie('filterMode', { req, res });
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />);
  return {
    props: {
      serverState,
      serverUrl,
      defaultFilterSelected: filterMode === defaultFilter,
      navItems: [{ url: 'category_pages', title: 'Category pages' }]
    },
  };
}
