import type { MenuSection, VenueMenuData } from './menu-data'

// ---------------------------------------------------------------------------
// Saly cocktail sections — taste-based (same nav paradigm as BB)
// Auto-classification: user will fine-tune later.
// ---------------------------------------------------------------------------

const salyBitter: MenuSection = {
  key: 'bitter',
  type: 'cocktail',
  i18n: {
    en: { label: 'Bitter', sub: '' },
    pl: { label: 'Gorzkie' },
    sq: { label: 'Të hidhura' },
    it: { label: 'Amaro' },
    uk: { label: 'Гіркі' },
    de: { label: 'Bitter' },
    fr: { label: 'Amer' },
    no: { label: 'Bitter' },
  },
  items: [
    { id: 'saly-campari-spritz', slug: 'saly-campari-spritz', price: 'L600', glass: 'wine',
      i18n: { en: { name: 'Campari Spritz', desc: '' }, pl: { name: 'Campari Spritz', desc: '' } } },
    { id: 'saly-aperol-spritz', slug: 'saly-aperol-spritz', price: 'L600', glass: 'wine',
      i18n: { en: { name: 'Aperol Spritz', desc: '' }, pl: { name: 'Aperol Spritz', desc: '' } } },
    { id: 'saly-negroni', slug: 'saly-negroni', price: 'L800', glass: 'rocks',
      i18n: { en: { name: 'Negroni', desc: '' }, pl: { name: 'Negroni', desc: '' } } },
    { id: 'saly-old-fashioned', slug: 'saly-old-fashioned', price: 'L800', glass: 'rocks',
      i18n: { en: { name: 'Old Fashioned', desc: '' }, pl: { name: 'Old Fashioned', desc: '' } } },
    { id: 'saly-jungle-bird', slug: 'saly-jungle-bird', price: 'L900', glass: 'rocks',
      i18n: { en: { name: 'Jungle Bird', desc: '' }, pl: { name: 'Jungle Bird', desc: '' } } },
  ],
}

const salySour: MenuSection = {
  key: 'sour',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sour', sub: '' },
    pl: { label: 'Kwaśne' },
    sq: { label: 'Të thartat' },
    it: { label: 'Aspro' },
    uk: { label: 'Кислі' },
    de: { label: 'Sauer' },
    fr: { label: 'Acide' },
    no: { label: 'Surt' },
  },
  items: [
    { id: 'saly-vodka-sour', slug: 'saly-vodka-sour', price: 'L700', glass: 'rocks',
      i18n: { en: { name: 'Vodka Sour', desc: '' }, pl: { name: 'Vodka Sour', desc: '' } } },
    { id: 'saly-margarita', slug: 'saly-margarita', price: 'L700', glass: 'coupe',
      i18n: { en: { name: 'Margarita', desc: '' }, pl: { name: 'Margarita', desc: '' } } },
    { id: 'saly-whiskey-sour', slug: 'saly-whiskey-sour', price: 'L800', glass: 'rocks',
      i18n: { en: { name: 'Whiskey Sour', desc: '' }, pl: { name: 'Whiskey Sour', desc: '' } } },
    { id: 'saly-daiquiri', slug: 'saly-daiquiri', price: 'L800', glass: 'coupe',
      i18n: { en: { name: 'Daiquiri', desc: '' }, pl: { name: 'Daiquiri', desc: '' } } },
    { id: 'saly-side-car', slug: 'saly-side-car', price: 'L800', glass: 'coupe',
      i18n: { en: { name: 'Side Car', desc: '' }, pl: { name: 'Side Car', desc: '' } } },
    { id: 'saly-cosmopolitan', slug: 'saly-cosmopolitan', price: 'L800', glass: 'martini',
      i18n: { en: { name: 'Cosmopolitan', desc: '' }, pl: { name: 'Kosmopolitan', desc: '' } } },
  ],
}

const salySweet: MenuSection = {
  key: 'sweet',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sweet', sub: '' },
    pl: { label: 'Słodkie' },
    sq: { label: 'Të ëmbla' },
    it: { label: 'Dolce' },
    uk: { label: 'Солодкі' },
    de: { label: 'Süß' },
    fr: { label: 'Sucré' },
    no: { label: 'Søtt' },
  },
  items: [
    { id: 'saly-mojito', slug: 'saly-mojito', price: 'L600', glass: 'collins',
      i18n: { en: { name: 'Mojito', desc: '' }, pl: { name: 'Mojito', desc: '' } } },
    { id: 'saly-hugo-spritz', slug: 'saly-hugo-spritz', price: 'L700', glass: 'wine',
      i18n: { en: { name: 'Hugo Spritz', desc: '' }, pl: { name: 'Hugo Spritz', desc: '' } } },
    { id: 'saly-sex-on-the-beach', slug: 'saly-sex-on-the-beach', price: 'L700', glass: 'collins',
      i18n: { en: { name: 'Sex on the Beach', desc: '' }, pl: { name: 'Sex on the Beach', desc: '' } } },
    { id: 'saly-blue-lagoon', slug: 'saly-blue-lagoon', price: 'L700', glass: 'collins',
      i18n: { en: { name: 'Blue Lagoon', desc: '' }, pl: { name: 'Blue Lagoon', desc: '' } } },
    { id: 'saly-tequila-sunrise', slug: 'saly-tequila-sunrise', price: 'L700', glass: 'collins',
      i18n: { en: { name: 'Tequila Sunrise', desc: '' }, pl: { name: 'Tequila Sunrise', desc: '' } } },
    { id: 'saly-pink-lady', slug: 'saly-pink-lady', price: 'L800', glass: 'martini',
      i18n: { en: { name: 'Pink Lady', desc: '' }, pl: { name: 'Pink Lady', desc: '' } } },
    { id: 'saly-espresso-martini', slug: 'saly-espresso-martini', price: 'L800', glass: 'martini',
      i18n: { en: { name: 'Espresso Martini', desc: '' }, pl: { name: 'Espresso Martini', desc: '' } } },
    { id: 'saly-pina-colada', slug: 'saly-pina-colada', price: 'L800', glass: 'rocks',
      i18n: { en: { name: 'Piña Colada', desc: '' }, pl: { name: 'Piña Colada', desc: '' } } },
    { id: 'saly-pornstar-martini', slug: 'saly-pornstar-martini', price: 'L800', glass: 'martini',
      i18n: { en: { name: 'Pornstar Martini', desc: '' }, pl: { name: 'Pornstar Martini', desc: '' } } },
    { id: 'saly-signature', slug: 'saly-signature', price: 'L900', glass: 'martini', house: true,
      i18n: { en: { name: 'Saly Signature', desc: '' }, pl: { name: 'Saly Signature', desc: '' } } },
    { id: 'saly-amf', slug: 'saly-amf', price: 'L1000', glass: 'collins',
      i18n: { en: { name: 'AMF', desc: '' }, pl: { name: 'AMF', desc: '' } } },
    { id: 'saly-long-island', slug: 'saly-long-island', price: 'L1000', glass: 'collins',
      i18n: { en: { name: 'Long Island', desc: '' }, pl: { name: 'Long Island', desc: '' } } },
  ],
}

// ---------------------------------------------------------------------------
// Saly food sections
// ---------------------------------------------------------------------------

const cold: MenuSection = {
  key: 'cold',
  type: 'food',
  i18n: {
    en: { label: 'Cold & raw', sub: 'From the cold counter' },
    pl: { label: 'Zimne i surowe', sub: 'Z zimnego lady' },
  },
  items: [
    { id: 'mix-krudo', slug: 'mix-krudo', price: 'L4000', glass: 'wine',
      badge: 'For 2',
      videoSrc: '/venue-assets/saly/saly-hero.mp4',
      posterSrc: '/venue-assets/saly/saly-hero.jpg',
      i18n: {
        en: { name: 'Crudo mix', desc: 'Tiger shrimp, viola, scampi, salmon, octopus and sea bass carpaccio.' },
        pl: { name: 'Crudo mix', desc: 'Krewetki tygrysie, viola, scampi, łosoś, ośmiornica i carpaccio z dorsza.' },
      } },
    { id: 'ostrike', slug: 'ostrike', price: 'L3000/kg', glass: 'wine',
      i18n: {
        en: { name: 'Oysters', desc: 'On ice, with lemon.' },
        pl: { name: 'Ostrygi', desc: 'Na lodzie, z cytryną.' },
      } },
    { id: 'salmon-tartar', slug: 'salmon-tartar', price: 'L1300', glass: 'wine',
      i18n: {
        en: { name: 'Salmon tartare', desc: 'Avocado, lime, apple.' },
        pl: { name: 'Tatar z łososia', desc: 'Awokado, limonka, jabłko.' },
      } },
    { id: 'ton-tartar', slug: 'ton-tartar', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Tuna tartare', desc: 'Hand-cut, olive oil, citrus.' },
        pl: { name: 'Tatar z tuńczyka', desc: 'Krojony ręcznie, oliwa z oliwek, cytrusy.' },
      } },
    { id: 'acuge', slug: 'acuge', price: 'L800', glass: 'wine',
      i18n: {
        en: { name: 'Marinated anchovies', desc: 'Cured in vinegar and oil.' },
        pl: { name: 'Marynowane sardele', desc: 'Marynowane w occie i oleju.' },
      } },
  ],
}

const warm: MenuSection = {
  key: 'warm',
  type: 'food',
  i18n: {
    en: { label: 'Warm starters', sub: 'To start, warm' },
    pl: { label: 'Ciepłe przystawki', sub: 'Na ciepło, na start' },
  },
  items: [
    { id: 'karkalec-brandy-tartuf', slug: 'karkalec-brandy-tartuf', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Shrimp, brandy & truffle', desc: 'Pan-seared, flamed in brandy.' },
        pl: { name: 'Krewetki, brandy i trufla', desc: 'Smażone na patelni, flambowane brandy.' },
      } },
    { id: 'sepie-ala-siciliane', slug: 'sepie-ala-siciliane', price: 'L1400', glass: 'wine',
      i18n: {
        en: { name: 'Stewed Sicilian cuttlefish', desc: 'Cherry tomatoes, olives, caper, white wine.' },
        pl: { name: 'Duszona mątwa po sycylijsku', desc: 'Pomidorki cherry, oliwki, kapary, białe wino.' },
      } },
    { id: 'mix-kroketash', slug: 'mix-kroketash', price: 'L1000', glass: 'wine',
      i18n: {
        en: { name: 'Croquettes, fish & crab', desc: 'Crisp outside, soft centre.' },
        pl: { name: 'Krokiety, ryba i krab', desc: 'Chrupiące na zewnątrz, miękkie w środku.' },
      } },
    { id: 'midhje', slug: 'midhje', price: 'L700', glass: 'wine',
      i18n: {
        en: { name: 'Mussels', desc: 'Steamed, white wine and garlic.' },
        pl: { name: 'Małże', desc: 'Na parze, białe wino i czosnek.' },
      } },
    { id: 'tave-karkalec', slug: 'tave-karkalec', price: 'L1000', glass: 'wine',
      i18n: {
        en: { name: 'Shrimp casserole, orange', desc: 'Baked, orange and herbs.' },
        pl: { name: 'Krewetki zapiekane z pomarańczą', desc: 'Pieczone z pomarańczą i ziołami.' },
      } },
  ],
}

const salads: MenuSection = {
  key: 'salads',
  type: 'food',
  i18n: {
    en: { label: 'Salads', sub: '' },
    pl: { label: 'Sałatki', sub: '' },
  },
  items: [
    { id: 'sallate-fruta-deti', slug: 'sallate-fruta-deti', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Seafood salad', desc: '' },
        pl: { name: 'Sałatka z owoców morza', desc: '' },
      } },
    { id: 'sallate-oktapodi', slug: 'sallate-oktapodi', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Octopus salad', desc: '' },
        pl: { name: 'Sałatka z ośmiornicy', desc: '' },
      } },
    { id: 'karkalec-katalonia', slug: 'karkalec-katalonia', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Shrimp catalognia', desc: '' },
        pl: { name: 'Krewetki katalońskie', desc: '' },
      } },
  ],
}

const pasta: MenuSection = {
  key: 'pasta',
  type: 'food',
  i18n: {
    en: { label: 'Pasta & risotto', sub: 'Made to order' },
    pl: { label: 'Makaron i risotto', sub: 'Przygotowywane na zamówienie' },
  },
  items: [
    { id: 'linguine-fruta-deti', slug: 'linguine-fruta-deti', price: 'L900', glass: 'wine',
      i18n: {
        en: { name: 'Seafood linguine', desc: 'Mixed shellfish, garlic, white wine.' },
        pl: { name: 'Linguine z owocami morza', desc: 'Mieszane skorupiaki, czosnek, białe wino.' },
      } },
    { id: 'il-rosso-mare-monti', slug: 'il-rosso-mare-monti', price: 'L1100', glass: 'wine',
      i18n: {
        en: { name: 'Red Sea Mount', desc: 'Ravioli, truffle, shrimp.' },
        pl: { name: 'Red Sea Mount', desc: 'Ravioli, trufla, krewetki.' },
      } },
    { id: 'saly-pasta', slug: 'saly-pasta', price: 'L1200', glass: 'wine', house: true,
      i18n: {
        en: { name: 'Saly', desc: 'Pacheri, asparagus cream, fish. The plate the place is named for.' },
        pl: { name: 'Saly', desc: 'Pacheri, krem szparagowy, ryba. Danie, od którego wzięło się miejsce.' },
      } },
    { id: 'rizoto-fruta-deti', slug: 'rizoto-fruta-deti', price: 'L900', glass: 'wine',
      i18n: {
        en: { name: 'Seafood risotto', desc: 'Creamy rice, mixed seafood.' },
        pl: { name: 'Risotto z owocami morza', desc: 'Kremowy ryż, mieszane owoce morza.' },
      } },
    { id: 'rizoto-viole-tartar', slug: 'rizoto-viole-tartar', price: 'L1100', glass: 'wine',
      i18n: {
        en: { name: 'Violet tartar risotto', desc: 'Viola shrimp tartare, lemon.' },
        pl: { name: 'Risotto z tatarem viola', desc: 'Tatar z krewetek viola, cytryna.' },
      } },
  ],
}

const mains: MenuSection = {
  key: 'mains',
  type: 'food',
  i18n: {
    en: { label: 'Fish mains', sub: 'From the grill & oven' },
    pl: { label: 'Dania główne z ryb', sub: 'Z grilla i pieca' },
  },
  items: [
    { id: 'il-frito', slug: 'il-frito', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Fried mix', desc: 'Cuttlefish, squid, shrimp.' },
        pl: { name: 'Mix smażony', desc: 'Mątwa, kałamarnica, krewetki.' },
      } },
    { id: 'misto-griglia', slug: 'misto-griglia', price: 'L3600', glass: 'wine',
      i18n: {
        en: { name: 'Mixed grill (Misto)', desc: 'Fish, squid, cuttlefish, shrimp, octopus, salmon, vegetables.' },
        pl: { name: 'Grill mieszany (Misto)', desc: 'Ryba, kałamarnica, mątwa, krewetki, ośmiornica, łosoś, warzywa.' },
      } },
    { id: 'ton-zgare', slug: 'ton-zgare', price: 'L1600', glass: 'wine',
      i18n: {
        en: { name: 'Grilled tuna', desc: 'Seared rare, grilled vegetables.' },
        pl: { name: 'Grillowany tuńczyk', desc: 'Smażony do różowego, warzywa z grilla.' },
      } },
    { id: 'koce-levrek', slug: 'koce-levrek', price: 'L1500', glass: 'wine',
      i18n: {
        en: { name: 'Sea bream / Sea bass', desc: 'Grilled vegetables.' },
        pl: { name: 'Dorada / Okoń morski', desc: 'Warzywa z grilla.' },
      } },
    { id: 'oktapod-zgare', slug: 'oktapod-zgare', price: 'L1600', glass: 'wine',
      i18n: {
        en: { name: 'Grilled octopus, baby potatoes', desc: 'Charred, olive oil, lemon.' },
        pl: { name: 'Grillowana ośmiornica, małe ziemniaczki', desc: 'Przypalona, oliwa z oliwek, cytryna.' },
      } },
  ],
}

const freshFish: MenuSection = {
  key: 'fresh-fish',
  type: 'food',
  i18n: {
    en: { label: 'Fresh fish', sub: 'Per 100 g' },
    pl: { label: 'Świeże ryby', sub: 'Za 100 g' },
  },
  items: [
    { id: 'levrek', slug: 'levrek', price: 'L650/100g', glass: 'wine',
      i18n: { en: { name: 'Sea bass', desc: '' }, pl: { name: 'Okoń morski', desc: '' } } },
    { id: 'koce', slug: 'koce', price: 'L750/100g', glass: 'wine',
      i18n: { en: { name: 'Sea bream', desc: '' }, pl: { name: 'Dorada', desc: '' } } },
    { id: 'dental', slug: 'dental', price: 'L800/100g', glass: 'wine',
      i18n: { en: { name: 'Dentex', desc: '' }, pl: { name: 'Dętek', desc: '' } } },
    { id: 'gjuhez', slug: 'gjuhez', price: 'L450/100g', glass: 'wine',
      i18n: { en: { name: 'Sole', desc: '' }, pl: { name: 'Sola', desc: '' } } },
    { id: 'peshkatrice', slug: 'peshkatrice', price: 'L350/100g', glass: 'wine',
      i18n: { en: { name: 'Monkfish', desc: '' }, pl: { name: 'Żabnica', desc: '' } } },
    { id: 'shen-pjeter', slug: 'shen-pjeter', price: 'L450/100g', glass: 'wine',
      i18n: { en: { name: 'John Dory', desc: '' }, pl: { name: 'Świętopiotr', desc: '' } } },
    { id: 'karkalec-tiger', slug: 'karkalec-tiger', price: 'L750/100g', glass: 'wine',
      i18n: { en: { name: 'Tiger shrimp', desc: '' }, pl: { name: 'Krewetki tygrysie', desc: '' } } },
    { id: 'karkalec-viole', slug: 'karkalec-viole', price: 'L850/100g', glass: 'wine',
      i18n: { en: { name: 'Viola shrimp', desc: '' }, pl: { name: 'Krewetki viola', desc: '' } } },
    { id: 'skampi', slug: 'skampi', price: 'L850/100g', glass: 'wine',
      i18n: { en: { name: 'Norway lobster', desc: '' }, pl: { name: 'Langustynki', desc: '' } } },
    { id: 'aragosta', slug: 'aragosta', price: 'L1600/100g', glass: 'wine',
      i18n: { en: { name: 'Lobster', desc: '' }, pl: { name: 'Homar', desc: '' } } },
    { id: 'karavidhe', slug: 'karavidhe', price: 'L1600/100g', glass: 'wine',
      i18n: { en: { name: 'Blue lobster', desc: '' }, pl: { name: 'Niebieski homar', desc: '' } } },
  ],
}

export const salyMenuData: VenueMenuData = {
  sections: [salyBitter, salySour, salySweet],
  foodSections: [cold, warm, salads, pasta, mains, freshFish],
  pairings: [],
  foodPairings: [],
  featuredPick: { cocktailRef: '' },
  foodFeaturedPick: {
    itemRef: 'saly-pasta',
    showAfterSection: 'warm',
    i18n: {
      en: { label: '★ Saly recommends', desc: 'The plate the place is named for.' },
      pl: { label: '★ Saly poleca', desc: 'Danie, od którego wzięło się miejsce.' },
    },
  },
}
