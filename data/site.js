const SITE = {
  name: "Moonlight Café",
  tagline: "Coffee for the hours after dark.",
  description:
    "Moonlight Café is a neighborhood café in Northwind, Cresthaven, serving carefully brewed coffee, small plates, and something sweet — from the first pour of the morning to well after the rest of the street goes quiet.",
  fictional: true,
  address: {
    line1: "142 Lumen Street",
    line2: "Northwind District",
    city: "Cresthaven",
    region: "CA",
    postcode: "00000",
    country: "USA"
  },
  phone: "(555) 555-0147",
  phoneHref: "tel:+15555550147",
  email: "hello@moonlightcafe.example",
  wifi: {
    available: true,
    network: "Moonlight-Guest",
    password: "stayawhile",
    note: "Free for guests. Ask at the bar if it doesn't appear — the router sleeps sometimes."
  },
  outlets: {
    count: 18,
    locations: "Window bar and the mezzanine landing",
    note: "Laptops are welcome all day; we dim the lights and ask for quiet typing after 20:00."
  },
  seating: {
    total: 42,
    breakdown: [
      { area: "Window bar", seats: 16 },
      { area: "Two-tops and four-tops", seats: 14 },
      { area: "Sofa corner", seats: 6 },
      { area: "Patio (weather permitting)", seats: 6 }
    ],
    notes: [
      "Dog-friendly patio",
      "No reservations — the sofa corner is first come, first claimed"
    ]
  },
  parking: "Street parking on Lumen Street after 18:00, plus the Northwind lot one block north (free after 20:00).",
  transit: "Northwind Station, 3 minutes on foot — the night bus stops at the corner.",
  social: {
    instagram: "#",
    bluesky: "#",
    newsletter: "#"
  }
};
