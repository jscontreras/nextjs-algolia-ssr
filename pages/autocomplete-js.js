import { useEffect, useRef, createElement, Fragment, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import insightsClient from "search-insights";
import '@algolia/autocomplete-theme-classic';
import Link from 'next/link';
import { AutocomplteSSR } from '../components/autocompleteSSR';

// ALgolia Plugins
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';

const searchClient = algoliasearch(
  appId,
  apiKey,
);

insightsClient("init", { appId, apiKey, useCookie: false, userToken: 'ma-user-999' });

// Query Suggestion Plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',

});

// Recent Search Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});

// This Plugin has more options in case you want to forward events to GA4 etc.
// Insights Analytics Client (Setting User Toeken Dynamically);
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
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

function AutocompleteSearch() {
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search',
      insights: true,
      plugins: [recentSearchesPlugin, querySuggestionsPlugin, algoliaInsightsPlugin],
      getSources({ query }) {
        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    clickAnalytics: true,
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item, components }) {
                return <ProductItem hit={item} components={components} />;
              },
              noResults() {
                return 'No products matching.';
              },
            },
          },
        ];
      },
      renderer: { createElement, Fragment, render: () => { } },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
    });
    setReady(true);
    return () => {
      search.destroy();
    };
  }, []);
  return <>
    <div className='autocomplete__container' ref={containerRef} />
    {!ready && <AutocomplteSSR />}
  </>
}

function ProductItem({ hit, components }) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            By <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>
        </div>
      </div>
    </div>
  );
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