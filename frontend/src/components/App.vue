<template>
  <v-app>
    <router-view />
    <v-snackbar v-if="!isSSR && isMounted"
      v-model="showSnackbar"
      color="error"
      location="top"
      :timeout="-1"
      vertical
    >
      <div class="tw:font-bold tw:mb-2">
        {{ t('offlineNotice') }}
      </div>
      <template #actions>
        <v-progress-circular
          indeterminate
          size="24"
          class="tw:mr-2"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, onServerPrefetch, watch, computed, ref } from 'vue'
import { useSSRContext } from '@shared/ssrContext'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@shared/store'
import { createFaviconLink } from '@shared/favicon'
import { storeToRefs } from 'pinia'
import { VueRoutes } from '@client/routes'
import { determineLanguage } from '@shared/util'

import { useI18nGlobal } from '@shared/i18n'

export default defineComponent({
  name: 'app',
  setup()
  {
    const isSSR = import.meta.env.SSR
    const store = useStore()
    const { defaultTitle, defaultFavicon, backendOffline } = storeToRefs(store)
    const { t, locale } = useI18nGlobal()

    const route = useRoute()
    const router = useRouter()

    const isMounted = ref(false)
    const showSnackbar = ref(false)

    const title = computed(() =>
    {
      return t(route.meta.title ?? defaultTitle.value)
    })
    const favicon = computed<string | (() => Promise<typeof import('*?url')>)>(() =>
    {
      return route.meta.favicon ?? defaultFavicon.value
    })
    watch(() => route.path, (newValue) =>
    {
      locale.value = determineLanguage(newValue)
    }, { immediate: true })

    onServerPrefetch(async () =>
    {
      const ctx = useSSRContext()
      ctx.title = title.value

      ctx.favicon = (typeof favicon.value === 'string') ? favicon.value : (await favicon.value()).default
    })

    onMounted(() =>
    {
      isMounted.value = true
      // Sync snackbar state after hydration to avoid mismatch
      if (backendOffline.value) showSnackbar.value = true
      watch(backendOffline, (isOffline) => {
        showSnackbar.value = isOffline
      })

      document.title = title.value
      watch(title, (newTitle) =>
      {
        document.title = newTitle
      })
      watch(favicon, async (fav) =>
      {
        const favResolved = (typeof fav === 'string') ? fav : (await fav()).default

        const faviconLink = await createFaviconLink(favResolved)
        let exisitingLink: HTMLLinkElement | null =
          document.querySelector("link[rel*='icon']")
        if (exisitingLink)
        {
          if (!exisitingLink.isEqualNode(faviconLink))
            exisitingLink.replaceWith(faviconLink)
        }
        else document.head.appendChild(faviconLink)
      })

      watch(locale, () =>
      {
        router.replace('/' + VueRoutes.getKeyPath(route.meta.title!, locale.value))
        document.children[0].setAttribute('lang', locale.value)
      })
    })

    return { t, locale, showSnackbar, isMounted, isSSR }
  }
})
</script>

<style lang="scss">
@use "../css/vuetify_globals.scss";
</style>

<style lang="less">
@import '../css/fachschaft-styles.less';
</style>

<style>
@import "tailwindcss" prefix(tw);
</style>
