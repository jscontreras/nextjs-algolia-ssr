/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/future/image';
import algoliasearch from 'algoliasearch/lite';

import {
  HierarchicalMenu,
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
  Snippet
} from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  'SGF0RZXAXL',
  '0ac0c3b165eb3773097eca1ac25d8fdd',
);

const indexName = "instant_search";

// Control the Initial Render with InitialUIState
const initialUiState = {
  // Product: {
  //   hierarchicalMenu: {
  //     "categories.lvl0": ["home", "casa"]
  //   }
  // }
}

// This Middleware will show you the states
// function middleware({ instantSearchInstance }) {
//   return {
//     onStateChange({ uiState }) {
//       console.log('uiState', uiState)
//     },
//     subscribe() { },
//     unsubscribe() { }
//   }
// }

// function Middleware() {
//   const { use } = useInstantSearch();

//   React.useLayoutEffect(() => {
//     return use(middleware);
//   });
// }


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
      {/* <Middleware /> // Uncomment this line to enable Middleware and see the UI States*/}
      <header>
        <Breadcrumb attributes={[
          'hierarchicalCategories.lvl0',
          'hierarchicalCategories.lvl1',
          'hierarchicalCategories.lvl2',
        ]} />
        <h1 className="text-2xl font-bold mb-4 mt-2">
          Rules Playground</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menun rules-dynamic-widgets">
          <HierarchicalMenu attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
          ]} separator=' > ' />
          <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2' }}
            searchablePlaceholder="Brands" operator='or' />
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
