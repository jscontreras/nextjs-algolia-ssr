/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import Image from 'next/future/image';
import algoliasearch from 'algoliasearch/lite';

import {
  SearchBox,
  Hits,
  Highlight,
  Pagination,
  InstantSearch,
  CurrentRefinements,
  ClearRefinements,
  useInstantSearch,
  Snippet,
  useRange
} from 'react-instantsearch-hooks-web';
import { CustomBreadcrumb } from '../../components/customBreadcrumb';

const searchClient = algoliasearch(
  'SGF0RZXAXL',
  '0ac0c3b165eb3773097eca1ac25d8fdd',
);

const indexName = "instant_search";



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
    <p>Shows how to use Range Input hook to create a price range facet.</p>
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
          PriceRange hook</h1>
        <Instructions />
        <SearchBox />
      </header>
      <main>
        <div className="rules-dynamic-widgets">
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

function MyRangeInput({ attribute }) {
  const rangeProps = useRange({
    attribute: attribute,
  });
  const { range, canRefine, refine } = rangeProps;
  const [fromPrice, setFromPrice] = useState(range.min);
  const [toPrice, setToPrice] = useState(range.max);

  function handleFromPriceChange(event) {
    const value = event.target.value.replace(/\D/g, ''); // allow only digits
    setFromPrice(value);
  }

  function handleToPriceChange(event) {
    const value = event.target.value.replace(/\D/g, ''); // allow only digits
    setToPrice(value);
  }

  function setFilter() {
    refine([`${fromPrice}`, `${toPrice}`])
    console.log('second', canRefine)
  }

  useEffect(() => {
    setFromPrice(range.min);
    setToPrice(range.max);
  }, [range.min, range.max])

  return (
    <div className="flex items-center justify-between p-4">
      <div className="mr-4">
        <label htmlFor="fromPrice" className="block font-medium text-gray-700 mb-2">
          From
        </label>
        <input
          type="text"
          id="fromPrice"
          name="fromPrice"
          className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
          value={fromPrice}
          onChange={handleFromPriceChange}
          placeholder="?"
          onFocus={e => e.target.select()}
        />
      </div>
      <div>
        <label htmlFor="toPrice" className="block font-medium text-gray-700 mb-2">
          To
        </label>
        <input
          type="text"
          id="toPrice"
          name="toPrice"
          className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
          value={toPrice}
          onChange={handleToPriceChange}
          placeholder="?"
          onFocus={e => e.target.select()}
        />
      </div>
      <button className='ml-2 mt-8 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded' onClick={setFilter} >ok</button>
    </div>
  );
}