import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

function InstantSearchComponent({
  searchClient,
  searchState,
  resultsState,
  onSearchParameters,
  widgetsCollector,
  ...props
}) {
  return (
    <InstantSearch
      {...props}
      indexName={indexName}
      searchClient={searchClient}
      searchState={searchState}
      resultsState={resultsState}
      onSearchParameters={onSearchParameters}
      widgetsCollector={widgetsCollector}
    >
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
}

export { InstantSearchComponent };