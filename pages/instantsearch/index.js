// @refresh reset
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import qs from 'qs';
import algoliasearch from 'algoliasearch/lite';
// import { findResultsState } from 'react-instantsearch-dom/server';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { App } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const indexName = "instant_search";


export default function SearchPage({ serverState, serverUrl }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <App
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
  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />);

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}
