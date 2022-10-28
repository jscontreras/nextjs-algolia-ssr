import React, { useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';
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

const Instructions = ({ categoryPage, url }) => (
  <>{categoryPage ? (<div className='mb-4 mt-2 text-sm'>
    <>Use the <span className='font-bold'>Nav Hierarchy Facets</span> widget to refine the search using URL  parameters (<span className="text-amber-600 italic">facets, facetsFilters</span>).</>
    <> Alternatively, the <span className='font-bold'>Nav Category Links</span> menu provides URLs to the corresponding categories landing pages via the
      (<span className='italic text-amber-600'>filters</span>) parameter.</>
    <p className='mt-2'>Open the <Link href='/debug'><a target="_blank" className="text-blue-600 underline" >Debug&#39;s tab</a></Link> to see the parameters sent to Algolia in real time.</p>
  </div>) : (
    <div className='mb-4 mt-2 text-sm'>
      <p>Filter attributes are obtained by parsing the URL path
          <span className='italic text-amber-600'> {url}</span> into the corresponding query&apos;s filter value.
      </p>
        <p className='mt-2'>Open the <Link href='/debug'><a target="_blank" className="text-blue-600 underline" >Debug&#39;s tab</a></Link> to see the parameters sent to Algolia in real time.</p>
    </div>
  )}
  </>
)

const FilterToggle = ({ enabled, setEnabled }) => {
  return (
    <>
      <label className=" text-sm inline-flex relative items-center ml-5 mt-3 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          readOnly
        />
        <div
          onClick={() => {
            setEnabled(!enabled);
          }}
          className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
        ></div>
        <span className='ml-2'>Use <span className="font-medium text-amber-500">hierarchicalCategories</span> attribute as filter.</span>

      </label>
    </>
  );
}

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
        <h4 className='text-xs mb-2 font-bold'>hierarchicalCategories (Attribute)</h4>
        {Object.keys(hit.hierarchicalCategories).map((key, index) => (<p className="text-xs	mb-1 text-amber-500" key={index}>{`"${key}:${hit.hierarchicalCategories[key]}"`}</p>))}
      </div>
      <div className="hit-categories mt-2 pl-2">
        <h4 className='text-xs mb-2 font-bold'>categories (Attribute)</h4>
        {Object.keys(hit.categories).map((key, index) => (<p className="text-xs	mb-1 text-emerald-500" key={index}>{`"${hit.categories[key]}"`}</p>))}
      </div>
    </div>
  </div>
);

export function CategoriesApp(props) {
  const [defaultFilter, setDefaultFilter] = useState(props.defaultFilterSelected);
  const [url, setUrl] = useState();
  const [filter, setFilter] = useState(() => {
    if (!props.filters) {
      return null;
    }
    if (defaultFilter) {
      return props.filters.defaultFilter;
    } else {
      return props.filters.customFilter;
    }
  });

  const toggleFilter = () => {
    const newValue = !defaultFilter;
    // If default
    if (newValue == true) {
      setCookie('filterMode', 'category');
      if (props.filters) {
        setFilter(props.filters.defaultFilter);
      }
    } else {
      setCookie('filterMode', 'hierarchicalCategories');
      if (props.filters) {
        setFilter(props.filters.customFilter);
      }
    }
    setDefaultFilter(newValue);
  }
  useEffect(() => {
    setUrl(window.location.pathname);
  }, [filter])

  return (
    <InstantSearch {...props}>
      {filter ? <Configure filters={filter} hitsPerPage={12} analyticsTags={['browse']} /> : <Configure hitsPerPage={12} />}
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-4">{props.title ? `${props.title} Landing Page` : 'Dynamic Routes (Categories) + Next.js'}</h1>
        <Instructions categoryPage={!props.filters} url={url}/>
        <SearchBox />
      </header>
      <BreadCrumbs items={props.navItems || []} />
      <FilterToggle enabled={!defaultFilter} setEnabled={toggleFilter} />
      <main>
        {!props.filters && (
          <div className="menu text-sm">
            <h2 className='font-bold mb-2'>Nav Hierarchy Facets</h2>
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
