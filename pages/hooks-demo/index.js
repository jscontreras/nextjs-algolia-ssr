/* eslint-disable @next/next/no-img-element */
import React  from 'react';

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
} from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  '6M9P8SPMTZ',
  'ec76ab868ff8894a394565ec95e82d03',
);

// Control the Initial Render with InitialUIState
const initialUiState = {
  Product: {
    hierarchicalMenu: {
      "categories.lvl0": ["home", "casa"]
    }
  }
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
      <img className='product-image' src={`${hit.imagem}`} alt={hit.name} width={150} height={150} />
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="nome" hit={hit} />
        <span> - ${hit.preco}</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="marca" hit={hit} />
      </div>
    </div>
  </div>
);


const indexName = "Product";
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
          'categories.lvl0',
          'categories.lvl1',
        ]} />
        <h1 className="text-2xl font-bold mb-4 mt-2">
          Rules Playground</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menun rules-dynamic-widgets">
            <HierarchicalMenu attributes={[
              'categories.lvl0',
              'categories.lvl1',
            ]} separator=' > '/>
            <RefinementList attribute="marca" classNames={{ root: 'bg-sky-100 p-2 mr-2' }}
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
