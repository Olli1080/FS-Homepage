import type { WithContext, Event, Organization } from "schema-dts"
import { useSSRContext as useVueContext } from "vue"
import type { SSRContext as VueContext } from "@vue/server-renderer"

export type SSRContext =
{
  styles: Record<string, string>
  //id, event
  events: Record<string, WithContext<Event>>
  organizations: Record<string, WithContext<Organization>>
  title?: string
  favicon?: string
  nonce: string,
  modules?: Set<string>,
  statusCode: number
} & VueContext

export function ensureContext(context: any)
{
  if (!context)
    context = {}

  if (!context.styles)
    Object.assign(context, { styles: {} })
  if (!context.events)
    context.events = {}
  if (!context.organizations)
    context.organizations = {}
  if (!context.nonce)
    Object.assign(context, { nonce: "" })
  if (!context.statusCode)
    Object.assign(context, { statusCode: 200 })

  return <SSRContext>context
}

export function useSSRContext()
{
  let context = useVueContext<Partial<SSRContext>>()
  return ensureContext(context)
}

export function registerEvent(id: string, event: WithContext<Event>)
{
  let context = useSSRContext()
  if (!context.events[id])
    context.events[id] = event
  else
    console.error("Event already registered with id: " + id)
}

export function registerOrganization(id: string, org: WithContext<Organization>)
{
  let context = useSSRContext()
  if (!context.organizations[id])
    context.organizations[id] = org
  else
    console.error("Organization already registered with id: " + id)
}