import React, { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
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
import Router from 'next/router';

const Instructions = ({ categoryPage, url, filterName }) => (
  <>{categoryPage ? (<div className='mb-4 mt-2 text-sm'>
    <>Use the <span className='font-bold'>{filterName}</span> widget to refine the search using URL  parameters (<span className="text-amber-600 italic">facets, facetsFilters</span>).</>
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

const FilterToggle = ({ enabled, setEnabled, filters }) => {
  const defaultFilterLabel = getCookie('filterMode', 'category_page_id');
  return (
    <div className='flex justify-between items-end'>
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
        <span className='ml-2'>Use <span className="font-medium text-amber-500">{filters.customFilterLabel}</span> attribute as filter.</span>
      </label>
      <span className="text-xs">Using filter (<span className='font-bold'>{enabled ? filters.customFilterLabel : filters.defaultFilterLabel}</span> )</span>
    </div>
  );
}

const ProductImage = ({src, alt}) => {
  const placeholderImg = 'https://i.imgur.com/gf3TZMr.jpeg';
  const [srcVal, setSrc] = useState(() => (src || placeholderImg));
  return <Image src={srcVal} alt={alt} layout='fill' width={120} height={120} onError={() => { setSrc(placeholderImg) }} />
}

const HitComponent = ({ hit }) => (
  <div className="hit">
    <div className="hit-picture">
      <ProductImage src={`${hit.image_urls[0]}`} alt={hit.name} />
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
        <span> - ${hit.price.value}</span>
        <span> - {hit.rating} stars</span>
      </div>
      <div className="hit-type">
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        <Snippet attribute="description" hit={hit} />...
      </div>
      <div className='flex'>
        <div className="hit-categories  text-xs p-5 border rounded mr-2">
          <h4 className='text-xs mb-2 font-bold'>hierarchical_categories (Facet)</h4>
          <ul className='pl-1'>
            [{Object.keys(hit.hierarchical_categories).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-amber-500" >{`"${key}:${hit.hierarchical_categories[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
        <div className="hit-categories text-xs p-5 border rounded mr-2">
          <h4 className='text-xs mb-2 font-bold'>list_categories (Facet)</h4>
          <ul className='pl-1'>
            [{Object.keys(hit.list_categories).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-sky-500" >{`"${hit.list_categories[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
        <div className="hit-categories  text-xs border-solid p-5 border rounded">
          <span className='text-xs mb-2 font-bold'>category_page_id (Facet):</span>
          <ul className='pl-1'>
            [{Object.keys(hit.category_page_id).map((key, index) => (
              <li className='pl-4' key={index}>
                <span className="mb-1 text-emerald-500" >{`"${hit.category_page_id[key]}"`}</span>
                <span>,</span>
              </li>
            ))}]
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export function CategoriesApp(props) {

  const [defaultFilterSelected, setDefaultFilterSelected] = useState(getCookie('defaultFilterSelected'));
  const [url, setUrl] = useState();

  const toggleFilter = () => {
    const newValue = !defaultFilterSelected;
    // Update cookie & state
    setCookie('defaultFilterSelected', newValue);
    setDefaultFilterSelected(newValue);
  }
  useEffect(() => {
    setUrl(window.location.pathname);
    const handleBeforeHistoryChange = () => {
      setUrl(window.location.pathname);
    };
    Router.events.on('routeChangeComplete', handleBeforeHistoryChange);
    return () => {
      Router.events.off('routeChangeComplete', handleBeforeHistoryChange);
    };

  }, [defaultFilterSelected, props.filters, url])

  return (
    <InstantSearch {...props}>
      {props.filters ? <Configure filters={defaultFilterSelected ? props.filters.defaultFilter : props.filters.customFilter} hitsPerPage={12} analyticsTags={['browse']} /> : <Configure hitsPerPage={12} />}
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-4">{props.title ? `${props.title} Landing Page` : 'Dynamic Routes (Categories) + Next.js'}</h1>
        <Instructions categoryPage={!props.filters} url={url} filterName={!props.filters ? 'Nav Hierarchy Facets' : props.filters.customFilterLabel} />
        <SearchBox />
      </header>
      <BreadCrumbs items={props.navItems || []} />
      {props.filters && <FilterToggle enabled={!defaultFilterSelected} setEnabled={toggleFilter} filters={props.filters} />}
      <main>
        {!props.filters && (
          <div className="menu text-sm">
            <h2 className='font-bold mb-2'>Nav Hierarchy Facets</h2>
            <HierarchicalMenu attributes={[
              'hierarchical_categories.lvl0',
              'hierarchical_categories.lvl1',
              'hierarchical_categories.lvl2',
              'hierarchical_categories.lvl3',
            ]} separator=' > ' />
            <h2 className='font-bold mb-2 mt-8'>Nav Category Links</h2>
            <CategoriesMenu attributes={[
              'hierarchical_categories.lvl0',
              'hierarchical_categories.lvl1',
              'hierarchical_categories.lvl2',
              'hierarchical_categories.lvl3',
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
