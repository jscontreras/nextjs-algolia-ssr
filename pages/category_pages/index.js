import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';

import { CategoriesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const searchClient = algoliasearch(
  'SGF0RZXAXL',
  '0ac0c3b165eb3773097eca1ac25d8fdd',
);

const indexName = "prod_ECOM_demo";


export default function SearchPage({ serverState, serverUrl, navItems, initialUiState = {}, queryParamsOverrides = {} }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <CategoriesApp
        hideMenu={false}
        filters={false}
        searchClient={searchClient}
        indexName={indexName}
        initialUiState={initialUiState}
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

/**
 * Server Side Rendering o the Main Categories landing page.
 * @param {} param0
 * @returns
 */
export async function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const navItems = [{ url: 'category_pages', title: 'Category pages' }];
  const queryParamsOverrides = { hitsPerPage: 10, ruleContexts: ['browse_search-page'] };

  // Load the initial UI State for the hierarchycal Page doesn't override any facets.
  const initialUiState = {};

  // Render properties for backend rendering
  const renderProps = {
    serverUrl,
    navItems,
    initialUiState,
    queryParamsOverrides
  };
  const serverState = await getServerState(<SearchPage {...renderProps} />);
  return {
    props: {
      serverState,
      ...renderProps
    },
  };
}
