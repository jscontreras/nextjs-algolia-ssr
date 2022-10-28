import React from 'react';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
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
  const defaultFilter = 'category_page_id';
  let filterMode = defaultFilter;
  let filters = {};
  if (hasCookie('filterMode', { req, res })) {
    filterMode = getCookie('filterMode', { req, res });
  } else {
    setCookie('filterMode', defaultFilter, { req, res });
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  // Using category (filter)
  filters['list_categories'] = query.categories.map((category) => {
    const separator = '"';
    return `list_categories:${separator}${category.replaceAll('-', ' ')}${separator}`
  }).join(' AND ')
  filters['list_categoriesLabel'] = 'list_categories';

  // category_page_id
  filters['category_page_id'] = `category_page_id:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;
  filters['category_page_idLabel'] = 'list_categories';

  // OR using hierarchical_categories (filter)
  filters['customFilter'] = `hierarchical_categories.lvl${query.categories.length - 1}:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;
  filters['customFilterLabel'] = 'hierarchical_categories';
  filters['hierarchical_categories'] = `hierarchical_categories.lvl${query.categories.length - 1}:'${query.categories.join(' > ').replaceAll('-', ' ')}'`;
  filters['hierarchical_categoriesLabel'] = 'hierarchical_categories';

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

  if (filterMode !== 'hierarchical_categories' && filters[filterMode]) {
    filters = { ...filters, defaultFilter: filters[filterMode], defaultFilterLabel: filters[`${filterMode}Label`] }
  } else {
    filters = { ...filters, defaultFilter: filters['category_page_id'], defaultFilterLabel: filters['category_page_idLabel'] }
  }

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
      defaultFilterSelected: filters.customFilterLabel !== filterMode,
      title
    },
  };
}
