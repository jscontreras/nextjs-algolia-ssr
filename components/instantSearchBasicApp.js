import React from 'react';
import Image from 'next/image';
import {
  HierarchicalMenu,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch,
} from 'react-instantsearch';

import { CustomBreadcrumb } from './customBreadcrumb';
import { insightsConfig } from '../lib/common';

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div className="hit-picture">
      {/* <img src={`${hit.image}`} alt={hit.name}/> */}
      <Image src={`${hit.image}`} alt={hit.name}  width={150} height={150}/>
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
        <Highlight attribute="description" hit={hit} />
      </div>
    </div>
  </div>
);

/**
 * Main InstantSearch App.
 * @param {*} props
 * @returns
 */
export function InstantSearchBasicApp(props) {
  const { clientUserToken } = props;
  // Set userToken if available (this travels via cookie)
  if (clientUserToken) {
    insightsConfig.insightsClient('setUserToken', clientUserToken);
  }

  return (
    <InstantSearch {...props} insights={insightsConfig}>
      <Configure hitsPerPage={12} />
      <CustomBreadcrumb attributes={[
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
      ]}
        rootItems={[{ label: 'Home', value: '/' }, { label: 'Full Catalog', value: '' }]}
      />
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-2">
        React InstantSearch + Next.js</h1>
        <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled!</p>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
          <HierarchicalMenu attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
          ]} separator=' > ' showMore={true}/>
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
