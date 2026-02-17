import * as mapboxsearch from '@mapbox/search-js-web';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.mapboxsearch = mapboxsearch
  })