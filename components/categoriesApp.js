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
  Snippet
} from 'react-instantsearch-hooks-web';
import { BreadCrumbs } from './breadcrumbs';
import { CategoriesMenu } from './categoriesMenu';



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
        <Snippet attribute="description" hit={hit} />...
      </div>
      <div className="hit-categories mt-2 pl-2">
        {Object.keys(hit.hierarchicalCategories).map((key, index) => (<p className="text-xs	mb-1 text-amber-500" key={index}>{`${key}:${hit.hierarchicalCategories[key]}`}</p>))}
      </div>
    </div>
  </div>
);

export function CategoriesApp(props) {
  return (
    <InstantSearch {...props}>
      {props.filters ? <Configure filters={`${props.filters}`} hitsPerPage={12} /> : !props.filters && <Configure hitsPerPage={12} />}
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-4">{props.title? `${props.title} Landing Page` : 'Dynamic Routes (Categories) + Next.js'}</h1>
        <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled!</p>
        <SearchBox />
      </header>
      <BreadCrumbs items={props.navItems || []} />
      <main>
        {!props.filters && (
          <div className="menu">
            <h2 className='font-bold mb-2'>Nav Hierarchy Filter</h2>
            <HierarchicalMenu attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]} separator=' > ' />
            <h2 className='font-bold mb-2 mt-8'>Nav Category Links</h2>
            <CategoriesMenu attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]} separator=' > ' />

          </div>)}
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
