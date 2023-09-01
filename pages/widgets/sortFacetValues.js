/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/future/image';
import algoliasearch from 'algoliasearch/lite';

import {
  HierarchicalMenu,
  DynamicWidgets,
  SearchBox,
  Hits,
  Highlight,
  Pagination,
  InstantSearch,
  RefinementList,
  CurrentRefinements,
  ClearRefinements,
  useInstantSearch,
  Snippet,
  ToggleRefinement
} from 'react-instantsearch';
import { CustomBreadcrumb } from '../../components/customBreadcrumb';

const APP_ID = 'SGF0RZXAXL';
const SEARCH_API_KEY = '0ac0c3b165eb3773097eca1ac25d8fdd';
const searchClient = algoliasearch(
  APP_ID,
  SEARCH_API_KEY,
);

const indexName = "instant_search";

// Control the Initial Render with InitialUIState
const initialUiState = {
  "instant_search": {
    "hierarchicalMenu": {
      "hierarchicalCategories.lvl0": [
        "Cameras & Camcorders",
        "Digital Cameras"
      ]
    }
  }
}

// This Middleware will show you the states
function middleware({ instantSearchInstance }) {
  return {
    onStateChange({ uiState }) {
      console.log('uiState', uiState)
    },
    subscribe() { },
    unsubscribe() { }
  }
}

function Middleware() {
  const { addMiddlewares } = useInstantSearch();

  React.useLayoutEffect(() => {
    return addMiddlewares(middleware);
  });
}

const Instructions = ({ brandsFacetPinnedValues }) => (
  <div className='mt-0 mb-4 text-sm'>
    <p>The <span className="text-amber-600 italic">brand</span> facet contains values for multiple products <span className='italic'>(mobiles, cameras, etc.)</span>.</p>
    <p className='mb-2'>The current brand facet configuration, contains the following pinned items</p>
    <span className='text-emerald-100 bg-black p-1'>{JSON.stringify(brandsFacetPinnedValues, 1, null)}</span>
    <p className='mt-2'> Check the pinned values for <span className='font-bold italic'>{"Cameras & Camcorders > Digital Cameras"}</span> and <span className='font-bold italic'>{"Cell Phones"}</span> categories. </p>
  </div>
)

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div className="hit-picture">
      {/* <img src={`${hit.image}`} alt={hit.name}/> */}
      <Image src={`${hit.image}`} alt={hit.name} layout='fill' width={150} height={150} />
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
        <span> - ${hit.price}</span>
        <span> - {hit.rating} stars</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Snippet attribute="description" hit={hit} />
      </div>
    </div>
  </div>
);

export default function SearchPage({ brandsOrder }) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      initialUiState={initialUiState}
    >
      <Middleware />
      <header>
        <CustomBreadcrumb attributes={[
          'hierarchicalCategories.lvl0',
          'hierarchicalCategories.lvl1',
          'hierarchicalCategories.lvl2',
        ]}
          rootItems={[{ label: 'Home', value: '/' }, { label: 'Full Catalog', value: '' }]}
        />
        <h1 className="text-2xl font-bold mb-4 mt-2">
          Sorting Brand Facets Values</h1>
        <Instructions brandsFacetPinnedValues={brandsOrder} />
        <SearchBox />
      </header>
      <main>
        <div className="rules-dynamic-widgets">
          <HierarchicalMenu attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
          ]} separator=' > ' />
          <DynamicWidgets facets={['*']}>
            <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2' }}
              searchablePlaceholder="Brands" operator='or' limit={20} />
            <ToggleRefinement attribute="free_shipping" label=" Free shipping" classNames={{
              root: 'MyCustomToggleRefinement bg-emerald-100 p-3 pr-0 mr-2',
              checkbox: 'MyCustomToggleRefinementCheckbox MyCustomToggleRefinementCheckbox--subclass',
            }} title="Shipping Options" />
          </DynamicWidgets>

        </div>
        <div className="results">
          <div className='flex min-w-full	'>
            <CurrentRefinements classNames={{ category: 'mr-1', root: 'mt-1 mb-2' }}
              transformItems={(items) => {
                return items.map((item) => {
                  if (item.attribute == 'free_shipping') {
                    item.label = 'Free Shipping'
                  }
                  if (item.label.includes('hierarchicalCategories')) {
                    item.label = 'Category';
                  }
                  return item;
                })
              }}
            />
            <ClearRefinements classNames={{ button: 'mt-2 h-7', disabledButton: 'hidden' }} />
          </div>
          <Hits hitComponent={HitComponent} />
        </div>
      </main>
      <footer>
        <Pagination />
      </footer>
    </InstantSearch>
  );
}

// pages/index.js
export async function getServerSideProps() {
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
  const adminClient = algoliasearch(
    APP_ID,
    adminKey,
  );
  const index = adminClient.initIndex(indexName);
  const settings = await index.getSettings();
  return {
    props: {
      brandsOrder: settings.renderingContent.facetOrdering.values.brand.order
    }
  }
}