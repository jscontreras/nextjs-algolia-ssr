import React from 'react';
import { hasCookie, getCookie } from 'cookies-next';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createFetchRequester } from '@algolia/requester-fetch';
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


export default function SearchPage({ serverState, serverUrl, navItems, filters, title, defaultFilterSelected }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <CategoriesApp
        hideMenu={true}
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
        title={title}
        defaultFilterSelected={defaultFilterSelected}
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

export async function getServerSideProps({ req, query, res }) {
  const defaultFilter = 'category';
  let filterMode = defaultFilter;
  let filters = {};
  if (hasCookie('filterMode', { req, res })) {
    filterMode = getCookie('filterMode', { req, res });
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  // Using categories (filter)
  filters['defaultFilter'] = query.categories.map((category) => {
    const separator = '"'
    return `list_categories:${separator}${category.replaceAll('-', ' ')}${separator}`
  }).join(' AND ')

  if (query.categories.length > 0) {
    // Category ID (filter)
    filters['defaultFilter'] = `category_page_id:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;
  }

  // OR using hierarchical_categories (filter)
  filters['customFilter'] = `hierarchical_categories.lvl${query.categories.length - 1}:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;
  filters['customFilterLabel'] = 'hierarchical_categories';

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
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} {...{ navItems, filters, title }} />);
  return {
    props: {
      serverState,
      serverUrl,
      navItems: navItems,
      filters: filters,
      defaultFilterSelected: filterMode === defaultFilter,
      title
    },
  };
}
