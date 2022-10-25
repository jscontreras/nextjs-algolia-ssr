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
import Link from 'next/link';

const Instructions = () => (
  <div className='mb-4 mt-2 text-sm'>
    <>Use the <span className='font-bold'>Nav Hierarchy Facets</span> widget to refine the search using URL  parameters <span className='italic'>(facets, facetsFilters)</span>.</>
    <> Alternatively, the <span className='font-bold'>Nav Category Links</span> menu provides URLs to the corresponding categories landing pages via
    <span className='italic'> filters</span>.</>
    <p className='mt-2'>Open the <Link href='/debug'><a target="_blank" className="text-blue-600 underline" >Debug's tab</a></Link> to see the parameters sent to Algolia in real time.</p>
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
        <h1 className="text-2xl font-bold mb-4 mt-4">{props.title ? `${props.title} Landing Page` : 'Dynamic Routes (Categories) + Next.js'}</h1>
        <Instructions />
        <SearchBox />
      </header>
      <BreadCrumbs items={props.navItems || []} />
      <main>
        {!props.filters && (
          <div className="menu text-sm">
            <h2 className='font-bold mb-2'>Nav Hierarchy Facets</h2>
            <HierarchicalMenu attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]} separator=' > '/>
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
