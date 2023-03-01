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
  Breadcrumb,
  useInstantSearch,
  Snippet,
  ToggleRefinement
} from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  'SGF0RZXAXL',
  '0ac0c3b165eb3773097eca1ac25d8fdd',
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
  const { use } = useInstantSearch();

  React.useLayoutEffect(() => {
    return use(middleware);
  });
}

const Instructions = () => (
  <div className='mt-0 mb-4 text-sm'>
    <p>Shows how InstantShare widgets share UI state (<span className="text-amber-600 italic">HierarchicalMenu, Breadcrumb</span>).</p>
    <p>InitialUI  State <span className='italic bold text-emerald-500'>(printed in console)</span> can be modified via the <span className="text-sky-600 italic">InitialUIState</span> InstantSearch property</p>
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

export default function SearchPage({ serverState, serverUrl }) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      initialUiState={initialUiState}
    >
      <Middleware />
      <header>
        <Breadcrumb attributes={[
          'hierarchicalCategories.lvl0',
          'hierarchicalCategories.lvl1',
          'hierarchicalCategories.lvl2',
        ]} />
        <h1 className="text-2xl font-bold mb-4 mt-2">
          Sorting Brand Facets Values</h1>
        <Instructions />
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
              searchablePlaceholder="Brands" operator='or' />
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
