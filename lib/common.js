
import { useEffect } from 'react';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import aa from 'search-insights';
import algoliasearch from 'algoliasearch';
import { useInstantSearch } from 'react-instantsearch';
const appId = 'SGF0RZXAXL';
const apiKey = '0ac0c3b165eb3773097eca1ac25d8fdd';

// Insights Analytics Client Initialization
aa("init", { appId, apiKey, useCookie: true });
// Set token for both Authenticated or unauthenticated users.
// aa('setUserToken', 'ma-user-999');

const sentPayloads = new Set();

/**
 * Insights Obj Configuration for instantSearch
 */
export const  insightsConfig = {
  insightsClient: aa,
  onEvent: (event, aa) => {
    const { insightsMethod, payload } = event;

    // Convert the payload object to a string for Set comparison
    const payloadString = JSON.stringify(payload);

    // Send the event to Algolia if it hasn't been sent before
    if (insightsMethod && !sentPayloads.has(payloadString)) {
      aa(insightsMethod, payload);
      sentPayloads.add(payloadString);
    }
  }
}

// Search client initialization
const algoliaClient = algoliasearch(
  appId,
  apiKey
);

/**
 * Search Client (proxy option)
 */
export const searchClient = {
  ...algoliaClient,
  search(requests) {
    // add custom logic at client lvl
    return algoliaClient.search(requests);
  }
};