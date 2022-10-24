import React, { useEffect, useState } from 'react';
import Image from 'next/future/image';
import {
  HierarchicalMenu,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch
} from 'react-instantsearch-hooks-web';
import { BreadCrumbs } from './breadcrumbs';
import { CategoriesMenu } from './categoriesMenu';

const defaultImage = 'https://i.imgur.com/MkMsHFZ.jpeg';
const HitComponent = ({ hit }) => {
  const [src, setSrc] = useState(() => (hit.imageUrl4x3 && hit.standfirst.length > 0 ? hit.imageUrl4x3 : defaultImage));
  const divProps = {};
  divProps.dangerouslySetInnerHTML = { __html: hit.standfirst || '<span>Missing Description</span>' };
  return (
    <div className="hit">
      <div className="hit-picture">
        {/* <img src={`${hit.image}`} alt={hit.name}/> */}
        {src && <Image placeholder='empty' src={src} alt={'Some image description'} layout='fill' width={150} height={150} onError={() => { setSrc(defaultImage) }} />}
      </div>
      <div className="hit-content">
        <div>
          <Highlight attribute="name" hit={hit} />
          <span className='font-bold'> {hit.extendedHeadline}</span><br></br>
          <span className='text-slate-500	text-sm'> ({hit.byline} stars)</span>
        </div>
        <div className="hit-type">
          <Highlight attribute="type" hit={hit} />
        </div>

      </div>
    </div>
  )
};

export function ArticlesApp(props) {
  return (
    <InstantSearch {...props}>
      {props.filters ? <Configure filters={`${props.filters}`} hitsPerPage={12} /> : !props.filters && <Configure hitsPerPage={12} />}
      <header>
        <h1 className="text-2xl font-bold mb-4">
          Dynamic Routes (Categories) + Next.js</h1>
        <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled!</p>
        <SearchBox />
      </header>
      <BreadCrumbs items={props.navItems || []} />
      <main>
        {!props.filters && (
          <div className="menu">
            <h2 className='font-bold mb-2'>Nav Hierarchy Filter</h2>
            <HierarchicalMenu attributes={[
              'locationsHierarchy.lvl0',
              'locationsHierarchy.lvl1',
              'locationsHierarchy.lvl2',
              'locationsHierarchy.lvl3',
            ]} separator=' / ' />
            <h2 className='font-bold mb-2 mt-8'>Nav Category Links</h2>
            <CategoriesMenu attributes={[
              'locationsHierarchy.lvl0',
              'locationsHierarchy.lvl1',
              'locationsHierarchy.lvl2',
              'locationsHierarchy.lvl3',
            ]} separator=' / ' />

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
