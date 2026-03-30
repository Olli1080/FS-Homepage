import type { Organization, WithContext } from 'schema-dts'

const fsUrl = "https://fsmpi.uni-bayreuth.de"

const fsmpiOrganization: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fachschaft Mathematik, Physik und Informatik - Universität Bayreuth',
  url: fsUrl,
  logo: `${fsUrl}/dist/assets/tross.svg`,
  sameAs: [
    'https://www.instagram.com/fachschaft_mpi/',
    'https://facebook.com/fsmpi'
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Universitätsstraße 30, NW II, zwischen H 20 und S 78',
    addressLocality: 'Bayreuth',
    postalCode: '95447',
    addressCountry: 'DE'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      email: 'fsmpi@uni-bayreuth.de',
      telephone: '+49-921-55-3101',
      contactType: 'student support'
    }
  ]
}

export default fsmpiOrganization
