import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearchBasicApp } from '../../components/instantSearchBasicApp';
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
);

const indexName = "instant_search";
export default function SearchPage({ serverState, serverUrl }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchBasicApp
        searchClient={searchClient}
        indexName={indexName}
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
      />
    </InstantSearchSSRProvider>
  );
}

export async function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />, {renderToString});

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}
