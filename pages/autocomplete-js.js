import React, { createElement, Fragment, useEffect, useRef, useState } from 'react'
import algoliasearch from 'algoliasearch';
import { createRoot } from 'react-dom/client';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import Link from 'next/link';
import { AutocomplteSSR } from '../components/autocompleteSSR';
import insightsClient from 'search-insights';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';

const searchClient = algoliasearch(
  appId,
  apiKey,
);

// Query Suggestion Plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',

});

// Recent Search Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});

// Insights Analytics Plugin.
insightsClient('init', { appId, apiKey });
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient});
// const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
//   insightsClient,
//   onActive({ insights, insightsEvents, item, state, event }) {
//     insightsEvents.forEach((insightsEvent) => {
//       // Assuming you've initialized the Segment script
//       // and identified the current user already
//       console.log(
//         'SEGMENT (ACTIVE) Event Forwarding',
//         insightsEvents,
//         insights
//       );
//       // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//     });
//   },
//   onItemsChange({ insights, insightsEvents, item, state, event }) {
//     // Assuming you've initialized the Segment script
//     // and identified the current user already
//     console.log('SEGMENT (CHANGE) Event Forwarding', insightsEvents, insights);
//     // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//   },
//   onSelect({ insights, insightsEvents, item, state, event }) {
//     // Assuming you've initialized the Segment script
//     // and identified the current user already
//     console.log(
//       'SEGMENT (SELECT) Event Forwarding',
//       insightsEvents,
//       insights,
//       item
//     );
//     // analytics.track('Product Browsed from Autocomplete', insightsEvent);
//   },
// });

const AutocompleteSearch = () => {
  // REACT INITIALIZATION
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }
    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search for Products',
      renderer: { createElement, Fragment, render: () => { } },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },

      plugins: [querySuggestionsPlugin, recentSearchesPlugin, algoliaInsightsPlugin],
      getSources() {
        return [
          // (3) Use an Algolia index source.
          {
            sourceId: 'products',
            getItemInputValue({ item }) {
              return item.query;
            },
            getItems({ query }) {
              const results = getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    query,
                    params: {
                      hitsPerPage: 4,
                      clickAnalytics: true,
                    },
                  },
                ],
              });
              return results;
            },
            getItemUrl({ item }) {
              return `/?query=${item.name}`;
            },
            renderNoResults({ state, render }, root) {
              render(`No results for "${state.query}".`, root);
            },
            templates: {
              item({ item, components }) {
                return (
                  <div className="aa-ItemWrapper">
                    <div className="aa-ItemContent">
                      <div className="aa-ItemContentBody">
                        <div className="aa-ItemContentTitle">
                          <components.ReverseHighlight hit={item} attribute="name" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
              noResults() {
                return 'No matching items.';
              },
            },
          },
        ];
      },
    });
    setReady(true);
    return () => {
      search.destroy()
    }
  }, [])

  return <>
    <div className='autocomplete__container' ref={containerRef} />
    {!ready && <AutocomplteSSR />}
  </>
}

function AutocompletePage() {
  return <>
    <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
    <h1 className="mt-4 text-2xl font-bold mb-4">
      Autocomplete Server Side Rendering using <span className='text-amber-600'>autocomplete-js</span>
    </h1>
    <p className='mb-4 mt-2'>There is not Isomorphic Rendering for <span className='text-amber-600'>autocomplete-js</span>. However, a default
      rendering can be provided using <a className="underline" href="https://nextjs.org/docs/messages/react-hydration-error">useEffect</a> before the client rendering is executed.</p>
    <p className='mb-4 mt-2'>Test Server Side Rendering by running this page with Javascript disabled or Slow 3G Emulation!</p>
    <AutocompleteSearch />
  </>
}

export default AutocompletePage