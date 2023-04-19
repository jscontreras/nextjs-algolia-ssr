import React, { useEffect, useState, useLayoutEffect } from 'react';
import aa from 'search-insights';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';

import Image from 'next/future/image';
import {
  HierarchicalMenu,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  Snippet,
  RefinementList,
  useInstantSearch
} from 'react-instantsearch-hooks-web';
import { BreadCrumbs } from './breadcrumbs';
import { CategoriesMenu } from './categoriesMenu';
import Link from 'next/link';
import Router from 'next/router';

aa('setUserToken', 'ma-user-999');

function InsightsMiddleware() {
  const { use } = useInstantSearch();

  useEffect(() => {
    const middleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    return use(middleware);
  }, [use]);

  return null;
}

const Instructions = ({ categoryPage, url, filterName }) => (
  <>{categoryPage ? (<div className='mb-4 mt-2 text-sm'>
    <p>Use the <span className='font-bold'>{filterName}</span> widget to refine the search using (<span className="text-amber-600 italic">facets, facetsFilters</span>).
      This facet uses the <span className='font-bold'>HierarchicalMenu</span> InstantSearch widget via the &ldquo;lvl.*&rdquo; categories format.</p>
    <p className='mt-2'> Alternatively, the <span className='font-bold'>Nav Category Links</span> widget allows catalog navigation by proving URLs to the corresponding categories landing pages via the
      (<span className='italic text-amber-600'>filters</span>) parameter.</p>
    <p className='mt-2'>Visit the <Link href='https://www.algolia.com/doc/guides/solutions/ecommerce/browse/tutorials/category-pages/'><a target="_blank" className="text-blue-600 underline" >Algolia Categories</a></Link> documentation to get more information.</p>
  </div>) : (
    <div className='mb-4 mt-2 text-sm'>
      <p>Filter attributes are obtained by parsing the URL path
        <span className='italic text-amber-600'> {url}</span> into the corresponding query&apos;s filter value.
      </p>
        <p className='mt-2'>You can use different attributes to filter your category pages. However, the <span className='font-bold'>category_page_id</span> facets format exposes the hierarchy, and can also be used as the category attribute for
          <a className="text-blue-600 underline" href="https://academy.algolia.com/collections/bbcde9a8-c1b5-11ed-8f15-06cf503dca07" target='_blank' rel="noreferrer"> Merchandizing Studio</a>,
          <a className="text-blue-600 underline" href="https://www.algolia.com/doc/guides/personalization/what-is-personalization" target='_blank' rel="noreferrer"> AI Personalization</a>,
          <a className="text-blue-600 underline" href="https://www.algolia.com/doc/guides/algolia-ai/query-categorization/" target='_blank' rel="noreferrer"> Query Categorization</a>, etc. </p>
      <p className='mt-2'>Visit the <Link href='https://www.algolia.com/doc/guides/algolia-ai/query-categorization/'><a target="_blank" className="text-blue-600 underline" >Algolia Categories Guideline</a></Link> to get more information.</p>
    </div>
  )}
  </>
)

const FilterToggle = ({ setEnabled, filters, customFilterLabel }) => {
  const [active, setActive] = useState(true);
  return (
    <div className='flex justify-between flex-col flex-wrap'>
      <label className=" text-sm inline-flex relative items-center ml-5 mt-3 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={active}
          readOnly
        />
        <div
          onClick={() => {
            setEnabled();
            setActive(!active);
          }}
          className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
        ></div>
        <span className='ml-2'>Use <span className="font-medium text-amber-500">{customFilterLabel}</span> attribute as filter.</span>
      </label>
      <div className="p-3 mt-4 text-center mb-0 text-xs w-100 bg-sky-100	">Using filter (<span className='font-bold'>{filters}</span>)</div>

    </div>
  );
}

const ProductImage = ({ src, alt }) => {
  const placeholderImg = '/ef3-placeholder-image.jpg';
  const [srcVal, setSrc] = useState(() => (src || placeholderImg));
  return <Image src={srcVal} alt={alt} layout='fill' width={120} height={120} onError={() => { setSrc(placeholderImg) }} />
}

const HitComponent = ({ hit, sendEvent }) => (
  <div className="hit">
    <div className="hit-picture">
      <ProductImage src={`${hit.image_urls[0]}`} alt={hit.name} />
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
        <span> - ${hit.price.value}</span>
        <span> - {hit.rating} stars</span>
        <p>
          <button className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-semibold py-1 px-2 rounded-md shadow-md"
            onClick={() => {
              sendEvent('conversion', hit, 'Product Ordered');
            }}>Add to cart</button>
        </p>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Snippet attribute="description" hit={hit} />...
      </div>
      <div className='flex'>
        <div className="hit-categories  text-xs p-5 border rounded mr-2">
          <h4 className='text-xs mb-2 font-bold'>hierarchical_categories (Facet)</h4>
          <ul className='pl-1'>
            [{Object.keys(hit.hierarchical_categories).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-amber-500" >{`"${key}:${hit.hierarchical_categories[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
        <div className="hit-categories text-xs p-5 border rounded mr-2">
          <h4 className='text-xs mb-2 font-bold'>list_categories (Facet)</h4>
          <ul className='pl-1'>
            [{Object.keys(hit.list_categories).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-sky-500" >{`"${hit.list_categories[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
        <div className="hit-categories  text-xs border-solid p-5 border rounded">
          <span className='text-xs mb-2 font-bold'>category_page_id (Facet):</span>
          <ul className='pl-1'>
            [{Object.keys(hit.category_page_id).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-emerald-500" >{`"${hit.category_page_id[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export function CategoriesApp({ queryParamsOverrides, rootPath, searchClient, indexName, title, navItems, initialUiState, routing, extraFilters = {} }) {

  const defaultFilterLabel = 'category_page_id';
  const alternateFilterLabel = extraFilters.label ? extraFilters.label : 'list_categories';

  const [queryParams, setQueryParams] = useState(queryParamsOverrides);
  const [filterLabel, setFilterLabel] = useState(defaultFilterLabel);
  const [url, setUrl] = useState();
  const toggleFilter = () => {
    // If defaultFilterLabel is Selected
    if (filterLabel == defaultFilterLabel) {
      setQueryParams({ ...queryParamsOverrides, filters: extraFilters.filters });
      setFilterLabel(alternateFilterLabel);
    } else {
      setQueryParams({ ...queryParamsOverrides });
      setFilterLabel(defaultFilterLabel);
    }
  };

  useEffect(() => {
    // checking if server filters were updated
    if (filterLabel == defaultFilterLabel && queryParams.filters != queryParamsOverrides.filters) {
      setQueryParams({ ...queryParamsOverrides });
    }
    if (filterLabel == alternateFilterLabel && queryParams.filters != extraFilters.filters) {
      setQueryParams({ ...queryParamsOverrides, filters: extraFilters.filters });
    }
    // Updating URL with router
    setUrl(window.location.pathname);
    const handleBeforeHistoryChange = () => {
      setUrl(window.location.pathname);
    };
    Router.events.on('routeChangeComplete', handleBeforeHistoryChange);
    return () => {
      Router.events.off('routeChangeComplete', handleBeforeHistoryChange);
    };

  }, [url, queryParams, filterLabel, queryParamsOverrides, alternateFilterLabel, extraFilters.filters])

  // If want to use router use routing={routing}
  return (
    <InstantSearch indexName={indexName} searchClient={searchClient} initialUiState={initialUiState} routing={routing} >
      <Configure {...queryParams} clickAnalytics />
      <InsightsMiddleware />
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-4">{title ? `${title} Landing Page` : 'Dynamic Routes (Categories) + Next.js'}</h1>
        <Instructions categoryPage={!queryParams.filters} url={url} filterName={!queryParams.filters ? 'Nav Hierarchy Facets' : alternateFilterLabel} />
        <SearchBox />
      </header>
      <BreadCrumbs items={navItems || []} />
      {queryParams.filters && <FilterToggle setEnabled={toggleFilter} filters={queryParams.filters} customFilterLabel={filterLabel} />}

      <main>
        <div className="menu text-sm">
          <div className="p-3 mb-3 text-center mb-0 text-xs w-100 bg-purple-100	">
            Using rootPath (<span className='font-bold whitespace-nowrap'>{rootPath ? rootPath : 'Null'}</span>)
            <span className='text-slate-500 whitespace-nowrap text-xs italic'>[hierarchical_categories]</span>
          </div>
          <h2 className='font-bold mb-2'>Nav Hierarchy <span className='font-normal italic'>(Facets)</span></h2>
          <HierarchicalMenu attributes={[
            'hierarchical_categories.lvl0',
            'hierarchical_categories.lvl1',
            'hierarchical_categories.lvl2',
            'hierarchical_categories.lvl3',
          ]} rootPath={rootPath} />
          <h2 className='font-bold mb-2 mt-8'>Nav Category <span className='font-normal italic'>(Links)</span></h2>
          <CategoriesMenu attributes={[
            'hierarchical_categories.lvl0',
            'hierarchical_categories.lvl1',
            'hierarchical_categories.lvl2',
            'hierarchical_categories.lvl3',
          ]} rootPath={rootPath} />
          <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2 mt-4' }} searchable={true}
            searchablePlaceholder="Brands" />
        </div>
        <div className="results">
          <Hits hitComponent={HitComponent} />
        </div>
      </main>
      <footer>
        <Pagination />
        <div>
          See{' '}
          <a className='underline' href="https://github.com/jscontreras/nextjs-algolia-ssr/tree/main/pages">
            source code
          </a>{' '}
          on GitHub
        </div>
      </footer>
    </InstantSearch>
  );
}
