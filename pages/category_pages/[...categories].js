import React, {useEffect,useState} from 'react';
import { hasCookie, getCookie, setCookie } from 'cookies-next';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { createFetchRequester } from '@algolia/requester-fetch';
import { createNullCache } from '@algolia/cache-common';
import { CategoriesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const algoliaClient = algoliasearch(
  'U9UXVSI686',
  '341cf4d4310a13c8c6e6c9a069959cd5',
  {
    requester: createFetchRequester(),
    responsesCache: createNullCache(),
    requestsCache: createNullCache({ serializable: false })
  }
);

const searchClient = {
  ...algoliaClient,
};

const indexName = "prod_ECOM";


export default function SearchPage({ serverUrl, initialUiState ={}, serverState, navItems, queryParamsOverrides = {}, title, rootPath='' }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <CategoriesApp
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
        title={title}
        rootPath={rootPath}
        initialUiState={initialUiState}
        routing={{
          router: history({
            getLocation: () =>
              typeof window === 'undefined' ? new URL(serverUrl) : window.location,
          }),
        }}
        queryParamsOverrides = {queryParamsOverrides}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, query, res }) {
  let filterMode = 'category_page_id';
  let filters = {};

  // Identidying the filter
  if (hasCookie('filterMode', { req, res })) {
    filterMode = getCookie('filterMode', { req, res });
  } else {
    setCookie('filterMode', filterMode, { req, res });
  }

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  // Using category (filter)
  filters['list_categories'] = query.categories.map((category) => {
    const separator = '"';
    return `list_categories:${separator}${category}${separator}`
  }).join(' AND ')
  filters['list_categoriesLabel'] = 'list_categories';

  // category_page_id
  filters['category_page_id'] = `category_page_id:'${query.categories.join(' > ')}'`;
  filters['category_page_idLabel'] = 'category_page_id';

  // OR using hierarchical_categories (filter)
  const rootPath = query.categories.join(' > ');
  filters['hierarchical_categories'] = `hierarchical_categories.lvl${query.categories.length - 1}:'${query.categories.join(' > ')}'`;
  filters['hierarchical_categoriesLabel'] = 'hierarchical_categories';

  // Assigning hierarchical as custom
  filters['customFilter'] = filters['hierarchical_categories'];
  filters['customFilterLabel'] = filters['hierarchical_categoriesLabel'];

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
      title: `${element}`
    })
  })

  // Providing customFilter and customFilterLabel based on defaultFilter
  filters['defaultFilter'] = filters[filterMode] || filters['category_page_id'];
  filters['defaultFilterLabel'] = filters[`${filterMode}Label`] || `category_page_id`;

  // The status of the toggle depends on the cookie
  if (!hasCookie('defaultFilterSelected', {req, res})) {
    setCookie('defaultFilterSelected', true, {req, res});
  }

  // Getting Category page custom title.
  const title = query.categories[query.categories.length - 1];
  filters = filters['hierarchical_categories'];

  const facets = []
  for (let index = 0; index < query.categories.length + 1; index++) {
    facets.push(`hierarchical_categories.lvl${index}`);
  }


  const hierarchicalMenu = {};
  hierarchicalMenu['hierarchical_categories.lvl0'] = query.categories;

  const queryParamsOverrides = {
     filters, ruleContexts: ['browse_category'], analyticsTags: ['browse', title.replace(/\s/g, "-").toLowerCase()]
  };

  // Load the initial UI State for the hierarchycal Menus
  const initialUiState = {
    configure: queryParamsOverrides,
    prod_ECOM: {
      hierarchicalMenu
    }
  };
  // Getting Server State for hydration.
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} navItems={navItems} title={title} rootPath={rootPath} initialUiState={initialUiState} queryParamsOverrides={queryParamsOverrides} />);

  return {
    props: {
      initialUiState,
      serverState,
      serverUrl,
      navItems,
      title,
      rootPath,
      queryParamsOverrides
    }
  };
}
