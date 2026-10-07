const TAG_LABELS = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
  "contains-nuts": "Contains nuts",
  "contains-sesame": "Contains sesame",
  spicy: "Spicy",
  decaf: "Decaf available",
  signature: "House favorite"
};

const MENU_CATEGORIES = [
  {
    id: "coffee",
    name: "Coffee & Espresso",
    blurb: "Pulled, steeped, and poured until the last light downstairs goes off.",
    items: [
      {
        id: "moonlight-espresso",
        name: "Moonlight Espresso",
        description: "Our house double — chocolate-deep Brazil folded into stone-fruit Ethiopia, pulled short.",
        price: 3.5,
        tags: ["signature"]
      },
      {
        id: "honey-oat-latte",
        name: "Honey Oat Latte",
        description: "Espresso, steamed oat milk, a slow ribbon of wildflower honey.",
        price: 5.25,
        tags: ["vegetarian"]
      },
      {
        id: "lavender-night-cap",
        name: "Lavender Night Cap",
        description: "Espresso and steamed milk with house lavender syrup, finished with a dusting of sugar.",
        price: 5.5,
        tags: ["vegetarian", "signature"]
      },
      {
        id: "cardamom-cold-brew",
        name: "Cardamom Cold Brew",
        description: "Eighteen hours steeped, a whisper of green cardamom, served over ice.",
        price: 4.75,
        tags: ["vegan", "gluten-free"]
      },
      {
        id: "filter-of-the-week",
        name: "Filter of the Week",
        description: "Single-origin pour-over — ask what's on the bar tonight.",
        price: 4.5,
        tags: ["vegan", "gluten-free", "decaf"]
      }
    ]
  },
  {
    id: "not-coffee",
    name: "Tea, Cocoa & Such",
    blurb: "For the friends who came along for the company, not the caffeine.",
    items: [
      {
        id: "midnight-cocoa",
        name: "Midnight Cocoa",
        description: "Seventy-percent dark chocolate melted into steamed milk — oat milk on request.",
        price: 5.0,
        tags: ["vegetarian"]
      },
      {
        id: "chamomile-moon",
        name: "Chamomile Moon",
        description: "Whole chamomile blossoms, honey, a very slow five minutes.",
        price: 3.75,
        tags: ["vegetarian", "gluten-free"]
      },
      {
        id: "jasmine-silver-needle",
        name: "Jasmine Silver Needle",
        description: "White tea scented with jasmine, steeped gently and served in glass.",
        price: 4.25,
        tags: ["vegan", "gluten-free"]
      },
      {
        id: "turmeric-moon-milk",
        name: "Turmeric Moon Milk",
        description: "Steamed oat milk with turmeric, cinnamon, black pepper, and a spoon of honey.",
        price: 5.0,
        tags: ["vegetarian", "gluten-free"]
      },
      {
        id: "matcha-cloud",
        name: "Matcha Cloud",
        description: "Ceremonial matcha whisked with vanilla and oat milk, soft as the name suggests.",
        price: 5.5,
        tags: ["vegetarian"]
      }
    ]
  },
  {
    id: "night-bites",
    name: "Night Bites",
    blurb: "Small plates from the kitchen, served until the kitchen says goodnight.",
    items: [
      {
        id: "truffle-mushroom-toast",
        name: "Truffle Mushroom Toast",
        description: "Wild mushrooms on toasted sourdough, aged pecorino, a touch of truffle oil.",
        price: 9.5,
        tags: ["vegetarian"]
      },
      {
        id: "midnight-grilled-cheese",
        name: "Midnight Grilled Cheese",
        description: "Three cheeses pressed into sourdough, served with a shot of tomato soup.",
        price: 9.0,
        tags: ["vegetarian", "signature"]
      },
      {
        id: "chili-oil-eggs",
        name: "Chili Oil Eggs",
        description: "Soft scrambled eggs under chili crisp and chives, with grilled focaccia.",
        price: 10.5,
        tags: ["vegetarian", "spicy"]
      },
      {
        id: "roast-chicken-sandwich",
        name: "Roast Chicken Sandwich",
        description: "Herb-roasted chicken, garlic aioli, pickled onion, and rocket on ciabatta.",
        price: 12.0,
        tags: ["signature"]
      },
      {
        id: "garden-bowl",
        name: "Garden Bowl",
        description: "Roasted seasonal vegetables over farro with lemon-tahini and toasted seeds.",
        price: 11.0,
        tags: ["vegan", "contains-sesame"]
      }
    ]
  },
  {
    id: "sweet-things",
    name: "Sweet Things",
    blurb: "Baked downstairs each afternoon, out of the oven by the evening rush.",
    items: [
      {
        id: "cardamom-bun",
        name: "Cardamom Bun",
        description: "Laminated dough twisted with cardamom sugar and pearl sugar on top.",
        price: 4.5,
        tags: ["vegetarian", "signature"]
      },
      {
        id: "tahini-chocolate-cookie",
        name: "Dark Chocolate Tahini Cookie",
        description: "Crisp at the edge, molten in the middle, salted just enough.",
        price: 3.75,
        tags: ["vegan", "contains-sesame"]
      },
      {
        id: "basque-cheesecake",
        name: "Basque Cheesecake",
        description: "Burnt-top slice with a spoon of cold berry compote.",
        price: 6.5,
        tags: ["vegetarian"]
      },
      {
        id: "vegan-banana-bread",
        name: "Toasted Banana Bread",
        description: "Thick-cut, warmed through, with salted coconut spread.",
        price: 4.25,
        tags: ["vegan"]
      },
      {
        id: "lemon-polenta-cake",
        name: "Lemon Polenta Cake",
        description: "Almond-free, gluten-free, sharp with lemon and finished with icing.",
        price: 5.5,
        tags: ["vegetarian", "gluten-free"]
      }
    ]
  },
  {
    id: "cold-fizzy",
    name: "Cold & Fizzy",
    blurb: "For the nights too warm for steam.",
    items: [
      {
        id: "yuzu-sparkler",
        name: "Yuzu Sparkler",
        description: "Yuzu juice, soda, and a slap of mint over crushed ice.",
        price: 4.75,
        tags: ["vegan", "gluten-free"]
      },
      {
        id: "iced-hibiscus",
        name: "Iced Hibiscus Tea",
        description: "House-brewed hibiscus, lightly sweetened, poured over ice.",
        price: 4.0,
        tags: ["vegan", "gluten-free"]
      },
      {
        id: "espresso-tonic",
        name: "Espresso Tonic",
        description: "Espresso over tonic with an orange peel — bitter, bright, and cold.",
        price: 5.25,
        tags: ["vegan", "gluten-free", "signature"]
      },
      {
        id: "moonlight-lemonade",
        name: "Moonlight Lemonade",
        description: "Meyer lemon pressed with lavender and a little patience.",
        price: 4.25,
        tags: ["vegan", "gluten-free"]
      }
    ]
  }
];
