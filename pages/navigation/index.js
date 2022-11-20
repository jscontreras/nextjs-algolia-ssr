import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { createFetchRequester } from '@algolia/requester-fetch';
import { App } from '../../components';
import Link from 'next/link';
import { NavApp } from '../../components/navApp';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76',
  {
    requester: createFetchRequester(),
  }
);

const indexName = "instant_search";


export default function SearchPage() {
  return (
    <>
      <Link href={'/'}><a className="text-blue-700">&larr; Home</a></Link>
      <NavApp searchClient={searchClient} indexName={indexName} routing={false} />
      <App
        searchClient={searchClient}
        indexName={indexName}
        routing={false}
      />
    </>
  );
}

