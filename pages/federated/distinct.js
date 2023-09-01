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
  Snippet,
  useRange
} from 'react-instantsearch';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
);

const indexName = "variants_color";

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
      <header>
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
