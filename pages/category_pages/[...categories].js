import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createFetchRequester } from '@algolia/requester-fetch';
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


export default function SearchPage({ serverState, serverUrl, navItems, filters, title }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <CategoriesApp
        hideMenu={true}
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
        title={title}
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

  // Using categories (filter)
  let filters = query.categories.map((category) => {
    const separator = '"'
    return `categories:${separator}${category.replaceAll('-', ' ')}${separator}`
  }).join(' AND ')

  // OR using hierarchicalCategories (filter)
  // filters = `hierarchicalCategories.lvl${query.categories.length - 1}:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;

  // Base element for custom Breadcrumbs
  const navItems = [{
    url: '/category_pages',
    title: 'Category pages'
  }];

  // Get Custom Breadcrumb rendering
  let url = '';
  query.categories.forEach((element, key) => {
    url += `/${element}`
    navItems.push({
      url: `/category_pages${url}`,
      title: `${element.replaceAll('-', ' ')}`
    })
  })

  // Getting Category page custom title.
  const title = query.categories.pop().replaceAll('-', ' ');
  // Getting Server State for hydration.
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} {...{navItems, filters, title}} />);

  return {
    props: {
      serverState,
      serverUrl,
      navItems: navItems,
      filters: filters,
      title
    },
  };
}
