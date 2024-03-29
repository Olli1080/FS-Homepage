<template>
  <div class="vertreter-container">
    <div class="image-container">
      <div
        v-if="placeholder && !loadedImg"
        class="tw-flex tw-items-center tw-justify-center"
        :style="{width: Math.min(120, placeholder.width) + 'px' }"
      >
        <v-progress-circular
          v-if="placeholder"
          :size="Math.min(120, placeholder.width) - 10"
          indeterminate
          color="var(--color-primary)"
          overflow="hidden"
        ></v-progress-circular>
      </div>
      <img
        class="image"
        :class="{'tw-hidden': !loadedImg}"
        :src="'/v1' + portraitUrl"
        :alt="name"
        ref="img"
        @load="() => { loadedImg = true }"
        @error="() => { loadedImg = true }"
      />
    </div>
    <i18n-t
      keypath="name"
      tag="p"
      scope="global"
      class="property"
    />
    <p
      class="value"
      v-text="name"
    ></p>

    <i18n-t
      keypath="role"
      tag="p"
      scope="global"
      class="property"
    />
    <p
      class="value"
      v-text="t(rolle)"
    ></p>

    <v-icon
      large
      :icon="mdiSchool"
    />
    <studiengang
      class="value"
      :feld="feld"
      :grad="grad"
      :hauptfach="hauptfach"
      :zweitfach_de="lehramt?.zweitfach_DE"
      :zweitfach_en="lehramt?.zweitfach_EN"
      :drittfach_de="lehramt?.drittfach_DE"
      :drittfach_en="lehramt?.drittfach_EN"
      :lehramt="lehramt?.schultyp"
    />

    <i18n-t
      keypath="semester"
      tag="p"
      class="property"
    />
    <p
      class="value"
      v-text="semester"
    ></p>

    <v-icon
      large
      :icon="mdiEmail"
    />
    <a :href="'mailto:' + email">
      <p
        class="value"
        v-text="email"
      ></p>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n.js'
import studiengang from './studiengang.vue'
import { mdiEmail, mdiSchool } from '@mdi/js'

import type { PropType } from 'vue'
import type { Faecher, Lehramt, Grad, Feld, Rolle } from '@dataInterfaces/IVertreter.js'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    rolle: {
      type: String as PropType<Rolle>,
      required: true
    },
    feld: {
      type: String as PropType<Feld>,
      required: true
    },
    grad: {
      type: String as PropType<Grad>,
      required: true
    },
    hauptfach: {
      type: String as PropType<Faecher>,
      required: true
    },
    lehramt: {
      type: Object as PropType<{ zweitfach_DE?: string, zweitfach_EN?: string, drittfach_DE?: string, drittfach_EN?: string, schultyp: Lehramt }>,
      required: false,
      default: undefined
    },
    semester: {
      type: Number,
      required: true
    },
    portraitUrl: {
      type: String,
      required: true
    },
    placeholder: {
      type: Object as PropType<{width: number, height: number}>,
      required: false,
      default: undefined
    }
  },
  components: {
    studiengang
  },
  name: 'SingleVertreter',
  setup: () =>
  {
    const tGlobal = useI18nGlobal().t
    const { t } = useI18n()
    const img = ref<HTMLImageElement | null>(null)

    const loadedImg = ref<boolean>(false)

    onMounted(() =>
    {
      loadedImg.value = loadedImg.value || img.value!.complete
    })

    return {
      t,
      tGlobal,
      mdiEmail,
      mdiSchool,
      loadedImg,
      img
    }
  }
})
</script>

<style lang="less">
.vertreter-container {
  background: rgb(51, 49, 48);
  display: grid;
  align-items: flex-start;
  grid-template-columns: [col-image-start] max-content [col-image-end col-properties-start] auto [col-properties-end col-value-start] auto [col-value-end];
  grid-template-rows: repeat(5, auto);
  column-gap: 0.3vw;
  row-gap: 0.3vh;

  border: 5px solid;
  border-radius: 6px;
  border-color: rgb(255, 115, 0);
  border-style: outset;

  overflow: hidden;
  align-content: space-between;

  @media only screen and (max-width: 460px) {
    grid-template-columns: [col-properties-start] auto [col-properties-end col-value-start] auto [col-value-end];
    grid-template-rows: [row-image-start] max-content [row-image-end] repeat(
        5,
        auto
      );
  }

  .image-container {
    background: white;
    grid-row-start: 1;
    grid-row-end: -1;
    grid-column: col-image-start / col-image-end;
    max-width: 120px;
    height: 100%;
    display: flex;

    @media only screen and (max-width: 460px) {
      grid-row-start: row-image-start;
      grid-row-end: row-image-end;
      grid-column-start: col-properties-start;
      grid-column-end: col-value-end;

      width: 100%;
      max-width: 100%;
      max-height: auto;
    }

    .image {
      max-height: 100%;
      margin: auto;
      height: auto;
      width: auto;

      @media only screen and (max-width: 460px) {
        max-height: 30vh;
      }
    }
  }
  color: rgb(192, 192, 192);
  .property {
    grid-column: col-properties-start / col-properties-end;
  }

  .value {
    grid-column: col-value-start / col-value-end;
  }
}
</style>

<i18n locale="de">
{
  "degreeCourse": "Studiengang",
  "semester": "Semester",
  "Chef": "Chef",
  "Vize": "Vize",
  "Finanzen": "Finanzen",
  "Vernetzung": "Vernetzung",
  "Uni_Kino": "Uni-Kino",
  "Oeffentlichkeitsarbeit": "Öffentlichkeitsarbeit",
  "Bierkoordination": "Bierkoordination",
  "Physikerbar": "Physikerbar",
  "Grafiken": "Grafiken",
  "Skripten": "Skripten",
  "Root": "Root"
}
</i18n>

<i18n locale="en">
{
  "degreeCourse": "Degree course",
  "semester": "Semester",
  "Chef": "Head",
  "Vize": "Vice",
  "Finanzen": "Finances",
  "Vernetzung": "Networking",
  "Uni_Kino": "Uni-Cinema",
  "Oeffentlichkeitsarbeit": "Public relations",
  "Bierkoordination": "Beer coordination",
  "Physikerbar": "Physicist bar",
  "Grafiken": "Graphics",
  "Skripten": "Scripts",
  "Root": "Root"
}
</i18n>
