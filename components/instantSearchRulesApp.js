/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
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
  ToggleRefinement,
  CurrentRefinements,
  ClearRefinements,
  useQueryRules
} from 'react-instantsearch-hooks-web';

const MyHierarchicalMenu = (props) => {


  return <>
    <h2 className="font-bold text-sm mt-2">{props.title}</h2>
    <HierarchicalMenu {...props} /></>;
}

export function QueryRulesCustomDataBanner(props) {
  const { items } = useQueryRules(props);
  const [countDown, setCountDown] = useState(10);
  const [keepCounting, setKeepCounting] = useState(true);

  const banners =  items.map((data, i) => {
    const { banner, title, link, redirect } = data;
    if (redirect) {
      if (keepCounting) {
        setTimeout(() => {
          if (countDown == 0) {
            window.location = redirect;
          } else {
            if(keepCounting) {
              setCountDown(countDown - 1)
            }
          }
        }, 1000);
      }
      return (<div className='w-full bg-slate-100 p-4 text-center mb-4' key={i}>
        <span className='text-sm center w-full'>Redirecting to <a className='text-blue-700' href={redirect}>{redirect}</a> in {countDown} secs.
          <span className='cursor-pointer text-amber-700' onClick={() => { setKeepCounting(!keepCounting)}}> [{keepCounting ? 'pause' : 'resume'}]</span>
        </span>
        </div>)
    }
    return  (
      <section key={title} className="mb-4">
         {!banner && <h2>{title}</h2>}
        <a href={link}>
          <img src={banner} alt={title} />
        </a>
      </section>
    );
  })
  if (banners.length == 0) {
    return (<div className='w-full bg-slate-100 p-4 text-center mb-4'>
    <span className='text-sm center w-full'>Banners & Redirects Section</span></div>)
  } else {
    return <>
      {items && <div className='w-full bg-white p-1 mb-1'><span className='text-xs w-full'>{JSON.stringify(items,  null, 2)}</span></div>}
      {banners}
    </>;
  }
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
        <Snippet attribute="description" hit={hit} />
      </div>
    </div>
  </div>
);
    // create a react component that renders a blue sky  button with white state text and hover using tailwind.

export function InstantSearchRulesApp(props) {
  const [contexts, setContexts] = useState([]); // initial array of tags
  const ContextTags = () => {

    const handleAddTag = (event) => {
      event.preventDefault();

      // get the input value
      const tag = event.target.elements.tagInput.value.trim();

      // add the tag to the array if it is not an empty string
      if (tag) {
        setContexts((prevTags) => [...prevTags, tag]);
      }

      // clear the input field
      event.target.elements.tagInput.value = '';
    }

    const handleRemoveTag = (tagToRemove) => {
      setContexts((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    }

    return (
      <div className="bg-indigo-100 py-2 mt-2 px-2 flex justify-between">
        <form onSubmit={handleAddTag} className="text-xs">
          <input type="text" name="tagInput" className="bg-white py-1 pl-1 mr-1 border" placeholder="Add Context String"/>
          <button type="submit" className="bg-sky-500 hover:bg-sky-700 text-white py-1 px-2 rounded">
            +
          </button>
        </form>
        <ul>
          {contexts.map((tag) => (
            <li key={tag} className="inline-block bg-purple-700 rounded pl-2 text-xs text-white mr-2">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded ml-2">
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }


  return (
    <InstantSearch {...props}>
      <Configure hitsPerPage={12} clickAnalytics={true} ruleContexts={contexts} />
      <header>
        <h1 className="text-2xl font-bold mb-4 mt-2">
          Rules Playground</h1>
        <QueryRulesCustomDataBanner />
        <SearchBox />
        <ContextTags />
      </header>
      <main>
        <div className="menun rules-dynamic-widgets">
          <DynamicWidgets facets={['*']}>
            <MyHierarchicalMenu attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]} separator=' > ' showMore={true} title="Hierarchical Categories" />
            <ToggleRefinement attribute="free_shipping" label=" Free shipping" classNames={{
              root: 'MyCustomToggleRefinement bg-emerald-100 p-3 pr-0 mr-2',
              checkbox: 'MyCustomToggleRefinementCheckbox MyCustomToggleRefinementCheckbox--subclass',
            }} title="Shipping Options" />

            <RefinementList attribute="brand" classNames={{ root: 'bg-sky-100 p-2 mr-2' }} searchable={true}
              searchablePlaceholder="Brands" />
            <RefinementList attribute="type" classNames={{ root: 'bg-amber-100 p-2 mr-2' }} searchable={true}
              searchablePlaceholder="Use Cases" />
          </DynamicWidgets>
        </div>
        <div className="results">
          <div className='flex min-w-full	'>
            <CurrentRefinements classNames={{ category: 'mr-1', root: 'mt-1 mb-2' }}
              transformItems={(items) => {
                return items.map((item) => {
                  console.log(item);
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
            <ClearRefinements classNames={{ button: 'mt-2 h-7', disabledButton: 'hidden'}}/>
          </div>
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
