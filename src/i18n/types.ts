export type Language = 'en' | 'ar'

export interface Translations {
  brand: {
    name: string
    tagline: string
  }
  announcement: string
  nav: {
    new: string
    outerwear: string
    knitwear: string
    trousers: string
    dresses: string
    accessories: string
    about: string
    search: string
    cart: string
  }
  hero: {
    eyebrow: string
    line1: string
    line2: string
    line3: string
    description: string
    browseCollection: string
    atelier: string
    scroll: string
  }
  featured: {
    eyebrow: string
    title: string
    viewAll: string
  }
  editorial: {
    collectionLabel: string
    pieces: string
    discover: string
  }
  categories: {
    eyebrow: string
    title: string
    description: string
  }
  manifesto: {
    eyebrow: string
    text: string
  }
  newsletter: {
    eyebrow: string
    title: string
    description: string
    placeholder: string
    subscribe: string
    thankYou: string
  }
  shop: {
    eyebrow: string
    allPieces: string
    categories: {
      all: string
      new: string
      outerwear: string
      knitwear: string
      trousers: string
      dresses: string
      accessories: string
    }
    sort: {
      latest: string
      priceLow: string
      priceHigh: string
    }
    pieces: string
    piece: string
    empty: string
    emptySub: string
    viewAll: string
  }
  product: {
    home: string
    collection: string
    subtitle: string
    inclTax: string
    color: string
    size: string
    sizeGuide: string
    selectSizeError: string
    addToCart: string
    added: string
    addedMsg: string
    details: string
    shipping1: string
    shipping2: string
    shipping3: string
    related: string
    browseAll: string
    notFound: string
    notFoundSub: string
    returnToShop: string
  }
  cart: {
    title: string
    close: string
    emptyEyebrow: string
    emptyTitle: string
    emptySub: string
    browseCollection: string
    remove: string
    quantity: string
    subtotal: string
    shippingNote: string
    freeShippingProgress: string
    checkout: string
  }
  about: {
    eyebrow: string
    title1: string
    title2: string
    manifestoEyebrow: string
    manifestoText: string
    clothTitle: string
    clothDesc: string
    cutTitle: string
    cutDesc: string
    makeTitle: string
    makeDesc: string
  }
  footer: {
    tagline: string
    description: string
    browse: string
    collections: string
    follow: string
    atelier: string
    rights: string
    privacy: string
    terms: string
    shipping: string
    returns: string
  }
  notFound: {
    eyebrow: string
    title: string
    description: string
    browseCollection: string
    returnHome: string
    errorLabel: string
    viewAll: string
  }
  loader: {
    established: string
  }
  common: {
    viewDetail: string
    new: string
  }
}
