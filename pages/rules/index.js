import React from 'react';
import { renderToString } from 'react-dom/server';
import algoliasearch from 'algoliasearch/lite';
import { getServerState,  InstantSearchSSRProvider } from 'react-instantsearch';
import { InstantSearchRulesApp } from '../../components/instantSearchRulesApp';
import { history } from 'instantsearch.js/cjs/lib/routers/index.js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
);

// const searchClient = algoliasearch(
//   'SGF0RZXAXL',
//   '0ac0c3b165eb3773097eca1ac25d8fdd',
// );


const indexName = "instant_search";
export default function SearchPage({ serverState, serverUrl }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchRulesApp
        searchClient={searchClient}
        indexName={indexName}
        routing={{
          router: history({
            getLocation: () =>
              typeof window === 'undefined' ? new URL(serverUrl) : window.location,
          }),
        }}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />, { renderToString });

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}
