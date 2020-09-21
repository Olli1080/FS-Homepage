/**
 * Factor Settings - How settings work in Factor...
 *
 * Your settings files are how you customize themes and plugins.
 * They allow you to set text and images, but also override components, routes and more.
 *
 */
/*export default {
  dashboard: {
    route: "/dashboard",
  },
}*/
export default {

  metatags: {
    defaultTitle: "FSMPI",
    titleTemplate: null,//"%s - Factor JS",
  },

  app: {
    components: {
      error404: (): Promise<any> => import("./404.vue"),
      content: (): Promise<any> => import("./content.vue"),
      pdfsth: (): Promise<any> => import("./pdfsth.vue"),
    },
  },

  site: {
    components: {
      header: (): Promise<any> => import("./header.vue"),
      footer: (): Promise<any> => import("./footer.vue"),
    },
    logo: require("./static/img/tross.svg"),
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "aktive_vertreter",
        path: "/fs-vertreter",
        name: "Aktive Vertreter",
      },
      {
        _item: "Keine Panik",
        path: "/keine-panik",
        name: "Keine Panik",
      },
      {
        _item: "Sprechstunden",
        path: "/sprechstunden",
        name: "Sprechstunden",
      },
      {
        _item: "Aktuelles",
        path: "/aktuelles",
        name: "Aktuelles",
      },
      {
        _item: "Kontakt",
        path: "/kontakt",
        name: "Kontakt",
      },
      {
        _item: "dashboard",
        path: "/dashboard",
        name: "Dashboard &rarr;",
      },
    ],
  },
  /**
 * Copy for the home page template.
 */
  home: {
    component: (): Promise<any> => import("./home.vue"),
    buttons: [
      {
        _item: "Kontakt",
        link: "/kontakt",
        text: "Nimm Kontakt mit uns auf ;)",
        classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600",
      },
    ]
  },

  aktive_vertreter: {

    buttons: [
      {
        _item: "Kontakt",
        link: "/kontakt",
        text: "Nimm Kontakt mit uns auf ;)",
        classes: "btn mr-4 text-purple-100 bg-purple-500 hover:bg-purple-600",
      },
    ]
  },
  // Footer
  footer: {
    nav: [
      {
        _item: "home",
        path: "/",
        name: "Home",
      },
      {
        _item: "Aktive Vertreter",
        path: "/fs-vertreter",
        name: "Aktive Vertreter",
      },
      {
        _item: "Keine Panik",
        path: "/keine-panik",
        name: "Keine Panik",
      },
      {
        _item: "Sprechstunden",
        path: "/sprechstunden",
        name: "Sprechstunden",
      },
      {
        _item: "Aktuelles",
        path: "/aktuelles",
        name: "Aktuelles",
      },
      {
        _item: "Kontakt",
        path: "/kontakt",
        name: "Kontakt",
      },
      {
        _item: "twitter",
        path: "https://twitter.com/",
        icon: "fab fa-twitter",
        target: "_blank",
      },
      {
        _item: "instagram",
        path: "https://www.instagram.com/fachschaft_mpi/?hl=de",
        icon: "fab fa-instagram",
        target: "_blank",
      },
      {
        _item: "facebook",
        path: "https://de-de.facebook.com/fsmpi/",
        icon: "fab fa-facebook",
        target: "_blank",
      },
    ],
    figure: null,
  },
}
