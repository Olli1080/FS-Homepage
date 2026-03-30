interface MetaEntry {
  [key: string]: string
}

const metaEntries: MetaEntry[] =
    [
      {
        "charset": "UTF-8"
      },
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1.0"
      },
      {
        "name": "description",
        "content": "Offizielle Website der Fachschaft Mathematik, Physik und Informatik der Universität Bayreuth. Wir unterstützen Studierende mit Infos zum Studium, Events und Sprechstunden."
      },
      {
        "name": "robots",
        "content": "index, follow"
      },
      {
        "name": "theme-color",
        "content": "#ff6600"
      },
      {
        "property": "og:type",
        "content": "website"
      },
      {
        "property": "og:url",
        "content": "https://fsmpi.uni-bayreuth.de/"
      },
      {
        "property": "og:title",
        "content": "Fachschaft MPI - Uni Bayreuth"
      },
      {
        "property": "og:description",
        "content": "Studierendenvertretung für Mathematik, Physik und Informatik an der Universität Bayreuth. Informationen zu Events, Erstsemester-Hilfe und Sprechstunden."
      },
      {
        "property": "og:image",
        "content": "https://fsmpi.uni-bayreuth.de/dist/assets/tross.svg"
      },
      // TODO: Consider adding a specific 1200x630px PNG/JPG image for better social media previews
      // as some platforms (WhatsApp/FB) have limited support for SVGs in OG tags.
      {
        "name": "twitter:card",
        "content": "summary_large_image"
      },
      {
        "name": "twitter:title",
        "content": "Fachschaft MPI - Uni Bayreuth"
      },
      {
        "name": "twitter:description",
        "content": "Studieninfos und Events der Fachschaft MPI an der Uni Bayreuth."
      }
      /*
      {
        "name": "google-site-verification",
        "content": "PLEASE_INSERT_HERE"
      }
      */
    ]

export function getMeta(): string
{
  let out: string = ""
  metaEntries.forEach(element =>
  {
    out += `<meta `
    for (let key in element)
    {
      out += `${key}="${element[key]}" `
    }
    out += `>`
  })

  return out
}
