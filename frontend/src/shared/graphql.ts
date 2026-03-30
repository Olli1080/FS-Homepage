import { InMemoryCache, ApolloClient, Observable, ApolloLink } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'
import { ErrorLink } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ApolloClients } from '@vue/apollo-composable'

import type { ApolloClients as SSRApolloClients } from '@vue/apollo-ssr'
import type { App } from 'vue'

import { useStore } from './store.js'

let isPolling = false;
async function pollBackend(uri: string) {
  if (isPolling) return;
  isPolling = true;

  const pollInterval = 10000; // 10 seconds
  console.log(`Backend offline. Polling ${uri} every ${pollInterval/1000}s...`);

  while (true) {
    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        console.log('Backend is back online, reloading...');
        window.location.reload();
        break;
      }
    } catch (e) {
      // Still offline or timeout
    }
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
}

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (error && CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
  }

  // If it's a network error (not a CombinedGraphQLErrors)
  if (error && !CombinedGraphQLErrors.is(error)) {
    console.error(`[Network error]: ${error}`)
    
    if (!import.meta.env.SSR) {
      const store = useStore()
      if (store && !store.backendOffline) {
        store.backendOffline = true;
        // Use current window location to derive backend URI if possible, or fallback to default
        const uri = 'https://fsmpi.uni-bayreuth.de/v1/graphql';
        pollBackend(uri);
      }
    }

    // If we're on SSR and it's a network error (like timeout/server down), 
    // return an empty result to prevent SSR from crashing/returning 500.
    if (import.meta.env.SSR) {
      return new Observable<ApolloLink.Result>(observer => {
        observer.next({ data: null, errors: [] })
        observer.complete()
      })
    }
  }
})

function networkMiddleware(networkToken: string)
{
  //@ts-ignore
  return new ApolloLink((operation, forward) =>
  {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        'network-token': networkToken
      }
    }))
    return forward(operation)
  })
}

async function genHttpLink()
{
  const uri = (import.meta.env.SSR) ? 'http://strapi:1337/graphql' : 'https://fsmpi.uni-bayreuth.de/v1/graphql'
  const credentials = 'same-origin'

  if (import.meta.env.SSR)
  {
    const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal
        });
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return new HttpLink({ uri, fetch: fetchWithTimeout, credentials })
  }

  if (typeof fetch !== 'undefined')
    return new HttpLink({ uri, credentials })

  return new HttpLink({ uri, fetch: (await import('cross-fetch')).default, credentials })
}

async function genClients(networkToken?: string)
{
  const http = await genHttpLink()

  const apolloOptions: ApolloClient.Options = {
    link: ApolloLink.from([
      errorLink,
      (import.meta.env.SSR && networkToken) ? networkMiddleware(networkToken).concat(http) : http
    ]),
    cache: !import.meta.env.SSR
    //@ts-ignore
      ? new InMemoryCache().restore((<Object>window.__APOLLO_STATE__).default)
      : new InMemoryCache(),
    ...(import.meta.env.SSR ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100
    })
  }

  if (!import.meta.env.SSR)
    Array.from(window!.document!.getElementsByTagName('script'))!.find((val)=>
    {
      return val.text.startsWith("window.__APOLLO_STATE__")
    })!.remove()

  let clients: SSRApolloClients = {}
  clients["default"] = new ApolloClient(apolloOptions)

  return clients
}

export async function createGraphql(networkToken?: string)
{
  const clients = await genClients(networkToken)
  return {
    clients,
    install(app: App)
    {
      //for (const key in clients)
      app.provide(ApolloClients, clients)
    }
  }
}
