/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-instantsearch-hooks-web';

const APP_ID = 'SGF0RZXAXL';
const SEARCH_API_KEY = '0ac0c3b165eb3773097eca1ac25d8fdd';
const searchClient = algoliasearch(
  APP_ID,
  SEARCH_API_KEY,
);

const indexName = "instant_search";


const Instructions = () => (
  <div className='mt-0 mb-4 text-sm'>
    <p>Update filters for the <span className=" font-bold text-black-600 italic">RESULTS VIEW</span> to modify results by clicking <span className="text-pink-600 font-bold">[Submit Filters!]</span> button.</p>
    <p>The <span className=" font-bold text-yellow-600 italic">FILTERS VIEW</span> gets synchronized automatically upon results query changes.</p>
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
  const [filtersUiState, setFiltersUiState] = useState({});
  const [resultsUiState, setResultsUiState] = useState({});

  const invisibleUpdateFiltersButtonRef = useRef(null);
  const invisibleFilterResultButtonRef = useRef(null);

  const InsivibleFiltersUpdateButton = () => {
    const { indexUiState, setIndexUiState } = useInstantSearch();
    const mergeFilterStates = () => {
      console.log('Invisible Button Clicked');
      setIndexUiState({ ...indexUiState, ...resultsUiState.instant_search });
    }


    return (
      <div>
        <button ref={invisibleUpdateFiltersButtonRef} className='hidden bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded' onClick={mergeFilterStates}>Submit Filters  From Results</button>
      </div>
    )
  }

  const SubmitFiltersButton = () => {
    const { indexUiState, setIndexUiState } = useInstantSearch();
    const mergeFilterStates = () => {
      console.log('CLICKED BUTTON InstantSearch1 state', filtersUiState);
      setIndexUiState({ ...indexUiState, ...filtersUiState.instant_search });
    }
    return (
      <div>
        <button ref={invisibleFilterResultButtonRef} className='hidden bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' onClick={mergeFilterStates}>Submit Filters  From IS1</button>
      </div>
    )
  }

  const clickInvisibleBlueButton = () => {
    // CLick invisible blue button
    invisibleFilterResultButtonRef.current.click();
  }


  return (
    <>
      <h1 className="text-2xl font-bold mb-4 mt-2">
        Async Filtering (Dual InstantSearch)</h1>
      <Instructions brandsFacetPinnedValues={brandsOrder} />
      {/* Instant Search 1  (Filters)*/}
      <div className='bg-slate-800 p-5'>
        <h1 className=" font-bold text-yellow-100 italic mb-3 text-xl">FILTERS VIEW</h1>
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          onStateChange={({ uiState, setUiState }) => {
            console.log('Filters Changed', uiState);
            setUiState(uiState);
            setFiltersUiState(uiState);
          }}
        >
          <InsivibleFiltersUpdateButton />
          <SearchBox placeholder='Write and Submit' />
          <div className="p-2 mr-2">
            <div className='flex'>
              <HierarchicalMenu attributes={[
                'hierarchicalCategories.lvl0',
                'hierarchicalCategories.lvl1',
                'hierarchicalCategories.lvl2',
              ]} separator=' > ' />
              <DynamicWidgets facets={['*']} >
                <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2' }}
                  searchablePlaceholder="Brands" operator='or' limit={20} />
                <RefinementList attribute="type" classNames={{ root: 'bg-emerald-100 p-2 mr-2' }}
                  searchablePlaceholder="Type" operator='or' limit={20} />
              </DynamicWidgets>
            </div>
          </div>
          <button className='bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded' onClick={clickInvisibleBlueButton}>Submit Filters!</button>

        </InstantSearch>
      </div>
      {/* Instant Search 2  (results)*/}
      <div className='bg-slate-100 p-5'>
        <h1 className=" font-bold text-navy-100 italic mb-3 text-xl">RESULTS VIEW</h1>
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          onStateChange={({ uiState, setUiState }) => {
            console.log('Results Changed', uiState);
            setResultsUiState(uiState);
            setUiState(uiState);
            setTimeout(() => {
              invisibleUpdateFiltersButtonRef.current.click();
            }, 100)
          }}
        >
          <SubmitFiltersButton />

          <header>
            <Breadcrumb attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
            ]} />
            <SearchBox placeholder='Current Query' />
          </header>
          <main>

            <div className="rules-dynamic-widgets p-2 border-solid border-2 border-sky-100 mr-2">
              <HierarchicalMenu attributes={[
                'hierarchicalCategories.lvl0',
                'hierarchicalCategories.lvl1',
                'hierarchicalCategories.lvl2',
              ]} separator=' > ' />
              <DynamicWidgets facets={['*']} >
                <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2' }}
                  searchablePlaceholder="Brands" operator='or' limit={20} />
                <RefinementList attribute="type" classNames={{ root: 'bg-emerald-100 p-2 mr-2' }}
                  searchablePlaceholder="Type" operator='or' limit={20} />
              </DynamicWidgets>
            </div>
            <div className="results border-solid border-2 border-red-100">
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
                {/* <ClearRefinements classNames={{ button: 'mt-2 h-7', disabledButton: 'hidden' }} /> */}
              </div>
              <Hits hitComponent={HitComponent} />
            </div>
          </main>
          <footer>
            <Pagination />
          </footer>
        </InstantSearch>
      </div>
    </>
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