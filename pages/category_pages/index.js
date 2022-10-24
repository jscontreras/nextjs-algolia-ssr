import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { getServerState } from 'react-instantsearch-hooks-server';
import { InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { ArticlesApp } from '../../components';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import Link from 'next/link';

const searchClient = algoliasearch(
  'testing78Z9OD0TCK',
  'd18844ce6e75f713f36a0fbe3262f9fa'
);

const indexName = "sit_escape_content";


export default function SearchPage({ serverState, serverUrl, navItems }) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <ArticlesApp
        hideMenu={false}
        filters={false}
        searchClient={searchClient}
        indexName={indexName}
        navItems={navItems}
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
      navItems: [{ url: 'category_pages', title: 'Category pages' }]
    },
  };
}
