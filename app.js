/**
 * AURORA TRAVEL — LUXURY TRAVEL MARKETPLACE & TRIP PLANNER
 * Complete Client-Side Application Engine (Zero Server Dependencies)
 */

(function () {
  'use strict';

  /* ==========================================================================
     GLOBAL STATE & LOCALSTORAGE MANAGEMENT
     ========================================================================== */

  const STORAGE_KEYS = {
    FAVORITES: 'aurora_favorites_v1',
    BOOKINGS: 'aurora_bookings_v1',
    ITINERARIES: 'aurora_itineraries_v1',
    USER: 'aurora_user_v1',
    CURRENCY: 'aurora_currency_v1',
    STORIES: 'aurora_stories_v1'
  };

  // State
  const state = {
    activeCurrency: { code: 'USD', symbol: '$', rate: 1.0 },
    favorites: [],
    bookings: [],
    itineraries: [],
    stories: [],
    activeUser: {
      isLoggedIn: true,
      name: 'Alexander Wright',
      email: 'alexander.wright@elitevoyager.com',
      tier: 'Black Diamond Tier',
      credits: 1450,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    notifications: [
      { id: 1, title: 'Flight Suite Confirmed', text: 'Emirates A380 Suite DXB-JFK ticketed.', time: '10m ago', read: false },
      { id: 2, title: 'Complimentary Upgrade', text: 'Burj Al Arab suite upgraded to Presidential.', time: '2h ago', read: false },
      { id: 3, title: 'Privilege Invitation', text: 'Exclusive access to St. Moritz Winter Polo 2026.', time: '1d ago', read: true }
    ],
    planner: {
      currentStep: 1,
      destination: 'Dubai, UAE',
      destImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      startDate: '',
      days: 5,
      style: 'Ultra-Luxury & White-Glove',
      interests: ['Fine Dining', 'Iconic Architecture', 'Scenic Views & Photography'],
      pace: 'balanced',
      generatedItinerary: null
    },
    checkout: {
      step: 1,
      item: null, // { type, title, subtitle, image, dates, basePrice, totalPrice }
      addons: {
        transfer: true,
        insurance: false,
        carbon: false
      }
    },
    filterDestCategory: 'all',
    searchQuery: '',
    stayFilters: {
      type: 'all',
      maxPrice: 4500,
      rating: 'all',
      amenities: []
    },
    flightFilter: {
      type: 'roundtrip',
      sort: 'cheapest'
    }
  };

  /* ==========================================================================
     MOCK LUXURY DATA COLLECTIONS
     ========================================================================== */

  const DESTINATIONS_DATA = [
    {
      id: 'dest-dubai',
      city: 'Dubai',
      country: 'United Arab Emirates',
      category: 'luxury',
      startingPrice: 1850,
      rating: 4.98,
      reviewsCount: 1420,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Where ultramodern architectural marvels meet golden Arabian desert serenity.',
      description: 'Dubai is the quintessential global luxury capital. Bask in seven-star hospitality along the Arabian Gulf, explore haute couture private boutiques, and journey into dramatic sand dunes aboard luxury vintage Land Rovers for private starlight dining.',
      bestSeason: 'November – April',
      avgWeather: '26°C / 78°F (Sunny)',
      currency: 'AED (Dirham)',
      language: 'Arabic & English',
      attractions: [
        { title: 'Burj Khalifa Sky Lounge', desc: 'VIP level 148 private lounge with panoramic horizon views.', img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80' },
        { title: 'The Palm Jumeirah & Marina', desc: 'Private yacht cruises around iconic overwater architecture.', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80' },
        { title: 'Royal Desert Conservation', desc: 'Private falconry and Arabian campfire banquets under the stars.', img: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Ossiano Underwater Restaurant', michelin: '1 Michelin Star', cuisine: 'Haute Seafood', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' },
        { name: 'Tresind Studio', michelin: '2 Michelin Stars', cuisine: 'Modern Indian Gastronomy', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Dress with modest elegance when visiting heritage districts and mosques.',
        'Reserve helicopter transfers from Dubai International Airport for seamless hotel arrival.',
        'October through April offers pristine beach weather with balmy evening breezes.'
      ]
    },
    {
      id: 'dest-maldives',
      city: 'Maldives',
      country: 'Indian Ocean',
      category: 'beach',
      startingPrice: 2800,
      rating: 4.99,
      reviewsCount: 980,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Secluded overwater palaces surrounded by bioluminescent coral atolls.',
      description: 'An idyllic archipelago of thousand-year-old coral islands. Step directly from your private infinity terrace into crystalline turquoise waters, dine in subterranean glass wine cellars, and sail alongside gentle manta rays in complete seclusion.',
      bestSeason: 'December – April',
      avgWeather: '29°C / 84°F (Tropical Breeze)',
      currency: 'MVR / USD Accepted',
      language: 'Dhivehi & English',
      attractions: [
        { title: 'Baa Atoll Biosphere Reserve', desc: 'UNESCO protected sanctuary for whale sharks and manta rays.', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
        { title: 'Sub-Oceanic Coral Spa', desc: 'Glass-bottom treatment suites offering world-class holistic wellness.', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Ithaa Undersea Restaurant', michelin: 'Global Culinary Icon', cuisine: 'Fine European', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Seaplane transfers operate exclusively during daylight hours; coordinate flights accordingly.',
        'Private overwater villas facing west offer unobstructed sunsets every evening.'
      ]
    },
    {
      id: 'dest-swiss-alps',
      city: 'Swiss Alps',
      country: 'Switzerland',
      category: 'alpine',
      startingPrice: 2200,
      rating: 4.97,
      reviewsCount: 1120,
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Snow-capped pinnacles, private chalets, and historic panoramic mountain rail.',
      description: 'The pinnacle of European high-altitude tranquility. Discover ski-in/ski-out timber sanctuaries, thermal outdoor pools facing the Matterhorn, and Michelin-starred alpine gastronomy paired with rare Swiss Valais vintages.',
      bestSeason: 'December – March & July – September',
      avgWeather: 'Winter: -2°C / Summer: 21°C',
      currency: 'CHF (Swiss Franc)',
      language: 'German, French, English',
      attractions: [
        { title: 'Glacier Express VIP Excellence Class', desc: 'Panoramic rail across alpine gorges with seven-course champagne service.', img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=400&q=80' },
        { title: 'Zermatt Heli-Skiing Glaciers', desc: 'Private helicopter drops onto virgin powder with mountain guides.', img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'The Restaurant at The Chedi', michelin: '2 Michelin Stars', cuisine: 'Asian & European Fusion', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Luggage can be forwarded directly from Zurich Airport to your mountain chalet.',
        'Pack high-performance cashmere and protective alpine eyewear.'
      ]
    },
    {
      id: 'dest-paris',
      city: 'Paris',
      country: 'France',
      category: 'culture',
      startingPrice: 1950,
      rating: 4.96,
      reviewsCount: 2100,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85',
      tagline: 'The timeless capital of haute couture, palace hotels, and culinary genius.',
      description: 'Stroll along the Seine, experience after-hours private tours of the Musée d’Orsay, and retire to centuries-old palazzos in Place Vendôme. Paris remains the enduring sanctuary of art, romance, and gastronomic luxury.',
      bestSeason: 'April – June & September – November',
      avgWeather: '18°C / 64°F (Pleasant)',
      currency: 'EUR (€)',
      language: 'French & English',
      attractions: [
        { title: 'Private Louvre After-Hours Tour', desc: 'Walk through silent galleries with a master curator.', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80' },
        { title: 'Champagne Cruise on the Seine', desc: 'Bespoke wooden river cruiser with sommelier service.', img: 'https://images.unsplash.com/photo-1520939817895-060bdef4dc1b?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Plénitude by Arnaud Donckele', michelin: '3 Michelin Stars', cuisine: 'French Haute Cuisine', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Private shopping suites can be arranged at Place Vendôme high jewelry houses.',
        'Spring evenings by the Seine are best enjoyed with vintage French champagne.'
      ]
    },
    {
      id: 'dest-tokyo',
      city: 'Kyoto & Tokyo',
      country: 'Japan',
      category: 'culture',
      startingPrice: 2400,
      rating: 4.99,
      reviewsCount: 1680,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Harmonious collision of centuries-old Zen heritage and futuristic refinement.',
      description: 'From serene bamboo groves and private tea ceremonies in Kyoto’s historic Gion district to sky-high penthouses overlooking Tokyo’s illuminated skyline, experience the world’s most refined hospitality.',
      bestSeason: 'March – May & October – November',
      avgWeather: '17°C / 62°F (Mild)',
      currency: 'JPY (¥)',
      language: 'Japanese & English',
      attractions: [
        { title: 'Exclusive Kyoto Gion Ochaya Tea Ceremony', desc: 'Private audience with an authentic Geiko in an ancient wooden teahouse.', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80' },
        { title: 'Mount Fuji Private Helicopter Charter', desc: 'Dramatic aerial views followed by private ryokan onsen dining.', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Sukiyabashi Jiro Roppongi', michelin: 'World Legend', cuisine: 'Master Edomae Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Reserve counter dining at least 3 months in advance through our VIP concierge.',
        'Experience at least one night at a luxury traditional Onsen Ryokan.'
      ]
    },
    {
      id: 'dest-amalfi',
      city: 'Amalfi Coast',
      country: 'Italy',
      category: 'beach',
      startingPrice: 2100,
      rating: 4.95,
      reviewsCount: 890,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Pastel cliffside villas, fragrant lemon groves, and azure Mediterranean breezes.',
      description: 'Drift along the Tyrrhenian coast on a private Riva yacht, take in sunset cocktails overlooking Positano, and stay in converted 11th-century cliffside monasteries with infinity pools that dissolve into the sky.',
      bestSeason: 'May – October',
      avgWeather: '25°C / 77°F (Sunny Mediterranean)',
      currency: 'EUR (€)',
      language: 'Italian & English',
      attractions: [
        { title: 'Capri & Blue Grotto Private Riva Charter', desc: 'Champagne voyage through sea caves and private beach clubs.', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Quattro Passi', michelin: '3 Michelin Stars', cuisine: 'Campanian Haute Cuisine', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Helicopter transfer from Naples avoids coast road traffic.',
        'Positano sunset dinners should be booked for 8:30 PM for optimal twilight.'
      ]
    },
    {
      id: 'dest-bali',
      city: 'Bali',
      country: 'Indonesia',
      category: 'luxury',
      startingPrice: 1600,
      rating: 4.94,
      reviewsCount: 1340,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Sacred emerald jungle retreats and clifftop Indian Ocean sanctuaries.',
      description: 'Immerse in holistic spiritual rejuvenation in Ubud’s terraced jungles, followed by ultra-modern clifftop villa living in Uluwatu with private infinity pools and dedicated butler service.',
      bestSeason: 'April – October',
      avgWeather: '28°C / 82°F (Tropical)',
      currency: 'IDR / USD',
      language: 'Balinese, Indonesian, English',
      attractions: [
        { title: 'Tirta Empul Water Cleansing Ritual', desc: 'Private sunrise purification ceremony with a sacred high priest.', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Locavore NXT', michelin: 'Asia Top 50', cuisine: 'Innovative Foraged Fine Dining', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Split your stay: 3 nights in Ubud jungles, 3 nights in Uluwatu clifftop.',
        'Private helicopter charters between islands save hours of transit.'
      ]
    },
    {
      id: 'dest-cappadocia',
      city: 'Cappadocia',
      country: 'Turkey',
      category: 'culture',
      startingPrice: 1500,
      rating: 4.97,
      reviewsCount: 1040,
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Fairy-chimney valleys, sunrise hot air balloons, and historic cave palaces.',
      description: 'A magical geological wonderland. Awaken in a restored Roman cave suite, take to the sunrise skies in a private hot air balloon with vintage champagne, and explore millennia-old underground basilicas.',
      bestSeason: 'April – June & September – November',
      avgWeather: '22°C / 72°F',
      currency: 'TRY (Turkish Lira) / EUR',
      language: 'Turkish & English',
      attractions: [
        { title: 'Sunrise Private Hot Air Balloon', desc: 'Floating above fairy chimneys with private pilot and caviar breakfast.', img: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Lil’a at Museum Hotel', michelin: 'Relais & Châteaux', cuisine: 'Anatolian Royal Heritage', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Balloon flights depend on dawn wind conditions; stay at least 3 nights to guarantee a flight.',
        'The Museum Hotel’s Roman pool is heated year-round.'
      ]
    },
    {
      id: 'dest-london',
      city: 'London',
      country: 'United Kingdom',
      category: 'city',
      startingPrice: 1900,
      rating: 4.95,
      reviewsCount: 1850,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Mayfair elegance, royal heritage, West End theatre, and Michelin mastery.',
      description: 'Discover London at its most regal. Private chauffeur rides in a bespoke Bentley, bespoke tailoring on Savile Row, and evening performances from royal boxes at the Royal Opera House.',
      bestSeason: 'May – September',
      avgWeather: '20°C / 68°F (Temperate)',
      currency: 'GBP (£)',
      language: 'English',
      attractions: [
        { title: 'Tower of London Private Jewel House', desc: 'After-hours access to the Crown Jewels with the Chief Yeoman Warder.', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'The Ledbury', michelin: '3 Michelin Stars', cuisine: 'Modern British Gastronomy', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Afternoon tea at The Connaught or Claridge’s is an essential British ritual.',
        'Book the Royal Ascot VIP enclosure through Aurora Concierge in June.'
      ]
    },
    {
      id: 'dest-newyork',
      city: 'New York City',
      country: 'United States',
      category: 'city',
      startingPrice: 2150,
      rating: 4.96,
      reviewsCount: 2200,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1400&q=85',
      tagline: 'Central Park penthouses, Broadway VIP access, and legendary cultural velocity.',
      description: 'The world’s cultural epicenter. Stay in Manhattan penthouses hovering above Central Park, land by helicopter at the Wall Street heliport, and dine at three-Michelin-starred institutions.',
      bestSeason: 'September – November & April – June',
      avgWeather: '19°C / 66°F (Crisp)',
      currency: 'USD ($)',
      language: 'English',
      attractions: [
        { title: 'Broadway Private Cast Meet & Greet', desc: 'VIP house seats followed by backstage champagne with the lead cast.', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80' }
      ],
      dining: [
        { name: 'Le Bernardin', michelin: '3 Michelin Stars', cuisine: 'World Seafood Perfection', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80' }
      ],
      tips: [
        'Blade airport helicopter transfers get you from JFK to Manhattan in 5 minutes.',
        'Autumn in Central Park is unmatched for morning walks and carriage rides.'
      ]
    }
  ];

  const STAYS_DATA = [
    {
      id: 'stay-burj-al-arab',
      name: 'Burj Al Arab Jumeirah',
      location: 'Jumeirah Beach, Dubai, UAE',
      type: 'Palace',
      rating: 4.98,
      reviewsCount: 840,
      pricePerNight: 2200,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Rising on its own private island, the iconic sail of Burj Al Arab is universally recognized as the standard of global luxury. Each suite features two sprawling levels, 24-karat gold-leaf finishes, private infinity pool terraces, and a dedicated personal butler around the clock.',
      amenities: ['pool', 'spa', 'butler', 'helipad'],
      rooms: [
        { name: 'Deluxe Ocean Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Ocean View, Hermès amenities', rate: 2200 },
        { name: 'Sky Panoramic Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Floor-to-ceiling 360° Gulf view', rate: 2950 },
        { name: 'Royal Presidential Two-Bedroom', beds: '2 King Beds', guests: '4 Adults', perks: 'Private elevator, cinema, rotating bed', rate: 5800 }
      ]
    },
    {
      id: 'stay-soneva-jani',
      name: 'Soneva Jani Luxury Resort',
      location: 'Medhufaru Island, Noonu Atoll, Maldives',
      type: 'Resort',
      rating: 4.99,
      reviewsCount: 620,
      pricePerNight: 3100,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'An overwater dreamland. Vast multi-room wooden water reserves featuring water slides plunging straight into the azure lagoon, retractable roofs over the master bedroom for starlight dreaming, and private catamaran transfers.',
      amenities: ['pool', 'spa', 'butler'],
      rooms: [
        { name: 'One-Bedroom Water Reserve with Slide', beds: '1 King Bed', guests: '2 Adults', perks: 'Private lagoon slide, pool, roof opens', rate: 3100 },
        { name: 'Two-Bedroom Water Reserve with Pool', beds: '2 King Beds', guests: '4 Adults', perks: 'Private catamaran, butler, spa pavilion', rate: 5400 }
      ]
    },
    {
      id: 'stay-the-chedi',
      name: 'The Chedi Andermatt',
      location: 'Andermatt, Swiss Alps, Switzerland',
      type: 'Chalet',
      rating: 4.98,
      reviewsCount: 710,
      pricePerNight: 1950,
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Jean-Michel Gathy’s architectural masterwork seamlessly blends warm Alpine timber and stone with Asian Zen tranquility. Features a 35-meter indoor pool facing snow peaks, a 16-meter outdoor thermal bath, and a cheese humidor tower.',
      amenities: ['pool', 'spa', 'helipad'],
      rooms: [
        { name: 'Deluxe Alpine Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Fireplace, Hästens mattress, mountain terrace', rate: 1950 },
        { name: 'The Gotthard Suite', beds: '2 King Beds', guests: '5 Adults', perks: 'Private spa, kitchen, panoramic balcony', rate: 4200 }
      ]
    },
    {
      id: 'stay-ritz-paris',
      name: 'The Ritz Paris',
      location: '15 Place Vendôme, Paris, France',
      type: 'Palace',
      rating: 4.97,
      reviewsCount: 1250,
      pricePerNight: 2350,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Since 1898, the pinnacle of Parisian grandeur. Grand French neoclassical decor, the legendary Bar Hemingway, and the subterranean Chanel Spa overlooking Place Vendôme.',
      amenities: ['spa', 'butler'],
      rooms: [
        { name: 'Grand Deluxe Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Louis XVI decor, marble bath with swan taps', rate: 2350 },
        { name: 'Suite Coco Chanel', beds: '1 King Bed', guests: '2 Adults', perks: 'Original Chanel artwork, private salon', rate: 6500 }
      ]
    },
    {
      id: 'stay-aman-tokyo',
      name: 'Aman Tokyo',
      location: 'Otemachi Tower, Tokyo, Japan',
      type: 'Penthouse',
      rating: 4.99,
      reviewsCount: 580,
      pricePerNight: 2600,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'A monument to modern Japanese minimalism hovering high above the Imperial Palace Gardens. Dramatic 30-meter high washi paper lantern atrium, private black basalt onsen baths, and unobstructed views of Mount Fuji.',
      amenities: ['pool', 'spa', 'butler'],
      rooms: [
        { name: 'Premier Garden Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Furo deep soaking tub, Imperial Palace vista', rate: 2600 },
        { name: 'Aman Suite Penthouse', beds: '1 King Bed', guests: '2 Adults', perks: 'Full dining room, private wine cellar', rate: 5200 }
      ]
    },
    {
      id: 'stay-belmond-caruso',
      name: 'Belmond Hotel Caruso',
      location: 'Ravello, Amalfi Coast, Italy',
      type: 'Boutique',
      rating: 4.96,
      reviewsCount: 490,
      pricePerNight: 2400,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Set on a cliff 1,000 feet above the Mediterranean in a restored 11th-century palazzo. Famous for its infinity pool seemingly suspended in the clouds, frescoed ceilings, and private lemon grove terraces.',
      amenities: ['pool', 'spa'],
      rooms: [
        { name: 'Deluxe Sea View Junior Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Private cliffside terrace, marble bath', rate: 2400 },
        { name: 'Exclusive Suite with Garden', beds: '1 King Bed', guests: '2 Adults', perks: 'Private jacuzzi in lemon grove', rate: 4100 }
      ]
    },
    {
      id: 'stay-bulgari-bali',
      name: 'Bulgari Resort Bali',
      location: 'Uluwatu, Bali, Indonesia',
      type: 'Resort',
      rating: 4.95,
      reviewsCount: 610,
      pricePerNight: 1850,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'Combining traditional Balinese hand-carved volcanic stone architecture with Italian high-fashion sophistication. Perched 150 meters above the Indian Ocean with private funicular access to an exclusive beach.',
      amenities: ['pool', 'spa', 'butler', 'helipad'],
      rooms: [
        { name: 'Ocean Cliff Villa', beds: '1 King Bed', guests: '2 Adults', perks: 'Private plunge pool, Bang & Olufsen sound', rate: 1850 },
        { name: 'The Bulgari Five-Bedroom Mansion', beds: '5 King Beds', guests: '10 Adults', perks: 'Private cinema, two pools, chef staff', rate: 8500 }
      ]
    },
    {
      id: 'stay-museum-hotel',
      name: 'Museum Hotel Cappadocia',
      location: 'Uchisar, Cappadocia, Turkey',
      type: 'Boutique',
      rating: 4.98,
      reviewsCount: 780,
      pricePerNight: 1450,
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80',
      imagesGallery: [
        'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80'
      ],
      description: 'The only Relais & Châteaux property in Turkey. A living museum constructed into ancient Roman and Ottoman caves, filled with authentic historical artifacts, and boasting an open-air heated pool overlooking balloon launches.',
      amenities: ['pool', 'spa'],
      rooms: [
        { name: 'Imperial Cave Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Wine tap in room, antique tapestries', rate: 1450 },
        { name: 'Sultan Cave Pool Suite', beds: '1 King Bed', guests: '2 Adults', perks: 'Private indoor heated cave pool', rate: 2750 }
      ]
    }
  ];

  const FLIGHTS_DATA = [
    {
      id: 'fl-emirates-first',
      airline: 'Emirates First Class',
      logoIcon: 'fa-solid fa-crown',
      aircraft: 'Airbus A380-800 Suite',
      fromCity: 'New York',
      fromCode: 'JFK',
      toCity: 'Dubai',
      toCode: 'DXB',
      departTime: '22:20',
      arriveTime: '19:30 +1',
      duration: '12h 10m',
      stops: 'Non-stop',
      stopsCount: 0,
      baggage: '2 × 32kg + Onboard Lounge',
      price: 5400,
      cabin: 'First Class Suite',
      perks: ['Onboard Shower Spa', 'Bulgari Amenity Kits', 'Dom Pérignon 2013 on pour', 'Chauffeur Drive']
    },
    {
      id: 'fl-qatar-qsuite',
      airline: 'Qatar Airways Qsuite',
      logoIcon: 'fa-solid fa-plane-up',
      aircraft: 'Boeing 777-300ER',
      fromCity: 'London',
      fromCode: 'LHR',
      toCity: 'Doha / Dubai',
      toCode: 'DXB',
      departTime: '15:05',
      arriveTime: '01:45 +1',
      duration: '7h 40m',
      stops: 'Non-stop',
      stopsCount: 0,
      baggage: '2 × 32kg',
      price: 3200,
      cabin: 'Business Class Qsuite',
      perks: ['Private Sliding Door Suite', 'Double Bed Configuration', 'Dine on Demand', 'Al Mourjan Lounge']
    },
    {
      id: 'fl-singapore-suites',
      airline: 'Singapore Airlines',
      logoIcon: 'fa-solid fa-paper-plane',
      aircraft: 'Airbus A380 Suite',
      fromCity: 'Singapore',
      fromCode: 'SIN',
      toCity: 'Tokyo',
      toCode: 'HND',
      departTime: '08:00',
      arriveTime: '16:15',
      duration: '7h 15m',
      stops: 'Non-stop',
      stopsCount: 0,
      baggage: '50kg Allowance',
      price: 4800,
      cabin: 'First Class Suite',
      perks: ['Separate Poltrona Frau Leather Armchair & Full Bed', 'Private Suite', 'Krug Champagne']
    },
    {
      id: 'fl-swiss-first',
      airline: 'SWISS International First',
      logoIcon: 'fa-solid fa-plane',
      aircraft: 'Boeing 777-300ER',
      fromCity: 'Zurich',
      fromCode: 'ZRH',
      toCity: 'New York',
      toCode: 'JFK',
      departTime: '13:10',
      arriveTime: '16:15',
      duration: '9h 05m',
      stops: 'Non-stop',
      stopsCount: 0,
      baggage: '3 × 32kg',
      price: 4900,
      cabin: 'First Class',
      perks: ['Private Terminal Limousine Transfer', 'Zimmerli Pajamas', 'Swiss Grand Cru Wine Selection']
    },
    {
      id: 'fl-airfrance-premiere',
      airline: 'Air France La Première',
      logoIcon: 'fa-solid fa-feather',
      aircraft: 'Boeing 777-300ER',
      fromCity: 'Paris',
      fromCode: 'CDG',
      toCity: 'Dubai',
      toCode: 'DXB',
      departTime: '13:45',
      arriveTime: '23:05',
      duration: '6h 20m',
      stops: 'Non-stop',
      stopsCount: 0,
      baggage: '3 × 32kg',
      price: 5200,
      cabin: 'First Class',
      perks: ['Ducasse Haute Gastronomy', 'Private Porsche Tarmac Transfer', 'Sothys Beauty Treatment']
    },
    {
      id: 'fl-aurora-charter',
      airline: 'Aurora Private Jet Charter',
      logoIcon: 'fa-solid fa-jet-fighter-up',
      aircraft: 'Bombardier Global 7500',
      fromCity: 'London Mayfair',
      fromCode: 'FAB',
      toCity: 'Swiss Alps Engadin',
      toCode: 'SMV',
      departTime: '10:00 (Custom)',
      arriveTime: '12:30',
      duration: '1h 30m',
      stops: 'Direct Charter',
      stopsCount: 0,
      baggage: 'Unlimited Charter Cargo',
      price: 12500,
      cabin: 'Private Jet Charter',
      perks: ['Custom Departure Time', 'Private FBO No-Queue Clearance', 'Personal In-Flight Chef', 'Pet Friendly']
    }
  ];

  const EXPERIENCES_DATA = [
    {
      id: 'exp-dubai-heli',
      title: 'Dubai Skyline & Desert Private Helicopter Tour',
      location: 'Dubai, UAE',
      category: 'luxury',
      duration: '45 Minutes Flight',
      rating: 4.99,
      reviewsCount: 310,
      price: 750,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      description: 'Lift off from the Burj Al Arab helipad aboard a private AgustaWestland 109. Swoop over the World Islands, Burj Khalifa peak, and vast desert dunes with vintage Dom Pérignon waiting upon landing.'
    },
    {
      id: 'exp-cappadocia-balloon',
      title: 'Cappadocia Sunrise VIP Hot Air Balloon Flight',
      location: 'Uchisar, Cappadocia',
      category: 'adventure',
      duration: '3.5 Hours Total',
      rating: 5.0,
      reviewsCount: 420,
      price: 680,
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=600&q=80',
      description: 'Soar silently with private pilot and crew as the morning sun casts gold over ancient fairy-chimney canyons. Concludes with a silver-service champagne breakfast on the volcanic plateau.'
    },
    {
      id: 'exp-maldives-manta',
      title: 'Baa Atoll Private Marine Biologist & Manta Ray Safari',
      location: 'Baa Atoll, Maldives',
      category: 'adventure',
      duration: 'Half Day (4 Hours)',
      rating: 4.98,
      reviewsCount: 260,
      price: 950,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      description: 'Step aboard a custom 50ft luxury catamaran with a resident National Geographic-accredited marine biologist. Snorkel alongside feeding aggregations of majestic manta rays and whale sharks.'
    },
    {
      id: 'exp-kyoto-tea',
      title: 'Kyoto Imperial Geisha & Exclusive Ochaya Banqueting',
      location: 'Gion, Kyoto, Japan',
      category: 'culture',
      duration: 'Evening (4 Hours)',
      rating: 4.99,
      reviewsCount: 195,
      price: 1800,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      description: 'An exceedingly rare private invitation into a 300-year-old wooden teahouse inaccessible to the public. Enjoy a multi-course Kaiseki feast accompanied by live shamisen music and traditional dance.'
    },
    {
      id: 'exp-swiss-glacier',
      title: 'Glacier Express Excellence Class Panoramic Rail & Dining',
      location: 'Zermatt to St. Moritz, Switzerland',
      category: 'luxury',
      duration: 'Full Day (8 Hours)',
      rating: 4.97,
      reviewsCount: 380,
      price: 890,
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
      description: 'The world’s most luxurious rail car with guaranteed window seats, dedicated concierge, seven-course wine-paired menu, and unobstructed views of snow-capped alpine gorges.'
    },
    {
      id: 'exp-amalfi-riva',
      title: 'Private Riva Aquarama Charter: Capri & Faraglioni Rocks',
      location: 'Amalfi Coast, Italy',
      category: 'luxury',
      duration: 'Full Day (7 Hours)',
      rating: 4.99,
      reviewsCount: 290,
      price: 2400,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
      description: 'Glide across the crystalline Tyrrhenian Sea in a legendary mahogany Riva yacht. Swim in hidden grottoes, dock at Capri for lunch at La Fontelina, and sip prosecco as the sun sets.'
    }
  ];

  const PACKAGES_DATA = [
    {
      id: 'pkg-swiss-escape',
      title: 'Swiss Alpine Winter & Thermal Haven',
      dest: 'Swiss Alps (Andermatt & Zermatt)',
      durationDays: 7,
      durationNights: 6,
      hotelName: 'The Chedi Andermatt & Mont Cervin Palace',
      inclusions: ['Private Heli-Skiing', 'Glacier Express Excellence Class', 'Chauffeur Rolls-Royce', 'Michelin Dining'],
      rating: 4.99,
      price: 9800,
      image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80',
      description: 'Choreographed seven-day immersion across the finest peaks of Switzerland. Private ski instructors, thermal spa sanctuaries, and sommelier-led alpine fondues.'
    },
    {
      id: 'pkg-dubai-splendor',
      title: 'Dubai Imperial Splendor & Desert Haven',
      dest: 'Dubai & Al Maha Desert, UAE',
      durationDays: 5,
      durationNights: 4,
      hotelName: 'Burj Al Arab Jumeirah & Al Maha Resort',
      inclusions: ['Helicopter Airport Transfer', 'Private Yacht Marina Cruise', 'Falconry Banquet', 'Personal Concierge'],
      rating: 4.98,
      price: 6830,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'The ultimate Middle Eastern luxury escape. Five nights divided between a two-story ocean suite at Burj Al Arab and a private pool villa in the pristine desert dunes.'
    },
    {
      id: 'pkg-maldives-atoll',
      title: 'Maldives Private Island Romance & Coral Haven',
      dest: 'Noonu Atoll, Maldives',
      durationDays: 6,
      durationNights: 5,
      hotelName: 'Soneva Jani Water Reserve',
      inclusions: ['Private Seaplane Flight', 'Undersea Dining Experience', 'Couples Spa Pavilion', 'Catamaran Snorkel'],
      rating: 5.0,
      price: 11400,
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      description: 'An unrepeatable honeymoon and romantic sanctuary. Private infinity slide overwater villa, custom fireworks over the lagoon, and starlight astronomy dinners.'
    },
    {
      id: 'pkg-kyoto-heritage',
      title: 'Japanese Heritage & Cyber Modernity',
      dest: 'Tokyo & Kyoto, Japan',
      durationDays: 10,
      durationNights: 9,
      hotelName: 'Aman Tokyo & Hoshinoya Kyoto',
      inclusions: ['Bullet Train First Class Gran Class', 'Private Geisha Dinner', 'Master Sushi Counter', 'Curated Art Guide'],
      rating: 4.99,
      price: 13200,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Ten days tracing ancient shrines, hidden Michelin counters, serene cedar onsen baths, and Tokyo’s towering high-tech architecture.'
    },
    {
      id: 'pkg-amalfi-riviera',
      title: 'Amalfi Coast Riviera Dream & Capri Cruise',
      dest: 'Positano, Ravello & Capri, Italy',
      durationDays: 7,
      durationNights: 6,
      hotelName: 'Belmond Hotel Caruso & Le Sirenuse',
      inclusions: ['Private Riva Yacht Day', 'Michelin Cliffside Dinners', 'Helicopter Transfer', 'Private Wine Tasting'],
      rating: 4.97,
      price: 10500,
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      description: 'Seven days of Mediterranean bliss. Experience the glamorous vintage rhythm of Positano and Ravello with private yacht charters to the Faraglioni rocks.'
    },
    {
      id: 'pkg-cappadocia-istanbul',
      title: 'Byzantine & Ottoman Imperial Odyssey',
      dest: 'Istanbul & Cappadocia, Turkey',
      durationDays: 8,
      durationNights: 7,
      hotelName: 'Four Seasons Bosphorus & Museum Hotel',
      inclusions: ['Bosphorus Private Yacht', 'VIP Sunrise Balloon', 'Hagia Sophia Private Night Access', 'Turkish Bath Ritual'],
      rating: 4.98,
      price: 7900,
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80',
      description: 'A rich historical tapestry bridging Europe and Asia. Palatial waterfront suites on the Bosphorus strait paired with fairy-tale cave sanctuaries.'
    }
  ];

  const DEALS_DATA = [
    {
      id: 'deal-1',
      title: 'Swiss Alps Winter Early Privilege',
      target: 'The Chedi Andermatt',
      perk: 'Complimentary private helicopter airport transfer from Zurich + $500 Spa Credit.',
      badge: 'SAVE 25%',
      priceFrom: 1650,
      img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'deal-2',
      title: 'Dubai Ocean Suite Autumn Retreat',
      target: 'Burj Al Arab Jumeirah',
      perk: 'Complimentary Rolls-Royce airport chauffeur & champagne dinner at Al Mahara.',
      badge: 'VIP PERK',
      priceFrom: 1850,
      img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'deal-3',
      title: 'Maldives Overwater Sanctuary Upgrade',
      target: 'Soneva Jani Water Reserve',
      perk: 'Guaranteed upgrade to Water Reserve with Slide + Free Bioluminescent Night Catamaran.',
      badge: 'FREE UPGRADE',
      priceFrom: 2750,
      img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=500&q=80'
    }
  ];

  const COMMUNITY_STORIES = [
    {
      id: 'story-1',
      author: 'Sophia Kensington',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      location: 'Swiss Alps, Switzerland',
      photo: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80',
      quote: '“Boarding the private helicopter right outside The Chedi and skiing down unblemished powder on the glacier was the single most exhilarating morning of my life.”',
      likes: 142
    },
    {
      id: 'story-2',
      author: 'Lord Julian Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      location: 'Dubai, UAE',
      photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      quote: '“The private desert sunset camp curated by Aurora exceeded all expectations. Live oud melodies, falconry, and seven courses under crystal clear constellations.”',
      likes: 98
    },
    {
      id: 'story-3',
      author: 'Dr. Camille Laurent',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      location: 'Kyoto, Japan',
      photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      quote: '“Entering the ancient Ochaya tea house in Gion felt like stepping two centuries into the past. Flawless hospitality arranged seamlessly.”',
      likes: 215
    },
    {
      id: 'story-4',
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      location: 'Maldives',
      photo: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80',
      quote: '“Sliding directly from our master bedroom into the warm turquoise atoll before breakfast has completely ruined every normal hotel for me forever.”',
      likes: 310
    }
  ];

  const REVIEWS_DATA = [
    {
      name: 'Victoria & Arthur Montgomery',
      tier: 'Private Family Office Clients',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: '“Aurora Travel operates with the precision of a Swiss horologist and the discreet luxury of a Mayfair private bank. Every transfer, villa check-in, and dining table was effortless.”'
    },
    {
      name: 'Henrik Lindqvist',
      tier: 'Tech Founder & Voyager',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      text: '“The 5-Step AI trip planner generated a 10-day Kyoto & Tokyo itinerary that our Tokyo friends admitted was superior to anything they could have mapped out. Unbelievable platform.”'
    },
    {
      name: 'Princess Beatrice Al-Sabah',
      tier: 'Black Diamond Member',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      text: '“Having a dedicated 24/7 VIP concierge ready on WhatsApp gave us complete peace of mind while chartering yachts around Capri and Positano. 10/10 standard.”'
    }
  ];

  const MAP_PINS_DATA = [
    { id: 'pin-1', top: '38%', left: '58%', type: 'stay', title: 'Burj Al Arab Jumeirah', category: 'Luxury Stay', price: '$2,200/night', desc: 'World famous sail-shaped palace island in Dubai.', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-2', top: '48%', left: '62%', type: 'stay', title: 'Soneva Jani Reserve', category: 'Luxury Stay', price: '$3,100/night', desc: 'Overwater slides and bioluminescent atolls in Maldives.', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-3', top: '24%', left: '49%', type: 'stay', title: 'The Chedi Andermatt', category: 'Luxury Stay', price: '$1,950/night', desc: 'Jean-Michel Gathy alpine sanctuary in Switzerland.', img: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-4', top: '22%', left: '47%', type: 'landmark', title: 'The Eiffel Tower & Louvre', category: 'Iconic Landmark', price: 'VIP Access', desc: 'Private curator night tours in the heart of Paris.', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-5', top: '28%', left: '82%', type: 'dining', title: 'Sukiyabashi Jiro & Ginza', category: 'Michelin Dining', price: '3-Star Legend', desc: 'The historic summit of Edomae sushi in Tokyo.', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-6', top: '56%', left: '76%', type: 'stay', title: 'Bulgari Clifftop Resort', category: 'Luxury Stay', price: '$1,850/night', desc: 'Dramatic ocean cliff villas in Uluwatu, Bali.', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-7', top: '29%', left: '54%', type: 'landmark', title: 'Cappadocia Balloon Basin', category: 'Iconic Landmark', price: 'VIP Sunrise', desc: 'Volcanic fairy chimney valleys in Turkey.', img: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=400&q=80' },
    { id: 'pin-8', top: '20%', left: '46%', type: 'aviation', title: 'Farnborough VIP Aviation Hub', category: 'Private Aviation', price: 'Charter Hub', desc: 'Dedicated private jet terminal for London Mayfair clients.', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80' }
  ];

  /* ==========================================================================
     INIT & LOCAL STORAGE RECOVERY
     ========================================================================== */

  function initApp() {
    loadStoredState();
    setupNavbar();
    setupCurrencyConverter();
    setupHeroInteractions();
    setupSearchPanel();
    renderDestinations();
    renderStays();
    renderFlights();
    renderExperiences();
    renderPackages();
    setupTripPlanner();
    setupInteractiveMap();
    setupMagazine();
    renderDeals();
    setupDealsTimer();
    renderCommunityStories();
    renderReviews();
    setupDashboard();
    setupCheckoutFlow();
    setupAuthModal();
    setupModalsGlobal();
    updateFavoritesBadges();
    renderNotifications();
    showToast('Welcome to Aurora Travel', 'Your private concierge status is active.', 'info');
  }

  function loadStoredState() {
    try {
      const favs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (favs) state.favorites = JSON.parse(favs);

      const bks = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (bks) {
        state.bookings = JSON.parse(bks);
      } else {
        // Initial sample booking for testing
        state.bookings = [
          {
            id: 'AUR-9821-DXB',
            type: 'package',
            title: 'Dubai Imperial Splendor & Desert Haven',
            dates: 'Oct 12 – Oct 17, 2026',
            guests: 2,
            price: 6830,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80'
          },
          {
            id: 'AUR-4412-ZRH',
            type: 'stay',
            title: 'The Chedi Andermatt (Alpine Suite)',
            dates: 'Jan 15 – Jan 20, 2026',
            guests: 2,
            price: 9750,
            status: 'completed',
            image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=400&q=80'
          }
        ];
        saveBookings();
      }

      const itin = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
      if (itin) state.itineraries = JSON.parse(itin);

      const curr = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (curr) state.activeCurrency = JSON.parse(curr);

      const usr = localStorage.getItem(STORAGE_KEYS.USER);
      if (usr) state.activeUser = JSON.parse(usr);

      state.stories = [...COMMUNITY_STORIES];
    } catch (e) {
      console.warn('LocalStorage access note:', e);
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    updateFavoritesBadges();
  }

  function saveBookings() {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(state.bookings));
    renderDashboardBookings();
  }

  function saveItineraries() {
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(state.itineraries));
    renderDashboardItineraries();
  }

  /* ==========================================================================
     CURRENCY FORMATTER ENGINE
     ========================================================================== */

  function formatPrice(amountUsd) {
    const converted = amountUsd * state.activeCurrency.rate;
    if (state.activeCurrency.code === 'JPY') {
      return state.activeCurrency.symbol + Math.round(converted).toLocaleString();
    }
    return state.activeCurrency.symbol + Math.round(converted).toLocaleString();
  }

  function setupCurrencyConverter() {
    const btn = document.getElementById('currencyBtn');
    const menu = document.getElementById('currencyMenu');
    const codeLabel = document.getElementById('activeCurrencyCode');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });

    menu.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        const code = item.dataset.currency;
        const symbol = item.dataset.symbol;
        const rate = parseFloat(item.dataset.rate);

        state.activeCurrency = { code, symbol, rate };
        localStorage.setItem(STORAGE_KEYS.CURRENCY, JSON.stringify(state.activeCurrency));

        if (codeLabel) codeLabel.textContent = code;
        menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        menu.classList.remove('show');

        // Re-render all price-bearing components
        renderDestinations();
        renderStays();
        renderFlights();
        renderExperiences();
        renderPackages();
        renderDeals();
        renderDashboardOverview();

        showToast('Currency Converted', `All platform rates updated to ${code} (${symbol})`, 'info');
      });
    });

    // Set initial display
    if (codeLabel) codeLabel.textContent = state.activeCurrency.code;
  }

  /* ==========================================================================
     STICKY NAVBAR & MOBILE DRAWER
     ========================================================================== */

  function setupNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    if (hamburgerBtn && mobileDrawer) {
      hamburgerBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
      });
    }

    if (closeDrawerBtn && mobileDrawer) {
      closeDrawerBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      });
    });

    // Favorites click opens dashboard wishlist tab
    const favBtn = document.getElementById('openFavoritesBtn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        location.href = '#dashboard';
        switchDashboardTab('favorites');
      });
    }

    // Notifications Dropdown
    const notifBtn = document.getElementById('openNotificationsBtn');
    const notifMenu = document.getElementById('notificationsDropdown');
    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifMenu.classList.toggle('show');
      });
      document.addEventListener('click', () => {
        notifMenu.classList.remove('show');
      });
    }

    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => {
        state.notifications.forEach(n => n.read = true);
        renderNotifications();
        showToast('Notifications Updated', 'All items marked as read.', 'info');
      });
    }
  }

  function renderNotifications() {
    const list = document.getElementById('notifList');
    const countBadge = document.getElementById('notificationsCount');
    if (!list) return;

    const unreadCount = state.notifications.filter(n => !n.read).length;
    if (countBadge) countBadge.textContent = unreadCount;

    list.innerHTML = state.notifications.map(n => `
      <li class="notif-item ${n.read ? 'read' : 'unread'}">
        <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
        <div class="notif-content">
          <strong>${n.title}</strong>
          <p>${n.text}</p>
          <span class="notif-time">${n.time}</span>
        </div>
      </li>
    `).join('');
  }

  function updateFavoritesBadges() {
    const badge = document.getElementById('favoritesCount');
    const dashBadge = document.getElementById('dashFavCountBadge');
    const statBadge = document.getElementById('statSavedCount');
    const count = state.favorites.length;
    if (badge) badge.textContent = count;
    if (dashBadge) dashBadge.textContent = count;
    if (statBadge) statBadge.textContent = count;
  }

  function toggleFavorite(itemId, itemType, itemTitle) {
    const index = state.favorites.indexOf(itemId);
    if (index > -1) {
      state.favorites.splice(index, 1);
      showToast('Removed from Wishlist', `${itemTitle} removed from saved places.`, 'info');
    } else {
      state.favorites.push(itemId);
      showToast('Saved to Wishlist', `${itemTitle} added to your private collection.`, 'info');
    }
    saveFavorites();
    renderStays();
    renderDestinations();
    renderDashboardFavorites();
  }

  /* ==========================================================================
     CINEMATIC HERO INTERACTIONS
     ========================================================================== */

  function setupHeroInteractions() {
    const playBtn = document.getElementById('heroPlayVideoBtn');
    const videoModal = document.getElementById('videoModalBackdrop');
    const closeVideoBtn = document.getElementById('closeVideoModalBtn');
    const havenCard = document.getElementById('heroHavenCard');

    if (playBtn && videoModal) {
      playBtn.addEventListener('click', () => {
        videoModal.classList.add('open');
      });
    }

    if (closeVideoBtn && videoModal) {
      closeVideoBtn.addEventListener('click', () => {
        videoModal.classList.remove('open');
      });
    }

    if (havenCard) {
      havenCard.addEventListener('click', () => {
        openStayModal('stay-the-chedi');
      });
    }
  }

  /* ==========================================================================
     SMART SEARCH PANEL
     ========================================================================== */

  function setupSearchPanel() {
    const tabs = document.querySelectorAll('.search-tab');
    const destInput = document.getElementById('searchDestinationInput');
    const popover = document.getElementById('destSuggestionsPopover');
    const clearBtn = document.getElementById('clearSearchDestBtn');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const mode = tab.dataset.tab;
        updateSearchPlaceholders(mode);
      });
    });

    if (destInput && popover) {
      destInput.addEventListener('focus', () => popover.classList.add('open'));
      document.addEventListener('click', (e) => {
        if (!destInput.contains(e.target) && !popover.contains(e.target)) {
          popover.classList.remove('open');
        }
      });

      popover.querySelectorAll('.sugg-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          destInput.value = chip.dataset.val;
          popover.classList.remove('open');
        });
      });
    }

    if (clearBtn && destInput) {
      clearBtn.addEventListener('click', () => {
        destInput.value = '';
        destInput.focus();
      });
    }

    // Set default dates
    const checkin = document.getElementById('searchCheckinDate');
    const checkout = document.getElementById('searchCheckoutDate');
    const today = new Date();
    const inDate = new Date(today.getTime() + 14 * 86400000);
    const outDate = new Date(today.getTime() + 19 * 86400000);

    if (checkin) checkin.value = inDate.toISOString().split('T')[0];
    if (checkout) checkout.value = outDate.toISOString().split('T')[0];
  }

  function updateSearchPlaceholders(mode) {
    const destInput = document.getElementById('searchDestinationInput');
    if (!destInput) return;

    if (mode === 'flights') {
      destInput.placeholder = 'Departure city or international hub airport...';
    } else if (mode === 'stays') {
      destInput.placeholder = 'Where is your heart yearning to go?';
    } else if (mode === 'tours' || mode === 'activities') {
      destInput.placeholder = 'Destination for private excursions & yachting...';
    } else if (mode === 'packages') {
      destInput.placeholder = 'Dream region for signature all-inclusive journeys...';
    }
  }

  function handleMainSearch() {
    const destInput = document.getElementById('searchDestinationInput');
    const query = (destInput ? destInput.value.trim() : '').toLowerCase();
    const activeTab = document.querySelector('.search-tab.active')?.dataset.tab || 'stays';

    if (activeTab === 'flights') {
      location.href = '#flights';
      const fDest = document.getElementById('flightDestInput');
      if (fDest && query) fDest.value = query.toUpperCase();
      filterFlights();
    } else if (activeTab === 'stays') {
      location.href = '#stays';
      filterStaysByQuery(query);
    } else if (activeTab === 'packages') {
      location.href = '#packages';
    } else {
      location.href = '#destinations';
      const filterInput = document.getElementById('destFilterInput');
      if (filterInput) {
        filterInput.value = query;
        renderDestinations();
      }
    }
    showToast('Search Applied', `Showing results for "${query || 'Global Curations'}"`, 'info');
  }

  /* ==========================================================================
     DESTINATION DISCOVERY & EXPLORER
     ========================================================================== */

  function renderDestinations() {
    const container = document.getElementById('destinationsContainer');
    const countNumber = document.getElementById('destCountNumber');
    const filterInput = document.getElementById('destFilterInput');
    const sortSelect = document.getElementById('destSortSelect');

    if (!container) return;

    let items = [...DESTINATIONS_DATA];
    const category = state.filterDestCategory;
    const query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    const sortBy = sortSelect ? sortSelect.value : 'recommended';

    // Category filter
    if (category !== 'all') {
      items = items.filter(d => d.category === category);
    }

    // Text query filter
    if (query) {
      items = items.filter(d =>
        d.city.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.tagline.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      items.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      items.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    if (countNumber) countNumber.textContent = items.length;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box text-center" style="grid-column: 1 / -1; padding: 60px 20px;">
          <i class="fa-solid fa-compass" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 16px;"></i>
          <h3>No Havens Match Your Search</h3>
          <p class="text-secondary">Try adjusting your filters or search keywords.</p>
          <button class="btn btn-gold-sm mt-3" onclick="window.AuroraApp.resetDestFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(d => {
      const isFav = state.favorites.includes(d.id);
      return `
        <div class="destination-card" onclick="window.AuroraApp.openDestModal('${d.id}')">
          <div class="dest-card-bg" style="background-image: url('${d.image}');"></div>
          <div class="dest-card-overlay"></div>
          
          <div class="dest-card-top">
            <span class="dest-rating-pill">
              <i class="fa-solid fa-star"></i> ${d.rating}
            </span>
            <button class="dest-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.AuroraApp.toggleFavorite('${d.id}', 'destination', '${d.city}')" aria-label="Save ${d.city}">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
          </div>

          <div class="dest-card-content">
            <span class="dest-country-tag">${d.country}</span>
            <h3 class="dest-city-title">${d.city}</h3>
            <p class="dest-card-desc">${d.tagline}</p>
            <div class="dest-card-footer">
              <div class="dest-price-group">
                <span class="dest-from">Journeys From</span>
                <span class="dest-price">${formatPrice(d.startingPrice)}</span>
              </div>
              <span class="btn-dest-explore">
                <span>Explore Haven</span>
                <i class="fa-solid fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    setupDestControls();
  }

  function setupDestControls() {
    const chips = document.querySelectorAll('#destCategoryChips .filter-chip');
    chips.forEach(chip => {
      chip.onclick = () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.filterDestCategory = chip.dataset.category;
        renderDestinations();
      };
    });

    const filterInput = document.getElementById('destFilterInput');
    if (filterInput && !filterInput.dataset.bound) {
      filterInput.dataset.bound = 'true';
      filterInput.addEventListener('input', debounce(renderDestinations, 250));
    }

    const sortSelect = document.getElementById('destSortSelect');
    if (sortSelect && !sortSelect.dataset.bound) {
      sortSelect.dataset.bound = 'true';
      sortSelect.addEventListener('change', renderDestinations);
    }
  }

  function resetDestFilters() {
    state.filterDestCategory = 'all';
    const filterInput = document.getElementById('destFilterInput');
    if (filterInput) filterInput.value = '';
    const chips = document.querySelectorAll('#destCategoryChips .filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    if (chips[0]) chips[0].classList.add('active');
    renderDestinations();
  }

  function openDestModal(destId) {
    const dest = DESTINATIONS_DATA.find(d => d.id === destId);
    if (!dest) return;

    const modal = document.getElementById('destModalBackdrop');
    const hero = document.getElementById('destModalHero');
    const country = document.getElementById('destModalCountry');
    const title = document.getElementById('destModalTitle');
    const tagline = document.getElementById('destModalTagline');
    const desc = document.getElementById('destModalDesc');
    const season = document.getElementById('destModalSeason');
    const weather = document.getElementById('destModalWeather');
    const curr = document.getElementById('destModalCurr');
    const lang = document.getElementById('destModalLang');
    const planBtn = document.getElementById('destModalPlanTripBtn');
    const attrList = document.getElementById('destModalAttractionsList');
    const diningList = document.getElementById('destModalDiningList');
    const tipsBox = document.getElementById('destModalTipsBox');

    if (hero) hero.style.backgroundImage = `url('${dest.heroImage}')`;
    if (country) country.textContent = dest.country.toUpperCase();
    if (title) title.textContent = dest.city;
    if (tagline) tagline.textContent = dest.tagline;
    if (desc) desc.textContent = dest.description;
    if (season) season.textContent = dest.bestSeason;
    if (weather) weather.textContent = dest.avgWeather;
    if (curr) curr.textContent = dest.currency;
    if (lang) lang.textContent = dest.language;

    if (attrList) {
      attrList.innerHTML = dest.attractions.map(a => `
        <div class="dest-attraction-card">
          <img src="${a.img}" alt="${a.title}">
          <div class="attract-info">
            <h5>${a.title}</h5>
            <p>${a.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (diningList) {
      diningList.innerHTML = dest.dining.map(di => `
        <div class="dest-attraction-card">
          <img src="${di.img}" alt="${di.name}">
          <div class="attract-info">
            <span class="text-gold" style="font-size:0.75rem; font-weight:700;">${di.michelin}</span>
            <h5>${di.name}</h5>
            <p>${di.cuisine}</p>
          </div>
        </div>
      `).join('');
    }

    if (tipsBox) {
      tipsBox.innerHTML = `
        <ul style="list-style:none; display:flex; flex-direction:column; gap:12px;">
          ${dest.tips.map(t => `<li style="display:flex; gap:10px;"><i class="fa-solid fa-check text-gold"></i> <span>${t}</span></li>`).join('')}
        </ul>
      `;
    }

    if (planBtn) {
      planBtn.onclick = () => {
        modal.classList.remove('open');
        location.href = '#planner';
        loadDestIntoPlanner(dest.city + ', ' + dest.country, dest.heroImage);
      };
    }

    setupDestModalTabs();
    if (modal) modal.classList.add('open');
  }

  function setupDestModalTabs() {
    const tabs = document.querySelectorAll('.dest-tab');
    const panes = document.querySelectorAll('.dest-tab-content');

    tabs.forEach(tab => {
      tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = 'dtabPane' + capitalizeFirst(tab.dataset.dtab);
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      };
    });
  }

  /* ==========================================================================
     LUXURY STAYS SECTION
     ========================================================================== */

  function renderStays() {
    const container = document.getElementById('staysContainer');
    if (!container) return;

    let items = [...STAYS_DATA];
    const { type, maxPrice, rating, amenities } = state.stayFilters;

    if (type !== 'all') {
      items = items.filter(s => s.type === type);
    }

    items = items.filter(s => s.pricePerNight <= maxPrice);

    if (rating !== 'all') {
      const minR = parseFloat(rating);
      items = items.filter(s => s.rating >= minR);
    }

    if (amenities.length > 0) {
      items = items.filter(s => amenities.every(a => s.amenities.includes(a)));
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box text-center" style="grid-column: 1 / -1; padding: 60px 20px;">
          <i class="fa-solid fa-hotel" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 16px;"></i>
          <h3>No Sanctuaries Match Your Criteria</h3>
          <p class="text-secondary">Try widening your price range or amenity filters.</p>
          <button class="btn btn-gold-sm mt-3" onclick="window.AuroraApp.resetStayFilters()">Reset Stays Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(s => {
      const isFav = state.favorites.includes(s.id);
      return `
        <div class="stay-card" onclick="window.AuroraApp.openStayModal('${s.id}')">
          <div class="stay-media">
            <img src="${s.image}" alt="${s.name}" class="stay-img">
            <span class="stay-badge-tag">${s.type.toUpperCase()}</span>
            <button class="stay-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.AuroraApp.toggleFavorite('${s.id}', 'stay', '${s.name}')" aria-label="Save ${s.name}">
              <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
          </div>

          <div class="stay-details-body">
            <div class="stay-loc-row">
              <i class="fa-solid fa-location-dot"></i>
              <span>${s.location}</span>
            </div>
            <h3 class="stay-title">${s.name}</h3>

            <div class="stay-rating-row">
              <span class="rating-badge"><i class="fa-solid fa-star"></i> ${s.rating}</span>
              <span class="reviews-count">(${s.reviewsCount} reviews)</span>
            </div>

            <div class="amenities-icons-row">
              ${s.amenities.includes('pool') ? '<span class="amenity-icon-item"><i class="fa-solid fa-water-ladder"></i> Pool</span>' : ''}
              ${s.amenities.includes('spa') ? '<span class="amenity-icon-item"><i class="fa-solid fa-spa"></i> Spa</span>' : ''}
              ${s.amenities.includes('butler') ? '<span class="amenity-icon-item"><i class="fa-solid fa-bell-concierge"></i> Butler</span>' : ''}
              ${s.amenities.includes('helipad') ? '<span class="amenity-icon-item"><i class="fa-solid fa-helicopter"></i> Helipad</span>' : ''}
            </div>

            <div class="stay-price-row">
              <div class="stay-price-meta">
                <span class="stay-rate-label">Starting from</span>
                <div>
                  <strong class="stay-price-amount">${formatPrice(s.pricePerNight)}</strong>
                  <span class="stay-price-period">/ night</span>
                </div>
              </div>
              <button class="btn btn-gold-sm" onclick="event.stopPropagation(); window.AuroraApp.openStayModal('${s.id}')">
                <span>Reserve</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    setupStayFilterHandlers();
  }

  function setupStayFilterHandlers() {
    const slider = document.getElementById('stayPriceSlider');
    const priceDisplay = document.getElementById('stayPriceDisplay');
    const typeSelect = document.getElementById('stayTypeFilter');
    const ratingSelect = document.getElementById('stayRatingFilter');
    const resetBtn = document.getElementById('resetStayFiltersBtn');

    if (slider && !slider.dataset.bound) {
      slider.dataset.bound = 'true';
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        state.stayFilters.maxPrice = val;
        if (priceDisplay) priceDisplay.textContent = formatPrice(val);
        renderStays();
      });
    }

    if (typeSelect && !typeSelect.dataset.bound) {
      typeSelect.dataset.bound = 'true';
      typeSelect.addEventListener('change', (e) => {
        state.stayFilters.type = e.target.value;
        renderStays();
      });
    }

    if (ratingSelect && !ratingSelect.dataset.bound) {
      ratingSelect.dataset.bound = 'true';
      ratingSelect.addEventListener('change', (e) => {
        state.stayFilters.rating = e.target.value;
        renderStays();
      });
    }

    const amenityPool = document.getElementById('amenityPool');
    const amenitySpa = document.getElementById('amenitySpa');
    const amenityButler = document.getElementById('amenityButler');
    const amenityHelipad = document.getElementById('amenityHelipad');

    [amenityPool, amenitySpa, amenityButler, amenityHelipad].forEach(box => {
      if (box && !box.dataset.bound) {
        box.dataset.bound = 'true';
        box.addEventListener('change', () => {
          const selected = [];
          if (amenityPool?.checked) selected.push('pool');
          if (amenitySpa?.checked) selected.push('spa');
          if (amenityButler?.checked) selected.push('butler');
          if (amenityHelipad?.checked) selected.push('helipad');
          state.stayFilters.amenities = selected;
          renderStays();
        });
      }
    });

    if (resetBtn && !resetBtn.dataset.bound) {
      resetBtn.dataset.bound = 'true';
      resetBtn.addEventListener('click', resetStayFilters);
    }
  }

  function resetStayFilters() {
    state.stayFilters = {
      type: 'all',
      maxPrice: 4500,
      rating: 'all',
      amenities: []
    };

    const slider = document.getElementById('stayPriceSlider');
    const priceDisplay = document.getElementById('stayPriceDisplay');
    const typeSelect = document.getElementById('stayTypeFilter');
    const ratingSelect = document.getElementById('stayRatingFilter');

    if (slider) slider.value = 4500;
    if (priceDisplay) priceDisplay.textContent = formatPrice(4500);
    if (typeSelect) typeSelect.value = 'all';
    if (ratingSelect) ratingSelect.value = 'all';

    document.querySelectorAll('.amenity-check input').forEach(c => c.checked = false);
    renderStays();
  }

  function filterStaysByQuery(query) {
    if (!query) {
      resetStayFilters();
      return;
    }
    const container = document.getElementById('staysContainer');
    if (!container) return;

    const filtered = STAYS_DATA.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query) ||
      s.type.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      state.stayFilters.type = 'all';
      renderStays();
    }
  }

  // Hotel Details Modal
  let activeModalStay = null;
  let activeSelectedRoom = null;

  function openStayModal(stayId) {
    const stay = STAYS_DATA.find(s => s.id === stayId);
    if (!stay) return;

    activeModalStay = stay;
    activeSelectedRoom = stay.rooms[0];

    const modal = document.getElementById('stayModalBackdrop');
    const mainImg = document.getElementById('stayModalMainImg');
    const ratingBadge = document.getElementById('stayModalRatingBadge');
    const loc = document.getElementById('stayModalLoc');
    const title = document.getElementById('stayModalTitle');
    const desc = document.getElementById('stayModalDesc');
    const thumbs = document.getElementById('stayModalThumbs');
    const amenities = document.getElementById('stayModalAmenitiesList');
    const roomsList = document.getElementById('stayModalRoomsList');
    const checkin = document.getElementById('stayModalCheckin');
    const checkout = document.getElementById('stayModalCheckout');
    const proceedBtn = document.getElementById('stayReserveProceedBtn');

    if (mainImg) mainImg.src = stay.image;
    if (ratingBadge) ratingBadge.innerHTML = `<i class="fa-solid fa-star"></i> ${stay.rating}`;
    if (loc) loc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${stay.location}`;
    if (title) title.textContent = stay.name;
    if (desc) desc.textContent = stay.description;

    // Gallery Thumbs
    if (thumbs) {
      thumbs.innerHTML = stay.imagesGallery.map((imgUrl, i) => `
        <img src="${imgUrl}" class="thumb-img ${i === 0 ? 'active' : ''}" onclick="window.AuroraApp.switchStayThumb('${imgUrl}', this)">
      `).join('');
    }

    // Amenities
    if (amenities) {
      amenities.innerHTML = stay.amenities.map(a => `
        <span class="stay-tag-pill"><i class="fa-solid fa-circle-check text-gold"></i> ${capitalizeFirst(a)}</span>
      `).join('');
    }

    // Room Selection
    if (roomsList) {
      roomsList.innerHTML = stay.rooms.map((room, idx) => `
        <div class="room-option-card ${idx === 0 ? 'selected' : ''}" onclick="window.AuroraApp.selectRoomOption(${idx})">
          <div class="room-name-meta">
            <strong>${room.name}</strong>
            <span>${room.beds} &bull; Max ${room.guests} &bull; ${room.perks}</span>
          </div>
          <span class="room-rate-tag">${formatPrice(room.rate)}<span style="font-size:0.75rem; color:var(--text-muted);">/nt</span></span>
        </div>
      `).join('');
    }

    // Dates
    const today = new Date();
    const inD = new Date(today.getTime() + 14 * 86400000);
    const outD = new Date(today.getTime() + 17 * 86400000);
    if (checkin) {
      checkin.value = inD.toISOString().split('T')[0];
      checkin.onchange = updateStickyCalc;
    }
    if (checkout) {
      checkout.value = outD.toISOString().split('T')[0];
      checkout.onchange = updateStickyCalc;
    }

    updateStickyCalc();

    if (proceedBtn) {
      proceedBtn.onclick = () => {
        modal.classList.remove('open');
        initiateCheckout({
          type: 'stay',
          title: stay.name,
          subtitle: `${activeSelectedRoom.name} (${stay.location})`,
          image: stay.image,
          dates: `${checkin?.value || '2026-10-12'} to ${checkout?.value || '2026-10-15'}`,
          basePrice: activeSelectedRoom.rate * 3,
          totalPrice: (activeSelectedRoom.rate * 3) + 480 - 250
        });
      };
    }

    if (modal) modal.classList.add('open');
  }

  function switchStayThumb(imgUrl, el) {
    const mainImg = document.getElementById('stayModalMainImg');
    if (mainImg) mainImg.src = imgUrl;
    document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  function selectRoomOption(index) {
    if (!activeModalStay) return;
    activeSelectedRoom = activeModalStay.rooms[index];
    const cards = document.querySelectorAll('.room-option-card');
    cards.forEach((c, i) => {
      if (i === index) c.classList.add('selected');
      else c.classList.remove('selected');
    });
    updateStickyCalc();
  }

  function updateStickyCalc() {
    if (!activeModalStay || !activeSelectedRoom) return;
    const rateDisplay = document.getElementById('calcRateDisplay');
    const mathDisplay = document.getElementById('calcNightsMath');
    const subtotalDisplay = document.getElementById('calcSubtotalDisplay');
    const taxDisplay = document.getElementById('calcTaxesDisplay');
    const discountDisplay = document.getElementById('calcDiscountDisplay');
    const totalDisplay = document.getElementById('calcTotalDisplay');

    const rate = activeSelectedRoom.rate;
    const nights = 3;
    const subtotal = rate * nights;
    const taxes = Math.round(subtotal * 0.08);
    const discount = 250;
    const total = subtotal + taxes - discount;

    if (rateDisplay) rateDisplay.textContent = formatPrice(rate);
    if (mathDisplay) mathDisplay.textContent = `${formatPrice(rate)} × ${nights} nights`;
    if (subtotalDisplay) subtotalDisplay.textContent = formatPrice(subtotal);
    if (taxDisplay) taxDisplay.textContent = formatPrice(taxes);
    if (discountDisplay) discountDisplay.textContent = `-${formatPrice(discount)}`;
    if (totalDisplay) totalDisplay.textContent = formatPrice(total);
  }

  /* ==========================================================================
     FLIGHTS ENGINE
     ========================================================================== */

  function renderFlights() {
    const container = document.getElementById('flightCardsContainer');
    const countBadge = document.getElementById('flightResultCount');
    if (!container) return;

    let items = [...FLIGHTS_DATA];
    const sort = state.flightFilter.sort;

    if (sort === 'cheapest') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'fastest') {
      items.sort((a, b) => a.stopsCount - b.stopsCount);
    } else if (sort === 'luxury') {
      items = items.filter(f => f.cabin.includes('First') || f.cabin.includes('Charter'));
    }

    if (countBadge) countBadge.textContent = `Showing ${items.length} Premier Routes`;

    container.innerHTML = items.map(f => `
      <div class="flight-card">
        <div class="flight-airline-info">
          <div class="airline-badge-icon"><i class="${f.logoIcon}"></i></div>
          <div>
            <strong class="airline-name">${f.airline}</strong>
            <span class="aircraft-type">${f.aircraft}</span>
          </div>
        </div>

        <div class="flight-timeline-row">
          <div class="time-point">
            <span class="flight-time">${f.departTime}</span>
            <span class="flight-city-code">${f.fromCode}</span>
          </div>
          <div class="flight-route-diagram">
            <span class="flight-duration">${f.duration}</span>
            <div class="flight-path-bar"></div>
            <span class="flight-stops-tag">${f.stops}</span>
          </div>
          <div class="time-point">
            <span class="flight-time">${f.arriveTime}</span>
            <span class="flight-city-code">${f.toCode}</span>
          </div>
        </div>

        <div class="flight-perks-tags">
          <span class="f-tag"><i class="fa-solid fa-suitcase"></i> ${f.baggage}</span>
          <span class="f-tag"><i class="fa-solid fa-wine-glass"></i> Champagne</span>
        </div>

        <div class="flight-price-action">
          <span class="flight-cabin-lbl">${f.cabin}</span>
          <strong class="flight-card-price">${formatPrice(f.price)}</strong>
          <button class="btn btn-gold-sm mt-1" onclick="window.AuroraApp.selectFlightBooking('${f.id}')">
            Select Flight
          </button>
        </div>
      </div>
    `).join('');

    setupFlightSortPills();
  }

  function setupFlightSortPills() {
    const pills = document.querySelectorAll('.flight-sort-buttons .sort-pill');
    pills.forEach(pill => {
      pill.onclick = () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.flightFilter.sort = pill.dataset.flightsort;
        renderFlights();
      };
    });

    const swapBtn = document.getElementById('swapAirportsBtn');
    if (swapBtn && !swapBtn.dataset.bound) {
      swapBtn.dataset.bound = 'true';
      swapBtn.onclick = () => {
        const o = document.getElementById('flightOriginInput');
        const d = document.getElementById('flightDestInput');
        if (o && d) {
          const temp = o.value;
          o.value = d.value;
          d.value = temp;
        }
      };
    }
  }

  function handleFlightFilter() {
    renderFlights();
    showToast('Flights Filtered', 'Updated flight routes based on your schedule.', 'info');
  }

  function selectFlightBooking(flightId) {
    const flight = FLIGHTS_DATA.find(f => f.id === flightId);
    if (!flight) return;

    initiateCheckout({
      type: 'flight',
      title: `${flight.airline} Suite`,
      subtitle: `${flight.fromCode} → ${flight.toCode} (${flight.cabin})`,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80',
      dates: 'Flexible departure in 2026',
      basePrice: flight.price,
      totalPrice: flight.price
    });
  }

  /* ==========================================================================
     BESPOKE EXPERIENCES & PACKAGES
     ========================================================================== */

  function renderExperiences() {
    const container = document.getElementById('experiencesContainer');
    if (!container) return;

    container.innerHTML = EXPERIENCES_DATA.map(exp => `
      <div class="exp-card">
        <div class="exp-img-wrap">
          <img src="${exp.image}" alt="${exp.title}">
          <span class="exp-duration-badge"><i class="fa-regular fa-clock"></i> ${exp.duration}</span>
        </div>
        <div class="exp-content">
          <span class="exp-cat-loc">${exp.location}</span>
          <h4 class="exp-title">${exp.title}</h4>
          <p class="exp-desc">${exp.description}</p>
          <div class="exp-footer">
            <div>
              <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">From</span>
              <strong style="font-size:1.2rem; color:var(--gold-primary); display:block;">${formatPrice(exp.price)}</strong>
            </div>
            <button class="btn btn-gold-sm" onclick="window.AuroraApp.bookExperience('${exp.id}')">
              Reserve Experience
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const pills = document.querySelectorAll('#expCategoryFilter .pill-btn');
    pills.forEach(pill => {
      pill.onclick = () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.expcat;
        if (cat === 'all') {
          renderExperiences();
        } else {
          const filtered = EXPERIENCES_DATA.filter(e => e.category === cat);
          container.innerHTML = filtered.map(exp => `
            <div class="exp-card">
              <div class="exp-img-wrap">
                <img src="${exp.image}" alt="${exp.title}">
                <span class="exp-duration-badge"><i class="fa-regular fa-clock"></i> ${exp.duration}</span>
              </div>
              <div class="exp-content">
                <span class="exp-cat-loc">${exp.location}</span>
                <h4 class="exp-title">${exp.title}</h4>
                <p class="exp-desc">${exp.description}</p>
                <div class="exp-footer">
                  <strong style="font-size:1.2rem; color:var(--gold-primary);">${formatPrice(exp.price)}</strong>
                  <button class="btn btn-gold-sm" onclick="window.AuroraApp.bookExperience('${exp.id}')">Reserve Experience</button>
                </div>
              </div>
            </div>
          `).join('');
        }
      };
    });
  }

  function bookExperience(expId) {
    const exp = EXPERIENCES_DATA.find(e => e.id === expId);
    if (!exp) return;

    initiateCheckout({
      type: 'experience',
      title: exp.title,
      subtitle: `${exp.location} (${exp.duration})`,
      image: exp.image,
      dates: 'Scheduled via personal concierge',
      basePrice: exp.price,
      totalPrice: exp.price
    });
  }

  function renderPackages() {
    const container = document.getElementById('packagesContainer');
    if (!container) return;

    container.innerHTML = PACKAGES_DATA.map(pkg => `
      <div class="package-card">
        <div class="pkg-img-wrap">
          <img src="${pkg.image}" alt="${pkg.title}">
          <span class="pkg-duration-badge"><i class="fa-regular fa-calendar"></i> ${pkg.durationDays} Days / ${pkg.durationNights} Nights</span>
        </div>
        <div class="pkg-content">
          <span class="exp-cat-loc">${pkg.dest}</span>
          <h4 class="pkg-title">${pkg.title}</h4>
          <p class="pkg-desc">${pkg.description}</p>
          <ul class="pkg-inclusions-list">
            ${pkg.inclusions.map(inc => `<li><i class="fa-solid fa-check"></i> <span>${inc}</span></li>`).join('')}
          </ul>
          <div class="pkg-footer">
            <div>
              <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">All-Inclusive Per Couple</span>
              <strong style="font-size:1.35rem; color:var(--gold-primary); display:block;">${formatPrice(pkg.price)}</strong>
            </div>
            <button class="btn btn-gold-sm" onclick="window.AuroraApp.bookPackage('${pkg.id}')">
              Book Journey
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function bookPackage(pkgId) {
    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    if (!pkg) return;

    initiateCheckout({
      type: 'package',
      title: pkg.title,
      subtitle: `${pkg.durationDays} Days / ${pkg.durationNights} Nights in ${pkg.dest}`,
      image: pkg.image,
      dates: 'Oct 12 – Oct 19, 2026',
      basePrice: pkg.price,
      totalPrice: pkg.price
    });
  }

  /* ==========================================================================
     SMART 5-STEP AI TRIP PLANNER (FLAGSHIP)
     ========================================================================== */

  function setupTripPlanner() {
    const nextBtn = document.getElementById('wizardNextBtn');
    const prevBtn = document.getElementById('wizardPrevBtn');
    const daysSlider = document.getElementById('plannerDaysSlider');
    const daysVal = document.getElementById('plannerDaysVal');
    const destInput = document.getElementById('plannerDestInput');

    if (daysSlider && daysVal) {
      daysSlider.addEventListener('input', (e) => {
        state.planner.days = parseInt(e.target.value);
        daysVal.textContent = `${state.planner.days} Days`;
      });
    }

    if (destInput) {
      destInput.addEventListener('input', (e) => {
        state.planner.destination = e.target.value;
      });
    }

    // Step 1: Destination Chips
    document.querySelectorAll('.planner-dest-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.planner-dest-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        state.planner.destination = chip.dataset.dest;
        state.planner.destImg = chip.dataset.img;
        if (destInput) destInput.value = chip.dataset.dest;
      });
    });

    // Step 3: Style Choices
    document.querySelectorAll('.style-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.style-choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.planner.style = card.dataset.style;
      });
    });

    // Step 4: Interests Checkboxes
    document.querySelectorAll('#plannerInterestsTags .tag-checkbox-pill').forEach(pill => {
      const checkbox = pill.querySelector('input');
      pill.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        pill.classList.toggle('selected', checkbox.checked);

        const checkedInterests = [];
        document.querySelectorAll('#plannerInterestsTags input:checked').forEach(cb => {
          checkedInterests.push(cb.value);
        });
        state.planner.interests = checkedInterests;
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.planner.currentStep < 5) {
          goToPlannerStep(state.planner.currentStep + 1);
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.planner.currentStep > 1) {
          goToPlannerStep(state.planner.currentStep - 1);
        }
      });
    }

    // Step node direct clicks
    document.querySelectorAll('.step-node').forEach(node => {
      node.addEventListener('click', () => {
        const stepNum = parseInt(node.dataset.step);
        if (stepNum <= state.planner.currentStep || state.planner.generatedItinerary) {
          goToPlannerStep(stepNum);
        }
      });
    });

    // Step 5 Actions
    setupItineraryActions();
  }

  function loadDestIntoPlanner(destName, destImgUrl) {
    state.planner.destination = destName;
    state.planner.destImg = destImgUrl;
    const destInput = document.getElementById('plannerDestInput');
    if (destInput) destInput.value = destName;
    goToPlannerStep(2);
    showToast('Destination Selected', `Planning journey for ${destName}`, 'info');
  }

  function goToPlannerStep(stepNumber) {
    state.planner.currentStep = stepNumber;

    // Toggle panels
    for (let i = 1; i <= 5; i++) {
      const panel = document.getElementById(`wizardStep${i}`);
      const node = document.getElementById(`stepNode${i}`);
      const line = document.getElementById(`stepLine${i - 1}`);

      if (panel) panel.classList.toggle('active', i === stepNumber);
      if (node) {
        node.classList.toggle('active', i === stepNumber);
        node.classList.toggle('completed', i < stepNumber);
      }
      if (line) line.classList.toggle('active', i <= stepNumber);
    }

    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const statusText = document.getElementById('wizardStatusText');

    if (prevBtn) prevBtn.style.display = stepNumber === 1 ? 'none' : 'inline-flex';

    if (stepNumber === 4) {
      if (nextBtn) {
        nextBtn.innerHTML = '<span>Generate Intelligent Itinerary</span> <i class="fa-solid fa-wand-magic-sparkles"></i>';
      }
      if (statusText) statusText.textContent = 'Step 4 of 4: Passions & Pace';
    } else if (stepNumber === 5) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (statusText) statusText.textContent = 'Bespoke Itinerary Complete';
      generateItineraryEngine();
    } else {
      if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        nextBtn.innerHTML = '<span>Continue</span> <i class="fa-solid fa-arrow-right"></i>';
      }
      if (statusText) statusText.textContent = `Step ${stepNumber} of 4`;
    }
  }

  function generateItineraryEngine() {
    const days = state.planner.days;
    const dest = state.planner.destination;
    const style = state.planner.style;
    const interests = state.planner.interests;

    const displayTitle = document.getElementById('itineraryDisplayTitle');
    const chips = document.getElementById('itineraryMetaChips');

    if (displayTitle) {
      displayTitle.textContent = `${days}-Day ${style}: ${dest}`;
    }

    if (chips) {
      chips.innerHTML = `
        <span class="itinerary-meta-chip"><i class="fa-solid fa-location-dot text-gold"></i> ${dest}</span>
        <span class="itinerary-meta-chip"><i class="fa-solid fa-clock text-gold"></i> ${days} Days Duration</span>
        <span class="itinerary-meta-chip"><i class="fa-solid fa-gem text-gold"></i> ${style}</span>
        <span class="itinerary-meta-chip"><i class="fa-solid fa-heart text-gold"></i> ${interests.slice(0, 2).join(', ')}</span>
      `;
    }

    // Dynamic schedule construction
    const daySchedules = [];
    const activitiesPool = [
      { time: '09:00 AM', title: 'Private VIP Airport Welcome & Chauffeur Transfer', desc: 'Direct tarmac greeter with luggage concierge to your sanctuary suite.' },
      { time: '11:30 AM', title: 'Curated Hotel Check-in & Welcome Champagne', desc: 'Settle into your panoramic suite with on-property tour and unpacking service.' },
      { time: '01:00 PM', title: 'Michelin Chef Table Lunch Tasting', desc: 'Multi-course culinary experience celebrating seasonal ingredients.' },
      { time: '03:30 PM', title: 'Architectural & Historic Landmark Excursion', desc: 'Private art historian guide with priority velvet-rope access.' },
      { time: '06:00 PM', title: 'Sunset Catamaran & Champagne Cruise', desc: 'Drift past coastal wonders with sommelier wine tastings.' },
      { time: '08:30 PM', title: 'Starlight Private Terrace Dinner', desc: 'Candlelit dining overlooking the illuminated horizon.' }
    ];

    for (let d = 1; d <= days; d++) {
      let theme = `Day ${d}: Iconic Sights & Haute Discovery`;
      if (d === 1) theme = 'Day 1: Arrival, Palace Check-in & Welcome Gastronomy';
      if (d === days) theme = `Day ${d}: Morning Leisure, Private Shopping & VIP Departure`;

      daySchedules.push({
        dayNumber: d,
        theme: theme,
        activities: [
          { ...activitiesPool[(d * 2) % activitiesPool.length], id: `act-${d}-1` },
          { ...activitiesPool[(d * 2 + 1) % activitiesPool.length], id: `act-${d}-2` },
          { ...activitiesPool[(d * 2 + 2) % activitiesPool.length], id: `act-${d}-3` }
        ]
      });
    }

    state.planner.generatedItinerary = {
      title: `${days}-Day ${style}: ${dest}`,
      destination: dest,
      days: days,
      style: style,
      schedule: daySchedules
    };

    renderItineraryDays();
    showToast('Itinerary Generated', `Bespoke ${days}-day timeline ready for review.`, 'info');
  }

  function renderItineraryDays() {
    const container = document.getElementById('itineraryDaysTimeline');
    if (!container || !state.planner.generatedItinerary) return;

    container.innerHTML = state.planner.generatedItinerary.schedule.map(day => `
      <div class="itinerary-day-card" data-day="${day.dayNumber}">
        <div class="day-header-row">
          <div class="day-title-group">
            <span class="day-badge-num">DAY ${day.dayNumber}</span>
            <h4 class="day-theme-title">${day.theme}</h4>
          </div>
          <button class="btn-ghost-sm" onclick="window.AuroraApp.addActivityPrompt(${day.dayNumber})" title="Add item to this day">
            <i class="fa-solid fa-plus text-gold"></i> Add Activity
          </button>
        </div>

        <div class="activities-timeline">
          ${day.activities.map((act, actIdx) => `
            <div class="activity-item" id="${act.id}">
              <span class="act-time-pill">${act.time}</span>
              <div class="act-content">
                <h5 class="act-title">${act.title}</h5>
                <p class="act-desc">${act.desc}</p>
              </div>
              <div class="act-actions">
                <button class="btn-act-tool" onclick="window.AuroraApp.deleteActivity(${day.dayNumber}, ${actIdx})" title="Remove item">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  function setupItineraryActions() {
    const saveBtn = document.getElementById('itinerarySaveBtn');
    const calendarBtn = document.getElementById('itineraryCalendarBtn');
    const printBtn = document.getElementById('itineraryPrintBtn');
    const bookNowBtn = document.getElementById('itineraryBookNowBtn');
    const addActBtn = document.getElementById('itineraryAddActivityBtn');

    if (saveBtn) {
      saveBtn.onclick = () => {
        if (!state.planner.generatedItinerary) return;
        state.itineraries.push({
          id: 'itin-' + Date.now(),
          ...state.planner.generatedItinerary,
          savedAt: new Date().toLocaleDateString()
        });
        saveItineraries();
        showToast('Itinerary Saved', 'Added to your traveler dashboard profile.', 'info');
      };
    }

    if (calendarBtn) {
      calendarBtn.onclick = () => {
        exportCalendarIcs();
      };
    }

    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    if (bookNowBtn) {
      bookNowBtn.onclick = () => {
        if (!state.planner.generatedItinerary) return;
        initiateCheckout({
          type: 'itinerary',
          title: state.planner.generatedItinerary.title,
          subtitle: `${state.planner.days} Days in ${state.planner.destination}`,
          image: state.planner.destImg,
          dates: 'Oct 15 – Oct 20, 2026',
          basePrice: state.planner.days * 1200,
          totalPrice: state.planner.days * 1200
        });
      };
    }

    if (addActBtn) {
      addActBtn.onclick = () => {
        addActivityPrompt(1);
      };
    }
  }

  function addActivityPrompt(dayNumber) {
    const title = prompt('Enter Activity Title (e.g., Private Sunset Helicopter Cruise):', 'Private Wine Tasting & Canapés');
    if (!title) return;
    const time = prompt('Enter Scheduled Time:', '04:30 PM') || '04:30 PM';
    const desc = prompt('Enter Brief Notes / Location:', 'Exclusive private tasting with senior estate sommelier.') || '';

    const dayObj = state.planner.generatedItinerary?.schedule.find(d => d.dayNumber === dayNumber);
    if (dayObj) {
      dayObj.activities.push({
        id: `act-${dayNumber}-${Date.now()}`,
        time: time,
        title: title,
        desc: desc
      });
      renderItineraryDays();
      showToast('Activity Added', `Added "${title}" to Day ${dayNumber}.`, 'info');
    }
  }

  function deleteActivity(dayNumber, actIndex) {
    const dayObj = state.planner.generatedItinerary?.schedule.find(d => d.dayNumber === dayNumber);
    if (dayObj) {
      dayObj.activities.splice(actIndex, 1);
      renderItineraryDays();
      showToast('Activity Removed', `Item deleted from Day ${dayNumber}.`, 'info');
    }
  }

  function exportCalendarIcs() {
    if (!state.planner.generatedItinerary) return;
    const itin = state.planner.generatedItinerary;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aurora Travel//Bespoke Itinerary//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    itin.schedule.forEach((day, idx) => {
      day.activities.forEach(act => {
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`SUMMARY:${act.title} - Aurora Travel`);
        icsContent.push(`DESCRIPTION:${act.desc}`);
        icsContent.push(`LOCATION:${itin.destination}`);
        icsContent.push(`STATUS:CONFIRMED`);
        icsContent.push('END:VEVENT');
      });
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Aurora_${itin.destination.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Calendar Synced', 'Downloaded .ics file for Apple/Google Calendar.', 'info');
  }

  /* ==========================================================================
     INTERACTIVE WORLD MAP
     ========================================================================== */

  function setupInteractiveMap() {
    const container = document.getElementById('mapPinsLayer');
    const popup = document.getElementById('mapPopupCard');
    const closePopupBtn = document.getElementById('closeMapPopupBtn');
    const filterBtns = document.querySelectorAll('#mapFilterLayers .map-filter-btn');

    if (!container) return;

    renderMapPins('all');

    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMapPins(btn.dataset.pin);
      };
    });

    if (closePopupBtn && popup) {
      closePopupBtn.onclick = () => {
        popup.style.display = 'none';
      };
    }
  }

  function renderMapPins(filterType) {
    const container = document.getElementById('mapPinsLayer');
    if (!container) return;

    let pins = [...MAP_PINS_DATA];
    if (filterType !== 'all') {
      pins = pins.filter(p => p.type === filterType);
    }

    container.innerHTML = pins.map(p => `
      <div class="map-pin" style="top: ${p.top}; left: ${p.left};" onclick="window.AuroraApp.openMapPopup('${p.id}')">
        <div class="pin-marker">
          <i class="${getPinIcon(p.type)}"></i>
        </div>
        <div class="pin-pulse-ring"></div>
      </div>
    `).join('');
  }

  function getPinIcon(type) {
    if (type === 'stay') return 'fa-solid fa-hotel';
    if (type === 'landmark') return 'fa-solid fa-landmark';
    if (type === 'dining') return 'fa-solid fa-utensils';
    if (type === 'aviation') return 'fa-solid fa-plane';
    return 'fa-solid fa-location-dot';
  }

  function openMapPopup(pinId) {
    const pin = MAP_PINS_DATA.find(p => p.id === pinId);
    const popup = document.getElementById('mapPopupCard');
    if (!pin || !popup) return;

    const img = document.getElementById('mapPopupImg');
    const badge = document.getElementById('mapPopupBadge');
    const title = document.getElementById('mapPopupTitle');
    const desc = document.getElementById('mapPopupDesc');
    const price = document.getElementById('mapPopupPrice');
    const actionBtn = document.getElementById('mapPopupActionBtn');

    if (img) img.src = pin.img;
    if (badge) badge.textContent = pin.category;
    if (title) title.textContent = pin.title;
    if (desc) desc.textContent = pin.desc;
    if (price) price.textContent = pin.price;

    if (actionBtn) {
      actionBtn.onclick = () => {
        if (pin.type === 'stay') {
          openStayModal('stay-burj-al-arab');
        } else {
          location.href = '#destinations';
        }
      };
    }

    popup.style.display = 'block';
  }

  /* ==========================================================================
     TRAVEL MAGAZINE & EDITORIAL
     ========================================================================== */

  function setupMagazine() {
    const container = document.getElementById('magazineArticlesGrid');
    if (!container) return;

    const secondaryArticles = [
      {
        id: 'art-2',
        title: 'The World’s Top 10 Overwater Bungalows in 2026',
        category: 'Island Living',
        readTime: '5 min read',
        img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80',
        content: 'From retractable astronomy roofs in the Maldives to private wine cellars perched above French Polynesian lagoons, overwater architecture has achieved unprecedented heights.'
      },
      {
        id: 'art-3',
        title: 'Tokyo’s Hidden 8-Seat Michelin Counters',
        category: 'Gastronomy',
        readTime: '6 min read',
        img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
        content: 'Beyond the neon of Roppongi lies an elite network of sushi masters serving wild tuna caught that dawn in Toyosu, reserved exclusively through bespoke concierge relationships.'
      },
      {
        id: 'art-4',
        title: 'Packing for Haute Journeys: The Capsule Wardrobe',
        category: 'Luxury Lifestyle',
        readTime: '4 min read',
        img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
        content: 'How discerning travelers maintain uncompromising elegance across private jets, alpine chalets, and tropical atolls with bespoke Loro Piana cashmere and Rimowa titanium trunks.'
      }
    ];

    container.innerHTML = secondaryArticles.map(a => `
      <div class="mag-card-sm" onclick="window.AuroraApp.openArticleModal('${a.id}')">
        <img src="${a.img}" alt="${a.title}" class="mag-thumb">
        <div class="mag-sm-info">
          <span style="font-size:0.7rem; color:var(--gold-primary); font-weight:700; text-transform:uppercase;">${a.category} &bull; ${a.readTime}</span>
          <h4 class="mag-sm-title">${a.title}</h4>
          <span class="btn-text-sm">Read Article &rarr;</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.btn-read-article').forEach(btn => {
      btn.onclick = () => {
        openArticleModal(btn.dataset.articleId);
      };
    });
  }

  function openArticleModal(articleId) {
    const modal = document.getElementById('articleModalBackdrop');
    const content = document.getElementById('articleModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding: 32px;">
        <span class="badge-gold-outline"><i class="fa-solid fa-crown"></i> AURORA EDITORIAL</span>
        <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin: 12px 0 16px 0;">The Renaissance of Slow Travel: Private Panoramic Rail Across the Swiss Alps</h2>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom: 24px; color: var(--text-muted); font-size: 0.85rem;">
          <span>By Elena Von Habsburg</span>
          <span>&bull;</span>
          <span>7 min read</span>
          <span>&bull;</span>
          <span>September 2026 Edition</span>
        </div>
        <img src="https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80" style="width:100%; border-radius: var(--radius-md); margin-bottom: 24px;">
        <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary);">
          <p style="margin-bottom: 16px;">In an era dominated by instantaneous private jet charters and hypersonic velocity, the most discerning travelers are rediscovering the sublime grandeur of unhurried motion. High in the Swiss canton of Graubünden, observation trains are experiencing an aristocratic rebirth.</p>
          <p style="margin-bottom: 16px;">Gliding over the stone viaducts of the Landwasser Gorge, passengers in Excellence Class sip 2012 Dom Pérignon served in Riedel crystal while watching sheer granite cliffs dissolve into turquoise mountain torrents.</p>
          <p>“Slow travel is not about delay,” remarks senior curator Jean-Luc Moreau. “It is the deliberate reclaiming of wonder.”</p>
        </div>
      </div>
    `;

    modal.classList.add('open');
  }

  /* ==========================================================================
     EXCLUSIVE DEALS & COUNTDOWN TIMER
     ========================================================================== */

  function renderDeals() {
    const container = document.getElementById('dealsGridContainer');
    if (!container) return;

    container.innerHTML = DEALS_DATA.map(d => `
      <div class="deal-card">
        <span class="deal-badge-pill">${d.badge}</span>
        <span class="deal-target">${d.target}</span>
        <h4 class="deal-title">${d.title}</h4>
        <p class="deal-perk">${d.perk}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
          <div>
            <span style="font-size:0.7rem; color:var(--text-muted);">From</span>
            <strong style="font-size:1.25rem; color:var(--gold-primary); display:block;">${formatPrice(d.priceFrom)}/nt</strong>
          </div>
          <button class="btn btn-gold-sm" onclick="window.AuroraApp.openStayModal('stay-the-chedi')">Claim Privilege</button>
        </div>
      </div>
    `).join('');
  }

  function setupDealsTimer() {
    let seconds = 38 * 3600 + 44 * 60 + 19;
    const hEl = document.getElementById('countdownHours');
    const mEl = document.getElementById('countdownMins');
    const sEl = document.getElementById('countdownSecs');

    setInterval(() => {
      seconds--;
      if (seconds < 0) seconds = 86400;

      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hEl) hEl.textContent = String(hrs).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }, 1000);
  }

  /* ==========================================================================
     COMMUNITY STORIES & REVIEWS
     ========================================================================== */

  function renderCommunityStories() {
    const container = document.getElementById('communityStoriesGrid');
    if (!container) return;

    container.innerHTML = state.stories.map(s => `
      <div class="story-card" id="${s.id}">
        <div class="story-img-wrap">
          <img src="${s.photo}" alt="${s.location}">
          <span class="story-loc-tag"><i class="fa-solid fa-location-dot"></i> ${s.location}</span>
        </div>
        <div class="story-body">
          <p class="story-quote">${s.quote}</p>
          <div class="story-author-row">
            <div class="story-author-meta">
              <img src="${s.avatar}" alt="${s.author}" class="author-pic">
              <div>
                <strong>${s.author}</strong>
                <span>Verified Voyager</span>
              </div>
            </div>
            <button class="btn-like-story" onclick="window.AuroraApp.likeStory('${s.id}')">
              <i class="fa-solid fa-heart"></i>
              <span class="like-num">${s.likes}</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const openShareBtn = document.getElementById('openShareStoryBtn');
    const shareModal = document.getElementById('shareStoryModalBackdrop');
    if (openShareBtn && shareModal) {
      openShareBtn.onclick = () => shareModal.classList.add('open');
    }
  }

  function likeStory(storyId) {
    const story = state.stories.find(s => s.id === storyId);
    if (story) {
      story.likes++;
      renderCommunityStories();
      showToast('Voyager Dispatch Liked', 'Thank you for supporting community travelers.', 'info');
    }
  }

  function handleStorySubmit() {
    const author = document.getElementById('storyAuthor')?.value || 'Alexander Wright';
    const location = document.getElementById('storyLocation')?.value || 'Amalfi Coast, Italy';
    const img = document.getElementById('storyImage')?.value || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80';
    const text = document.getElementById('storyText')?.value || 'An unforgettable experience.';

    state.stories.unshift({
      id: 'story-' + Date.now(),
      author: author,
      avatar: state.activeUser.avatar,
      location: location,
      photo: img,
      quote: `“${text}”`,
      likes: 1
    });

    const modal = document.getElementById('shareStoryModalBackdrop');
    if (modal) modal.classList.remove('open');

    renderCommunityStories();
    showToast('Story Published', 'Your travel story is live in the Aurora community!', 'info');
  }

  function renderReviews() {
    const container = document.getElementById('reviewsCardsGrid');
    if (!container) return;

    container.innerHTML = REVIEWS_DATA.map(r => `
      <div class="review-card">
        <div class="review-stars-row">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </div>
        <p class="review-text">${r.text}</p>
        <div class="reviewer-meta">
          <img src="${r.img}" alt="${r.name}" class="reviewer-img">
          <div>
            <strong>${r.name}</strong>
            <span>${r.tier}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     TRAVELER DASHBOARD
     ========================================================================== */

  function setupDashboard() {
    const buttons = document.querySelectorAll('.dash-nav-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        switchDashboardTab(btn.dataset.dashtab);
      });
    });

    const clearFavsBtn = document.getElementById('clearAllFavsBtn');
    if (clearFavsBtn) {
      clearFavsBtn.onclick = () => {
        if (confirm('Clear all items from your saved wishlist?')) {
          state.favorites = [];
          saveFavorites();
          renderDashboardFavorites();
          showToast('Wishlist Cleared', 'All saved sanctuaries removed.', 'info');
        }
      };
    }

    const bookingFilters = document.querySelectorAll('.booking-status-filters .filter-pill-sm');
    bookingFilters.forEach(pill => {
      pill.onclick = () => {
        bookingFilters.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderDashboardBookings(pill.dataset.bfilter);
      };
    });

    const logoutBtn = document.getElementById('dashLogoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        state.activeUser.isLoggedIn = false;
        showToast('Signed Out', 'Signed out of your Aurora session.', 'info');
        updateNavUserDisplay();
      };
    }

    renderDashboardOverview();
    renderDashboardBookings();
    renderDashboardFavorites();
    renderDashboardItineraries();
  }

  function switchDashboardTab(tabName) {
    const buttons = document.querySelectorAll('.dash-nav-btn');
    const panes = document.querySelectorAll('.dash-tab-pane');

    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dashtab === tabName);
    });

    panes.forEach(p => p.classList.remove('active'));

    let targetPane = 'paneOverview';
    if (tabName === 'my-trips') targetPane = 'paneMyTrips';
    if (tabName === 'bookings') targetPane = 'paneBookings';
    if (tabName === 'favorites') targetPane = 'paneFavorites';
    if (tabName === 'rewards') targetPane = 'paneRewards';
    if (tabName === 'settings') targetPane = 'paneSettings';

    const paneEl = document.getElementById(targetPane);
    if (paneEl) paneEl.classList.add('active');

    if (tabName === 'bookings') renderDashboardBookings();
    if (tabName === 'favorites') renderDashboardFavorites();
    if (tabName === 'my-trips') renderDashboardItineraries();
  }

  function renderDashboardOverview() {
    const bookingBadge = document.getElementById('dashBookingCountBadge');
    const favBadge = document.getElementById('dashFavCountBadge');
    const statTrips = document.getElementById('statTripsCount');
    const statCredits = document.getElementById('statCreditsCount');
    const statSaved = document.getElementById('statSavedCount');

    if (bookingBadge) bookingBadge.textContent = state.bookings.filter(b => b.status === 'upcoming').length;
    if (favBadge) favBadge.textContent = state.favorites.length;
    if (statTrips) statTrips.textContent = state.bookings.filter(b => b.status === 'completed').length + 3;
    if (statCredits) statCredits.textContent = formatPrice(state.activeUser.credits);
    if (statSaved) statSaved.textContent = state.favorites.length;

    // Boarding pass trigger
    const passBtn = document.getElementById('viewBoardingPassBtn');
    if (passBtn) {
      passBtn.onclick = () => {
        showToast('Digital Boarding Pass', 'Reference AUR-9821-DXB is active for VIP airport terminal lounge.', 'info');
      };
    }
  }

  function renderDashboardBookings(filter = 'all') {
    const container = document.getElementById('dashBookingsList');
    if (!container) return;

    let items = [...state.bookings];
    if (filter !== 'all') {
      items = items.filter(b => b.status === filter);
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: 40px;">
          <i class="fa-solid fa-ticket" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px;"></i>
          <h4>No Bookings in this Category</h4>
          <p class="text-muted">Explore our curated stays and flights to reserve your next voyage.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(b => `
      <div class="booking-item-card">
        <div class="booking-item-left">
          <img src="${b.image}" alt="${b.title}" class="booking-item-thumb">
          <div>
            <span class="status-pill ${b.status === 'upcoming' ? 'status-confirmed' : b.status === 'completed' ? 'status-confirmed' : 'status-cancelled'}">
              <i class="fa-solid ${b.status === 'upcoming' ? 'fa-clock' : b.status === 'completed' ? 'fa-check' : 'fa-xmark'}"></i>
              ${capitalizeFirst(b.status)}
            </span>
            <strong class="b-title" style="margin-top: 4px;">${b.title}</strong>
            <span class="b-meta">${b.dates} &bull; PNR: <strong>${b.id}</strong></span>
          </div>
        </div>
        <div class="booking-item-right">
          <strong class="b-price">${formatPrice(b.price)}</strong>
          ${b.status === 'upcoming' ? `
            <button class="btn btn-ghost-sm text-danger" onclick="window.AuroraApp.cancelBooking('${b.id}')">
              Cancel Booking
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  function cancelBooking(bookingId) {
    if (confirm('Are you sure you wish to cancel this reservation under Aurora’s VIP guarantee?')) {
      const b = state.bookings.find(item => item.id === bookingId);
      if (b) {
        b.status = 'cancelled';
        saveBookings();
        renderDashboardOverview();
        showToast('Reservation Cancelled', `Booking ${bookingId} has been cancelled without penalty.`, 'info');
      }
    }
  }

  function renderDashboardFavorites() {
    const container = document.getElementById('dashFavoritesContainer');
    if (!container) return;

    if (state.favorites.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: 40px; grid-column: 1 / -1;">
          <i class="fa-regular fa-heart" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px;"></i>
          <h4>Your Saved Wishlist is Empty</h4>
          <p class="text-muted">Click the heart icon on any destination or stay to bookmark it here.</p>
        </div>
      `;
      return;
    }

    const savedStays = STAYS_DATA.filter(s => state.favorites.includes(s.id));
    const savedDests = DESTINATIONS_DATA.filter(d => state.favorites.includes(d.id));

    container.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        ${savedStays.map(s => `
          <div class="glass-card" style="padding: 16px; border-radius: var(--radius-md);">
            <img src="${s.image}" style="width:100%; height:140px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom:10px;">
            <strong>${s.name}</strong>
            <p style="font-size:0.75rem; color:var(--text-muted);">${s.location}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
              <span class="text-gold font-bold">${formatPrice(s.pricePerNight)}/nt</span>
              <button class="btn btn-gold-sm" onclick="window.AuroraApp.openStayModal('${s.id}')">Book</button>
            </div>
          </div>
        `).join('')}
        ${savedDests.map(d => `
          <div class="glass-card" style="padding: 16px; border-radius: var(--radius-md);">
            <img src="${d.image}" style="width:100%; height:140px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom:10px;">
            <strong>${d.city}</strong>
            <p style="font-size:0.75rem; color:var(--text-muted);">${d.country}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
              <span class="text-gold font-bold">From ${formatPrice(d.startingPrice)}</span>
              <button class="btn btn-gold-sm" onclick="window.AuroraApp.openDestModal('${d.id}')">Explore</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderDashboardItineraries() {
    const container = document.getElementById('savedItinerariesContainer');
    if (!container) return;

    if (state.itineraries.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding: 40px;">
          <i class="fa-solid fa-route" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 12px;"></i>
          <h4>No Custom Itineraries Saved Yet</h4>
          <p class="text-muted">Use our 5-Step AI Planner to generate and save your dream timeline.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.itineraries.map((it, idx) => `
      <div class="booking-item-card" style="margin-bottom: 14px;">
        <div>
          <span class="badge-gold-outline"><i class="fa-solid fa-sparkles"></i> AI Generated</span>
          <h4 style="margin-top: 4px;">${it.title}</h4>
          <span class="text-muted" style="font-size:0.8rem;">Saved on ${it.savedAt || 'Today'} &bull; ${it.days} Days Schedule</span>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-glass-sm" onclick="window.AuroraApp.viewSavedItinerary(${idx})">View Schedule</button>
          <button class="btn btn-ghost-sm text-danger" onclick="window.AuroraApp.deleteSavedItinerary(${idx})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `).join('');
  }

  function viewSavedItinerary(index) {
    const it = state.itineraries[index];
    if (!it) return;
    state.planner.generatedItinerary = it;
    location.href = '#planner';
    goToPlannerStep(5);
    renderItineraryDays();
  }

  function deleteSavedItinerary(index) {
    state.itineraries.splice(index, 1);
    saveItineraries();
    showToast('Itinerary Removed', 'Deleted from your profile.', 'info');
  }

  function saveProfileSettings() {
    const name = document.getElementById('setFullName')?.value;
    const email = document.getElementById('setEmail')?.value;
    if (name) state.activeUser.name = name;
    if (email) state.activeUser.email = email;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.activeUser));
    updateNavUserDisplay();
    showToast('Profile Updated', 'Your travel persona & preferences have been saved.', 'info');
  }

  /* ==========================================================================
     MULTI-STEP CHECKOUT ENGINE
     ========================================================================== */

  function initiateCheckout(itemData) {
    state.checkout.item = itemData;
    state.checkout.step = 1;

    const modal = document.getElementById('checkoutModalBackdrop');
    const chkImg = document.getElementById('chkItemImg');
    const chkType = document.getElementById('chkItemType');
    const chkTitle = document.getElementById('chkItemTitle');
    const chkSub = document.getElementById('chkItemSub');
    const chkDates = document.getElementById('chkItemDates');
    const chkPrice = document.getElementById('chkItemPrice');

    if (chkImg) chkImg.src = itemData.image;
    if (chkType) chkType.textContent = itemData.type.toUpperCase();
    if (chkTitle) chkTitle.textContent = itemData.title;
    if (chkSub) chkSub.textContent = itemData.subtitle;
    if (chkDates) chkDates.innerHTML = `<i class="fa-regular fa-calendar"></i> ${itemData.dates}`;
    if (chkPrice) chkPrice.textContent = formatPrice(itemData.totalPrice);

    updateCheckoutStepView(1);
    if (modal) modal.classList.add('open');
  }

  function setupCheckoutFlow() {
    const btnToStep2 = document.getElementById('chkGotoStep2Btn');
    const btnToStep3 = document.getElementById('chkGotoStep3Btn');
    const btnBackTo1 = document.getElementById('chkBackToStep1Btn');
    const btnBackTo2 = document.getElementById('chkBackToStep2Btn');
    const authorizeBtn = document.getElementById('chkAuthorizePaymentBtn');

    // Addons checkboxes
    const addTransfer = document.getElementById('addonTransfer');
    const addInsurance = document.getElementById('addonInsurance');
    const addCarbon = document.getElementById('addonCarbon');

    [addTransfer, addInsurance, addCarbon].forEach(el => {
      if (el) el.onchange = recalculateCheckoutTotal;
    });

    if (btnToStep2) btnToStep2.onclick = () => updateCheckoutStepView(2);
    if (btnBackTo1) btnBackTo1.onclick = () => updateCheckoutStepView(1);
    if (btnToStep3) btnToStep3.onclick = () => updateCheckoutStepView(3);
    if (btnBackTo2) btnBackTo2.onclick = () => updateCheckoutStepView(2);

    if (authorizeBtn) {
      authorizeBtn.onclick = () => {
        processCheckoutAuthorization();
      };
    }

    // Confirmation screen triggers
    const printReceiptBtn = document.getElementById('confPrintReceiptBtn');
    const addCalBtn = document.getElementById('confAddCalendarBtn');
    const viewDashBtn = document.getElementById('confViewDashboardBtn');

    if (printReceiptBtn) printReceiptBtn.onclick = () => window.print();
    if (addCalBtn) addCalBtn.onclick = () => exportCalendarIcs();
    if (viewDashBtn) {
      viewDashBtn.onclick = () => {
        document.getElementById('checkoutModalBackdrop')?.classList.remove('open');
        location.href = '#dashboard';
        switchDashboardTab('bookings');
      };
    }
  }

  function updateCheckoutStepView(stepNum) {
    state.checkout.step = stepNum;

    for (let i = 1; i <= 4; i++) {
      const pane = document.getElementById(`checkoutPane${i}`);
      const stepNode = document.getElementById(`cStep${i}`);
      if (pane) pane.classList.toggle('active', i === stepNum);
      if (stepNode) stepNode.classList.toggle('active', i === stepNum);
    }

    if (stepNum === 3) recalculateCheckoutTotal();
  }

  function recalculateCheckoutTotal() {
    if (!state.checkout.item) return;

    const base = state.checkout.item.basePrice;
    let addons = 0;
    if (document.getElementById('addonTransfer')?.checked) addons += 180;
    if (document.getElementById('addonInsurance')?.checked) addons += 85;
    if (document.getElementById('addonCarbon')?.checked) addons += 25;

    const discount = 250;
    const grandTotal = base + addons - discount;

    const basePriceEl = document.getElementById('orderBasePrice');
    const addonsPriceEl = document.getElementById('orderAddonsPrice');
    const discountPriceEl = document.getElementById('orderDiscountPrice');
    const grandTotalEl = document.getElementById('orderGrandTotal');

    if (basePriceEl) basePriceEl.textContent = formatPrice(base);
    if (addonsPriceEl) addonsPriceEl.textContent = formatPrice(addons);
    if (discountPriceEl) discountPriceEl.textContent = `-${formatPrice(discount)}`;
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(grandTotal);
  }

  function processCheckoutAuthorization() {
    const authBtn = document.getElementById('chkAuthorizePaymentBtn');
    if (authBtn) {
      authBtn.disabled = true;
      authBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authorizing VIP Guarantee...';
    }

    setTimeout(() => {
      if (authBtn) {
        authBtn.disabled = false;
        authBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Authorize & Confirm Booking';
      }

      // Generate unique PNR
      const pnr = 'AUR-' + Math.floor(1000 + Math.random() * 9000) + '-VIP';
      const item = state.checkout.item;

      // Add to bookings
      state.bookings.unshift({
        id: pnr,
        type: item.type,
        title: item.title,
        dates: item.dates,
        guests: 2,
        price: item.totalPrice,
        status: 'upcoming',
        image: item.image
      });
      saveBookings();

      // Populate confirmation
      const pnrVal = document.getElementById('confPnrVal');
      const confTitle = document.getElementById('confItemTitle');
      const confSub = document.getElementById('confItemSub');
      const confTotal = document.getElementById('confTotalPaid');

      if (pnrVal) pnrVal.textContent = pnr;
      if (confTitle) confTitle.textContent = item.title;
      if (confSub) confSub.textContent = item.subtitle;
      if (confTotal) confTotal.textContent = `${formatPrice(item.totalPrice)} ${state.activeCurrency.code}`;

      updateCheckoutStepView(4);
      showToast('Booking Confirmed', `Reference ${pnr} dispatched to your concierge.`, 'info');
    }, 900);
  }

  /* ==========================================================================
     AUTHENTICATION & SESSIONS
     ========================================================================== */

  function setupAuthModal() {
    const openBtn = document.getElementById('openAuthBtn');
    const modal = document.getElementById('authModalBackdrop');
    const demoBtn = document.getElementById('demoLoginBtn');
    const tabLogin = document.getElementById('authTabLogin');
    const tabRegister = document.getElementById('authTabRegister');
    const nameGroup = document.getElementById('authNameGroup');
    const submitBtn = document.getElementById('authSubmitBtn');

    if (openBtn && modal) {
      openBtn.onclick = () => {
        if (state.activeUser.isLoggedIn) {
          location.href = '#dashboard';
          switchDashboardTab('overview');
        } else {
          modal.classList.add('open');
        }
      };
    }

    if (tabLogin && tabRegister) {
      tabLogin.onclick = () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'none';
        if (submitBtn) submitBtn.textContent = 'Sign In to Aurora';
      };
      tabRegister.onclick = () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        if (nameGroup) nameGroup.style.display = 'block';
        if (submitBtn) submitBtn.textContent = 'Join The Collective';
      };
    }

    if (demoBtn) {
      demoBtn.onclick = () => {
        state.activeUser.isLoggedIn = true;
        state.activeUser.name = 'Alexander Wright';
        state.activeUser.tier = 'Black Diamond Tier';
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.activeUser));
        updateNavUserDisplay();
        if (modal) modal.classList.remove('open');
        showToast('Welcome, Alexander', 'Logged in as Black Diamond Member.', 'info');
      };
    }

    updateNavUserDisplay();
  }

  function handleAuthSubmit() {
    const email = document.getElementById('authEmailInput')?.value;
    const nameInput = document.getElementById('authFullNameInput')?.value;
    const modal = document.getElementById('authModalBackdrop');

    state.activeUser.isLoggedIn = true;
    if (nameInput) state.activeUser.name = nameInput;
    if (email) state.activeUser.email = email;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.activeUser));
    updateNavUserDisplay();
    if (modal) modal.classList.remove('open');
    showToast('Signed In Successfully', `Welcome back to Aurora, ${state.activeUser.name}.`, 'info');
  }

  function updateNavUserDisplay() {
    const userNameLabel = document.getElementById('navUserName');
    const navAvatar = document.getElementById('navAvatar');
    const dashName = document.getElementById('dashUsernameDisplay');
    const dashGreeting = document.getElementById('dashGreetingName');

    if (state.activeUser.isLoggedIn) {
      if (userNameLabel) userNameLabel.textContent = state.activeUser.name.split(' ')[0];
      if (navAvatar) navAvatar.innerHTML = `<img src="${state.activeUser.avatar}" alt="${state.activeUser.name}">`;
      if (dashName) dashName.textContent = state.activeUser.name;
      if (dashGreeting) dashGreeting.textContent = state.activeUser.name.split(' ')[0];
    } else {
      if (userNameLabel) userNameLabel.textContent = 'Sign In';
      if (navAvatar) navAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
    }
  }

  /* ==========================================================================
     GLOBAL MODAL BACKDROP CONTROLS
     ========================================================================== */

  function setupModalsGlobal() {
    const backdrops = document.querySelectorAll('.modal-backdrop');

    backdrops.forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.modal-backdrop');
        if (backdrop) backdrop.classList.remove('open');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        backdrops.forEach(b => b.classList.remove('open'));
      }
    });
  }

  function handleNewsletterSubscribe() {
    const input = document.getElementById('newsletterEmailInput');
    if (!input || !input.value) return;
    showToast('Privilege Dispatch Confirmed', `Confidential invitations will be sent to ${input.value}.`, 'info');
    input.value = '';
  }

  /* ==========================================================================
     TOAST NOTIFICATION DISPATCHER
     ========================================================================== */

  function showToast(title, desc, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid ${type === 'info' ? 'fa-crown' : 'fa-circle-check'}"></i>
      </div>
      <div class="toast-body">
        <strong class="toast-title">${title}</strong>
        <span class="toast-desc">${desc}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  /* ==========================================================================
     UTILITIES
     ========================================================================== */

  function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /* ==========================================================================
     EXPOSE PUBLIC API ON WINDOW
     ========================================================================== */

  window.AuroraApp = {
    handleMainSearch,
    handleFlightFilter,
    resetDestFilters,
    resetStayFilters,
    openDestModal,
    openStayModal,
    switchStayThumb,
    selectRoomOption,
    selectFlightBooking,
    bookExperience,
    bookPackage,
    toggleFavorite,
    addActivityPrompt,
    deleteActivity,
    openMapPopup,
    openArticleModal,
    likeStory,
    handleStorySubmit,
    handleAuthSubmit,
    handleNewsletterSubscribe,
    cancelBooking,
    viewSavedItinerary,
    deleteSavedItinerary,
    saveProfileSettings
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
