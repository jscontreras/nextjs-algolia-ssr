import React from 'react';
import Image from 'next/future/image';
import {
  HierarchicalMenu,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
  DynamicWidgets,
  RefinementList,
  Snippet,
  ToggleRefinement
} from 'react-instantsearch-hooks-web';

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div className="hit-picture">
      {/* <img src={`${hit.image}`} alt={hit.name}/> */}
      <Image src={`${hit.image}`} alt={hit.name} layout='fill' width={150} height={150}/>
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

export function InstantSearchRulesApp(props) {
  return (
    <InstantSearch {...props}>
      <Configure hitsPerPage={12} />
      <header>
        <h1 className="text-2xl font-bold mb-4">
        Rules</h1>
        <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled!</p>
        <SearchBox />
      </header>
      <main>
        <div className="menun rules-dynamic-widgets">
          <DynamicWidgets facets={['*']}>
            <ToggleRefinement attribute="free_shipping" label=" Free shipping" classNames={{
              root: 'MyCustomToggleRefinement bg-emerald-100 p-3 pr-0 mr-2',
              checkbox: 'MyCustomToggleRefinementCheckbox MyCustomToggleRefinementCheckbox--subclass',
            }} title="Shipping Options" />
          <HierarchicalMenu attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
          ]} separator=' > ' showMore={true}/>
            <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2'}}/>
            <RefinementList attribute="type" classNames={{ root: 'bg-amber-100 p-2 mr-2' }}/>
          </DynamicWidgets>
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
