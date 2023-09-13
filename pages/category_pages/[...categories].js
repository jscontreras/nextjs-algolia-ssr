import React from 'react';
import { CategoriesApp } from '../../components';
import Link from 'next/link';
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';

const indexName = "prod_ECOM_demo";

/**
 * Server side rendering of a particular Category.
 * @param {*} param0
 * @returns
 */
export default function SearchPage(
  {
    initialUiState = {},
    serverState, navItems,
    queryParamsOverrides = {},
    serverUrl,
    title, rootPath = '',
    extraFilters = {} }) {
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
        queryParamsOverrides={queryParamsOverrides}
        extraFilters={extraFilters}
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req, query }) {
  const defaultFilter = 'category_page_id';
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
    title: 'Catalog'
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
    hitsPerPage: 10,
    filters,
    ruleContexts: ['browse_category'],
    analyticsTags: ['browse', title.replace(/\s/g, "-").toLowerCase()]
  };

  // Load the initial UI State for the hierarchycal Menus (setting the context for the facets)
  const initialUiState = {
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
    queryParamsOverrides,
    extraFilters: {
      label: filtersDefinitions['list_categoriesLabel'],
      filters: filtersDefinitions['list_categories']
    },
  }

  // Getting Server State for hydration.
  const serverState = await getServerState(<SearchPage {...renderProps} />, {renderToString});

  return {
    props: {
      ...renderProps, serverState, serverUrl
    }
  };
}
