import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createFetchRequester } from '@algolia/requester-fetch';
import { createNullCache } from '@algolia/cache-common';
import { ArticlesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const searchClient = algoliasearch(
  'testing78Z9OD0TCK',
  'd18844ce6e75f713f36a0fbe3262f9fa',
  {
    requester: createFetchRequester(),
    responsesCache: createNullCache(),
    requestsCache: createNullCache({ serializable: false })
  }
);

const indexName = "sit_escape_content";


export default function SearchPage({ serverState, serverUrl, navItems, filters }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <ArticlesApp
        hideMenu={true}
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
        routing={{
          router: history({
            getLocation: () =>
              typeof window === 'undefined' ? new URL(serverUrl) : window.location,
          }),
        }}
        filters={filters}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, query }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />);
  let filters = `locationsHierarchy.lvl${query.categories.length - 1}:'${query.categories.join(' / ')}'`;
  const navItems = [{
    url: '/category_pages',
    title: 'Category pages'
  }];
  let url = '';
  query.categories.forEach((element, key) => {
    url+=`/${element}`
    navItems.push({
      url: `/category_pages/${url}`,
      title: element
    });
  });

  return {
    props: {
      serverState,
      serverUrl,
      navItems: navItems,
      filters
    },
  };
}
