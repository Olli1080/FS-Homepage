<template>
  <div
    v-if="pdf"
    style="width: 100%; height: 100%"
  >
    <v-no-ssr>
      <iframe
        :src="'/v1' + pdf"
        style="width: 100%; height: 100%"
        aria-label="Zeitschrift Keine Panik"
      >
        <a
        :href="'/v1' + pdf"
        download
        >
        <p>
        {{ t('no') }}<br />{{ t('click') }}
        <span class="tw-text-blue-500">{{ t('here') }}</span> {{ t('dl') }}
        </p>
        </a>
      </iframe>
    </v-no-ssr>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import ei from '@shared/Queries/einstellungen.js'

export default defineComponent({
  setup: () =>
  {
    const res = ei()

    const pdf = computed(() =>
    {
      return res.result.value?.einstellungen.data.attributes.keinePanik.data.attributes.url
    })
    const { t } = useI18n()

    return { pdf, t }
  }
})
</script>

<i18n locale="de">
{
  "no": "Dein Browser kann keine PDF anzeigen.",
  "click": "Klicke",
  "here": "hier",
  "dl": "um sie herunterzuladen"
}
</i18n>

<i18n locale="en">
{
  "no": "Your browser can't show pdfs.",
  "click": "Click",
  "here": "here",
  "dl": "to download it"
}
</i18n>
