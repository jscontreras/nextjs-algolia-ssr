import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { createElement, Fragment } from 'react';
import { getAlgoliaResults, parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import Link from 'next/link';
import insightsClient from 'search-insights';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(
  appId,
  apiKey,
);

// Highlight text render
function Highlight({
  hit,
  attribute,
  tagName = 'mark',
}) {
  return createElement(
    Fragment,
    {},
    parseAlgoliaHitHighlight({ hit, attribute }).map(
      ({ value, isHighlighted }, index) => {
        if (isHighlighted) {
          return createElement(tagName, { key: index }, value);
        }

        return value;
      }
    )
  );
}

// Query Suggesion Index Definition
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

// Recent Searches Index Definition
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});


// Query Suggestion Item Render
function QuerySuggestionItem({ item, autocomplete }) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z" />
          </svg>
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <Highlight hit={item} attribute="query" />
          </div>
         </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton"
          title={`Fill query with "${item.query}"`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            autocomplete.setQuery(item.query);
            autocomplete.refresh();
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Insights Analytics Plugin.
insightsClient('init', { appId, apiKey });
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onActive({ insights, insightsEvents, item, state, event }) {
    insightsEvents.forEach((insightsEvent) => {
      // Assuming you've initialized the Segment script
      // and identified the current user already
      console.log(
        'Analytics (ACTIVE) Event Forwarding',
        insightsEvents,
        insights
      );
      // analytics.track('Product Browsed from Autocomplete', insightsEvent);
    });
  },
  onItemsChange({ insights, insightsEvents, item, state, event }) {
    // Assuming you've initialized the Segment script
    // and identified the current user already
    console.log('Analytics (CHANGE) Event Forwarding', insightsEvents, insights);
    // analytics.track('Product Browsed from Autocomplete', insightsEvent);
  },
  onSelect({ insights, insightsEvents, item, state, event }) {
    // Assuming you've initialized the Segment script
    // and identified the current user already
    console.log(
      'Analytics (SELECT) Event Forwarding',
      insightsEvents,
      insights,
      item
    );
    // analytics.track('Product Browsed from Autocomplete', insightsEvent);
  },
});

// Recent Search Item Render
function PastQueryItem({ item, autocomplete }) {
  function onRemove(id) {
    recentSearchesPlugin.data.removeItem(id);
    autocomplete.refresh();
  }

  function onTapAhead(item) {
    autocomplete.setQuery(item.label);
    autocomplete.refresh();
  }
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.516 6.984v5.25l4.5 2.672-0.75 1.266-5.25-3.188v-6h1.5zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z" />
          </svg>
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <Highlight hit={item} attribute="label" />
            {item.category && (
              <span className="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline">
                <span className="aa-ItemContentSubtitleIcon" /> in{' '}
                <span className="aa-ItemContentSubtitleCategory">
                  {item.category}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton"
          title="Remove this search"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove(item.id);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          title={`Fill query with "${item.label}"`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onTapAhead(item);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Autocomplete() {
  // (1) Create a React state.
  const [autocompleteState, setAutocompleteState] = React.useState({});
  const inputRef = React.useRef(null);

  const autocomplete = React.useMemo(
    () => {
      return createAutocomplete({
        openOnFocus: true,
        placeholder: 'Search for Products',
        plugins: [querySuggestionsPlugin, recentSearchesPlugin],
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        getSources() {
          return [
            // (3) Use an Algolia index source.
            {
              sourceId: 'products',
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: 'instant_search',
                      query,
                      params: {
                        hitsPerPage: 4,
                        clickAnalytics: true,
                        // highlightPreTag: '<mark>',
                        // highlightPostTag: '</mark>',
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return `/?query=${item.name}`;
              },
            },
          ];
        },
      });
    },
    []
  );

  const autoCompleteLabel = 'autocomplete-1-label';
  const autoCompleteId = 'autocomplete-1-input';

  // Makes SSR consistent on aria aspects
  const containerProps = autocomplete.getRootProps({});
  const inputProps = autocomplete.getInputProps({});
  const panelProps = autocomplete.getPanelProps({});

  inputProps.id = autoCompleteId;
  containerProps['aria-labelledby'] = autoCompleteLabel;
  inputProps['aria-labelledby'] = autoCompleteLabel;
  panelProps['aria-labelledby'] = autoCompleteLabel;

  // ...CUSTOM RENDERER
  return (
    <div className="aa-Autocomplete" {...containerProps} >
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
      <input ref={inputRef} className="aa-Input" {...inputProps} />
      </form>
      <div className="aa-Panel" {...autocomplete.getPanelProps({})} >
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;
            // Rendering of Query Suggestions
            if (['querySuggestionsPlugin', 'recentSearchesPlugin'].includes(collection.source.sourceId)) {
              return (
                <div key={`source-${index}`} className="aa-Source">
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item, index) => (
                      <li
                        key={`${item.objectID ? item.objectID : index }-${collection.source.sourceId}`}
                        className="aa-Item"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        {collection.source.sourceId === 'querySuggestionsPlugin' && <QuerySuggestionItem item={item} autocomplete={autocomplete} {...autocomplete.getItemProps({
                          item,
                          source,
                        })} />}
                        {collection.source.sourceId === 'recentSearchesPlugin' && <PastQueryItem item={item} autocomplete={autocomplete} {...autocomplete.getItemProps({
                          item,
                          source,
                        })} />}
                      </li>))}
                  </ul>
                </div>
              )
            }
            // Rendering of regular items
            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                         key={item.objectID}
                        className="aa-Item"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        <div className="aa-ItemWrapper">
                          <div className="aa-ItemContent">
                            <Highlight hit={item} attribute='name' />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
      </div>
      <footer>
        <div className="mb-8 mt-4">
          See{' '}
          <a className='underline' href="https://github.com/jscontreras/nextjs-algolia-ssr/tree/main/pages">
            source code
          </a>{' '}
          on GitHub
        </div>
      </footer>
    </div>
  );
}


function AutocompletePage() {
  return <>

    <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
    <h1 className="mt-4 text-2xl font-bold mb-4">
      Autocomplete Server Rendering using <span className='text-amber-600'>autocomplete-core</span>
    </h1>
    <p className='mb-4 mt-2'>By using <span className='text-amber-600'>autocomplete-core</span> it is possible to get isomorphic rendering work using a custom renderer.</p>    <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled!</p>
    <Autocomplete />

  </>
}

export default AutocompletePage