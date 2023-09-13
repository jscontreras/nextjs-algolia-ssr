import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { CategoriesApp } from '../../components';
import Link from 'next/link';
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import { searchClient } from '../../lib/common';

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
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
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

  const navItems = [{ url: 'category_pages', title: 'Catalog 🔎' }];
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
  const serverState = await getServerState(<SearchPage {...renderProps} />, {renderToString});
  return {
    props: {
      serverState,
      ...renderProps,
      serverUrl
    },
  };
}
