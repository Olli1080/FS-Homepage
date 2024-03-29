<template>
  <div id="vertreter">
    <i18n-t
      keypath="header"
      tag="h5"
      class="header"
    />
    <br />
    <div class="tw-flex tw-flex-col tw-items-center">
      <div class="all-container">
        <SingleVertreter
          v-for="vertreter_it in vertreter"
          :key="vertreter_it.name"
          v-bind="{...vertreter_it}"
        />
      </div>
    </div>
    <br />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

import SingleVertreter from './single-vertreter.vue'

import type { VertreterGQL, Faecher, Lehramt, Grad, Feld, Rolle } from '@dataInterfaces/IVertreter.js'
import { mdiAxisZRotateClockwise } from '@mdi/js'

type Vertreter = {
  name: string,
  email: string,
  rolle: Rolle,
  feld: Feld,
  grad: Grad,
  hauptfach: Faecher,
  lehramt?: {schultyp: Lehramt, zweitfach_DE?:string, zweitfach_EN?:string, drittfach_DE?:string, drittfach_EN?:string}
  semester: number,
  portraitUrl: string,
  placeholder: {
    width: number,
    height: number
  }
}

export default defineComponent({
  components: {
    SingleVertreter
  },
  setup: () =>
  {
    const { t } = useI18n()

    const res = useQuery<{ vertreters: VertreterGQL }>(gql`
    {
      vertreters (filters: {aktiv: {eq: true}}, pagination: {pageSize: 100})
      {
        data {
          attributes {
            anzeigeName
            grad
            feld
            semester
            portrait {data{attributes{url width height}}}
            hauptfach{fach}
            lehramt {
              zweitfach_DE
              zweitfach_EN
              drittfach_DE
              drittfach_EN
              schultyp
            }
            position
            email
          }
        }
      }
    }
    `)

    const items: Record<string, number> =
    {
      /*"HEAD": 11,
      "VICE": 10,
      "FINANCES": 9,
      "NETWORKING": 8,
      "UNI-CINEMA": 7,
      "PUBLIC RELATIONS": 6,
      "BEER COORDINATION": 5,
      "PHYSICIST BAR": 4,
      "GRAPHICS": 3,
      "SCRIPTS": 2,
      "ROOT": 1*/
      "Chef": 11,
      "Vize": 10,
      "Finanzen": 9,
      "Vernetzung": 8,
      "Uni_Kino": 7,
      "Oeffentlichkeitsarbeit": 6,
      "Bierkoordination": 5,
      "Physikerbar": 4,
      "Grafiken": 3,
      "Skripten": 2,
      "Root": 1
    }

    const vertreter = computed(() =>
    {
      if (!res.result.value)
        return []

      return [...res.result.value.vertreters.data].sort((a, b) =>
      {
        return items[b.attributes.position] - items[a.attributes.position]
      }).map((val) =>
      {
        const temp = val.attributes

        let vertreter: Vertreter = {
          name: temp.anzeigeName,
          email: temp.email,
          rolle: temp.position,
          feld: temp.feld,
          grad: temp.grad,
          hauptfach: temp.hauptfach.fach,
          semester: temp.semester,
          portraitUrl: temp.portrait.data.attributes.url,
          placeholder: {
            width: temp.portrait.data.attributes.width,
            height: temp.portrait.data.attributes.height
          }
        }
        if (temp.lehramt)
          vertreter.lehramt = {
            zweitfach_DE: temp.lehramt.zweitfach_DE,
            zweitfach_EN: temp.lehramt.zweitfach_EN,
            drittfach_DE: temp.lehramt.drittfach_DE,
            drittfach_EN: temp.lehramt.drittfach_EN,
            schultyp: temp.lehramt.schultyp
          }

        return vertreter
      })
    })

    return { vertreter, t }
  }
})
</script>

<style lang="less">
#vertreter {
  .header {
    font-size: 2rem;
    text-align: center;
    color: var(--color-primary-header);
  }

  .all-container {
    width: 98%;

    justify-content: center;
    align-items: center;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    grid-template-rows: repeat(auto, max-content);
    column-gap: 10px;
    row-gap: 15px;
    align-items: stretch;

    @media only screen and (max-width: 460px) {
      display: flex;
      flex-direction: column;
      width: max-content;
      max-width: 100%;
    }
  }
}
</style>

<i18n locale="de">
{
  "header": "Aktuelle Vertreter der Fachschaft FSMPI"
}
</i18n>

<i18n locale="en">
{
  "header": "Current representatives of the student council FSMPI"
}
</i18n>
