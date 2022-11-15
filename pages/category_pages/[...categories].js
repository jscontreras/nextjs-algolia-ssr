import React from 'react';
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

/**
 * Server side rendering of a particular Category.
 * @param {*} param0
 * @returns
 */
export default function SearchPage({ serverUrl, initialUiState = {}, serverState, navItems, queryParamsOverrides = {}, title, rootPath = '' }) {
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
        queryParamsOverrides={queryParamsOverrides}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, query, res }) {
  const defaultFilter = 'hierarchical_categories';
  const filterMode = defaultFilter;
  const filtersDefinitions = {};

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  // Using category (filter)
  filtersDefinitions['list_categories'] = query.categories.map((category) => {
    const separator = '"';
    return `list_categories:${separator}${category}${separator}`
  }).join(' AND ')
  filtersDefinitions['list_categoriesLabel'] = 'list_categories';

  // category_page_id
  filtersDefinitions['category_page_id'] = `category_page_id:'${query.categories.join(' > ')}'`;
  filtersDefinitions['category_page_idLabel'] = 'category_page_id';

  // OR using hierarchical_categories (filter)
  const rootPath = query.categories.join(' > ');
  filtersDefinitions['hierarchical_categories'] = `hierarchical_categories.lvl${query.categories.length - 1}:'${query.categories.join(' > ')}'`;
  filtersDefinitions['hierarchical_categoriesLabel'] = 'hierarchical_categories';

  // Assigning hierarchical as custom
  filtersDefinitions['customFilter'] = filtersDefinitions['hierarchical_categories'];
  filtersDefinitions['customFilterLabel'] = filtersDefinitions['hierarchical_categoriesLabel'];

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
  filtersDefinitions['defaultFilter'] = filtersDefinitions[filterMode] || filtersDefinitions['category_page_id'];
  filtersDefinitions['defaultFilterLabel'] = filtersDefinitions[`${filterMode}Label`] || `category_page_id`;


  // Getting Category page custom title.
  const title = query.categories[query.categories.length - 1];

  // Setting default filter
  const filters = filtersDefinitions[defaultFilter];

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

  // Encapsulating the properties for Server Side Renderign
  const renderProps = {
    initialUiState,
    serverUrl,
    navItems,
    title,
    rootPath,
    queryParamsOverrides
  }

  // Getting Server State for hydration.
  const serverState = await getServerState(<SearchPage {...renderProps} />);

  return {
    props: {
      ...renderProps, serverState
    }
  };
}
