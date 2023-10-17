
import aa from 'search-insights';
import algoliasearch from 'algoliasearch';
const appId = 'SGF0RZXAXL';
const apiKey = '0ac0c3b165eb3773097eca1ac25d8fdd';

// Insights Analytics Client Initialization
if (typeof window !== "undefined") {
  let userToken = getCookie('_ALGOLIA');
  console.log('userToken', userToken)
  // Set token for both Authenticated or unauthenticated users.
  if (userToken) {
    aa("init", { appId, apiKey, useCookie: true, userToken });
  } else {
    aa("init", { appId, apiKey, useCookie: true });
  }
}



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


function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}