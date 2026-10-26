<template>
  <div id="block">
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <h2>NW2-Party</h2>
        <template v-if="!loading && !error">
          <p v-if="day && month">
            {{ t('p[0]', { day, month }) }}
          </p>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[1]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[2]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[3]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <i18n-t
            tag="p"
            keypath="p[4]"
          ></i18n-t>
          <div style="height: 1.5em;"></div>
          <div class="tw-flex tw-justify-center">
            <img
              v-if="image"
              :src="'/v1' + image"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nGlobal } from '@shared/i18n.js'
import nw2Party from '@static/nw2Event.js'

import { useTags } from '@shared/tags/registration.js'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
//import dayjs from 'dayjs'
import useDayjs from '@shared/dayjs.js'

type Image =
{
  data:
  {
    attributes:
    {
      url: string
    }
  }
}

type Party =
{
  Start: string
  Ende: string
  Preis: number
  Kuenstler: string
  Plakat: Image
  Plakat1x1: Image
  Plakat4x3: Image
  Plakat16x9: Image
}

type PartyData =
{
  data: Array<{ attributes: Party }>
}

type PartyQueryResult = {nw2Parties: PartyData}

function convertImage(img: Image)
{
  return img.data.attributes.url
}

function convertParty(party: Party)
{
  const { Start, Ende, Preis, Kuenstler,
    Plakat, Plakat1x1, Plakat4x3, Plakat16x9 } = party

  const { dayjs } = useDayjs()

  return {
    Start: dayjs(Start).tz(),
    Ende: dayjs(Ende).tz(),
    Preis,
    Kuenstler,
    Plakat: convertImage(Plakat),
    Plakat1x1: convertImage(Plakat1x1),
    Plakat4x3: convertImage(Plakat4x3),
    Plakat16x9: convertImage(Plakat16x9)
  }
}

export default defineComponent({
  setup()
  {
    const { t, locale } = useI18n({ useScope: "local" })
    const i18n = useI18nGlobal()
    const tagManager = useTags()

    const query = useQuery<PartyQueryResult>(gql`query recentParty
    {
      nw2Parties (sort: ["Ende:desc"], pagination: {limit: 1}){
        data{
          attributes{
            Start Ende Preis Kuenstler
            Plakat{data{attributes{url}}}
            Plakat1x1{data{attributes{url}}}
            Plakat4x3{data{attributes{url}}}
            Plakat16x9{data{attributes{url}}}
    }}}}`)

    const resultData = ref<ReturnType<typeof convertParty> | null>(null)

    const potParty = computed(() =>
    {
      const data = query.result?.value?.nw2Parties.data
      if (!data)
        return
      if (data.length === 0)
        return

      return data[0].attributes
    })

    const image = computed(() =>
    {
      const party = potParty.value
      if (!party)
        return

      return party.Plakat.data.attributes.url
    })

    function evaluate()
    {
      const data = query.result.value!.nw2Parties.data

      if (!data)
        return
      if (data.length === 0)
        return

      const party = data[0].attributes

      if (!party)
        return

      const partyResult = convertParty(party)

      const { Start, Ende, Plakat1x1, Plakat4x3, Plakat16x9, Preis, Kuenstler } = partyResult

      const partyData = nw2Party({ start: Start, end: Ende },
        { "1x1": Plakat1x1, "4x3": Plakat4x3, "16x9": Plakat16x9 }, Preis, Kuenstler)

      tagManager.try_emplace("nw2-party", partyData)
      resultData.value = partyResult
    }

    onBeforeMount(() =>
    {
      if (query.result.value)
        evaluate()
    })

    query.onResult(((result) =>
    {
      if (result.partial || result.error)
        return
      evaluate()
    }))

    const day = computed(() =>
    {
      if (!resultData.value)
        return

      return resultData.value.Start.date().toString()
    })
    const month = computed(() =>
    {
      if (!resultData.value)
        return

      return i18n.t(`month${resultData.value.Start.month() + 1}`)
    })
    const date = computed(() =>
    {
      if (!resultData.value)
        return

      return resultData.value.Start.format("D.M.")
    })
    const hour = computed(() =>
    {
      if (!resultData.value)
        return

      if (locale.value === 'de')
        return resultData.value.Start.format("H:mm")

      return resultData.value.Start.format("h:mm A")
    })

    return { image, loading: query.loading, error: query.error, day, month, date, hour, t }
  }
})
</script>

<style lang="less">
#block {
  h3 {
    font-size: 2rem;
    color: var(--color-primary-header);
  }
  h2 {
    font-size: 1.5rem;
    color: var(--color-primary-header);
  }
  h1 {
    font-size: 1.2rem;
    color: var(--color-secondary-header);
  }
  .a {
    color: lightblue;
  }
  .a:hover {
    color: var(--color-primary);
  }
  li,
  ul {
    margin-left: 20px;
    color: #f1f1f1;
  }
  p {
    text-align: justify;
    color: #f1f1f1;
  }
}
</style>

<i18n locale="de">
{
  "p[0]": "Bayreuths beste Studentenparty findet am Donnerstag, den {day}. {month} 2026 statt! \
    	    Gefeiert wird im NWII-Gebäude, aber der Einlass erfolgt ab 21:30 Uhr über den Innenhof.",
  "p[1]": "Abendkasse 8€",
  "p[2]": "Vorverkauf nur 7€",
  "p[3]": "Do 29.10., Mi 04.11. und Di 10.11. (jeweils von 11:00-13:00 Uhr)",
  "p[4]": "Auch dieses Semester feiern wir unter dem Motto NW2000-Party mit euch! \
          Lasst eure Ohren von satten Bässen quer durch die Musik ab der Jahrtausendwende massieren, \
          während ihr an der Physikerbar die Künste unserer Shaker bewundert.🍹",
  "p[5]": "Preise: Cocktails 5-7€, Bier 3,50€, Softdrinks 2€",
  "p[6]": "Zudem gibt es Brezen, Käsestangen und Leberkässemmeln (nur solange der Vorrat reicht).",
  "p[7]": "SPECIALS: Bier für 2€ in der 1. Stunde und 5 Shots für 5€, 11 Shots für 10€ all night ^^",
  "p[8]": "Einlass ab 18 Jahren!!! Ausweiskontrolle am Eingang! 🔞",
  "p[9]": "Wir freuen uns auf euch, also: Join us on Nov 12th 2026 to get this party started!",
  "p[10]": "#NW2000-Party #Musik: alles ab der Jahrtausendwende #NWII-Gebäude #Bayreuth #UniBayreuth #UniParty #BesteUniPartyBayreuth"
}
</i18n>

<i18n locale="en">
{
  "p[0]": "Bayreuth's best student party takes place on Thursday, {day}, {month}, 2026! \
            The party will be held in the NWII building, but admission begins at 9:30 p.m. via the courtyard.",
  "p[1]": "Box office tickets at the entrance: 8€",
  "p[2]": "Advance tickets: only 7€",
  "p[3]": "Thu, Oct. 29; Wed, Nov. 4; and Tue, Nov. 10 (11:00 a.m.-1:00 p.m. each day)",
  "p[4]": "This semester, we're celebrating with you again under the theme 'NW2000 Party'! \
          Let the rich bass lines from music spanning the turn of the millennium massage your ears, \
          while you admire the artistry of our bartenders at the Physikerbar. 🍹",
  "p[5]": "Prices: Cocktailse 5-7€, beer 3.50€, soft drinks 2€",
  "p[6]": "There will also be pretzels, cheese sticks, and Leberkaes sandwiches (while supplies last).",
  "p[7]": "SPECIALS: Beer for 2€ during the first hour and 5 shots for 5€, 11 shots for 10€ all night ^^",
  "p[8]": "18+ only!!! ID check at the door! 🔞",
  "p[9]": "We're looking forward to seeing you, so: Join us on Nov 12, 2026 to get this party started!",
  "p[10]": "#NW2000Party #Music: everything since the turn of the millennium #NWIIBuilding #Bayreuth #UniBayreuth #UniParty #BestUniPartyBayreuth"
}
</i18n>