import React from 'react';
import { renderToString } from 'react-dom/server';
import { getServerState,  InstantSearchSSRProvider } from 'react-instantsearch';
import { InstantSearchRulesApp } from '../../components/instantSearchRulesApp';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import { searchClient } from '../../lib/common';

// const searchClient = algoliasearch(
//   'latency',
//   '6be0576ff61c053d5f9a3225e2a90f76',
// );

const indexName = "instant_search";
export default function SearchPage({ serverState, serverUrl, clientUserToken = null }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchRulesApp
        searchClient={searchClient}
        indexName={indexName}
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
        clientUserToken={clientUserToken}
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
      clientUserToken: req.cookies._ALGOLIA || null
    },
  };
}
