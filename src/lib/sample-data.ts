// Sample property data for Chennai - Real addresses with coordinates
export const sampleProperties = [
  {
    id: "1",
    title: "Luxury Villa in Besant Nagar Beach Road",
    description: "Stunning 4-bedroom independent villa just 200m from Elliot Beach with modern amenities, garden, and premium finishes.",
    address: "15, 6th Avenue, Besant Nagar Beach Road",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600090",
    latitude: 12.9989,
    longitude: 80.2668,
    price: 18500000,
    propertyType: "HOUSE",
    status: "FOR_SALE",
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3200,
    yearBuilt: 2019,
    features: {
      amenities: ["Beach Proximity", "Private Garden", "Solar Panels", "Security System"],
      parking: "3 Car Parking",
      heating: "Central AC",
      flooring: "Italian Marble"
    },
    images: [
      {
        url: "https://picsum.photos/400/300?random=1",
        alt: "Luxury villa exterior with landscaped garden in Besant Nagar",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop&crop=center", 
        alt: "Spacious living room with premium marble flooring",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&crop=center",
        alt: "Modern kitchen with granite countertops and island",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&crop=center",
        alt: "Master bedroom with balcony overlooking garden",
        isPrimary: false
      }
    ],
    owner: {
      name: "Rajesh Kumar",
      email: "rajesh@chennairealty.com"
    },
    slug: "luxury-villa-besant-nagar-beach-road",
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Premium Apartment in Express Avenue Mall Area",
    description: "3BHK luxury apartment with mall connectivity, metro access, and modern amenities in Royapettah.",
    address: "24, Whites Road, Near Express Avenue Mall",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600014",
    latitude: 13.0569,
    longitude: 80.2623,
    price: 12500000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1850,
    yearBuilt: 2020,
    features: {
      amenities: ["Metro Access", "Mall Connectivity", "Gym", "Swimming Pool", "24/7 Security"],
      parking: "2 Car Parking",
      heating: "Central AC",
      flooring: "Vitrified Tiles"
    },
    images: [
      {
        url: "https://picsum.photos/400/300?random=2",
        alt: "Modern 3BHK apartment living room with city skyline view",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&h=800&fit=crop&crop=center",
        alt: "Contemporary modular kitchen with breakfast counter",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center",
        alt: "Spacious master bedroom with built-in wardrobes",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&crop=center",
        alt: "Modern bathroom with premium fixtures",
        isPrimary: false
      }
    ],
    owner: {
      name: "Priya Sharma",
      email: "priya@chennaihomes.com"
    },
    slug: "premium-apartment-express-avenue-mall",
    createdAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "IT Corridor Villa in OMR Sholinganallur",
    description: "Contemporary 5BHK villa in gated community along Old Mahabalipuram Road, perfect for IT professionals.",
    address: "78, Rajiv Gandhi Salai (OMR), Sholinganallur",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600119",
    latitude: 12.8956,
    longitude: 80.2278,
    price: 22000000,
    propertyType: "HOUSE",
    status: "FOR_SALE",
    bedrooms: 5,
    bathrooms: 5,
    squareFeet: 4200,
    yearBuilt: 2021,
    features: {
      amenities: ["IT Corridor", "Gated Community", "Club House", "Swimming Pool", "Children's Play Area"],
      parking: "4 Car Parking",
      heating: "Central AC",
      flooring: "Imported Marble"
    },
    images: [
      {
        url: "https://picsum.photos/400/300?random=3",
        alt: "5BHK contemporary villa in IT corridor gated community",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop&crop=center",
        alt: "Spacious master suite with private balcony",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop&crop=center",
        alt: "Double height living room with imported marble flooring",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop&crop=center",
        alt: "Private swimming pool and landscaped garden",
        isPrimary: false
      }
    ],
    owner: {
      name: "Suresh Nagarajan",
      email: "suresh@omrproperties.com"
    },
    slug: "it-corridor-villa-omr-sholinganallur",
    createdAt: new Date("2024-02-01")
  },
  {
    id: "4",
    title: "Compact 2BHK in Anna Nagar Main Road", 
    description: "Well-designed 2BHK apartment in prestigious Anna Nagar with excellent connectivity and amenities.",
    address: "156, Anna Nagar 2nd Avenue, Anna Nagar West",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600040",
    latitude: 13.0850,
    longitude: 80.2101,
    price: 8500000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    yearBuilt: 2018,
    features: {
      amenities: ["Prime Location", "Metro Access", "Shopping Centers Nearby", "Covered Parking"],
      parking: "1 Car Parking",
      heating: "Split AC", 
      flooring: "Vitrified Tiles"
    },
    images: [
      {
        url: "https://picsum.photos/400/300?random=4",
        alt: "Well-designed 2BHK apartment in prestigious Anna Nagar",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&crop=center",
        alt: "Modern kitchen with breakfast counter and storage",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&h=800&fit=crop&crop=center",
        alt: "Spacious living area with ample natural light",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&crop=center",
        alt: "Contemporary bathroom with premium fittings",
        isPrimary: false
      }
    ],
    owner: {
      name: "Meera Krishnan",
      email: "meera@annanagarhomes.com"
    },
    slug: "compact-2bhk-anna-nagar-main-road",
    createdAt: new Date("2024-01-25")
  },
  {
    id: "5",
    title: "Beachfront Apartment in Marina Beach Road",
    description: "Spectacular 3BHK apartment with direct marina beach views and premium amenities in Triplicane.",
    address: "45, Kamarajar Salai, Marina Beach Road",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600005", 
    latitude: 13.0524,
    longitude: 80.2849,
    price: 16500000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2100,
    yearBuilt: 2020,
    features: {
      amenities: ["Marina Beach Views", "Sea Breeze", "Premium Finishes", "Gymnasium", "Rooftop Garden"],
      parking: "2 Car Parking",
      heating: "Central AC",
      flooring: "Italian Marble"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&crop=center",
        alt: "Spectacular 3BHK apartment with direct Marina Beach views",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop&crop=center",
        alt: "Private balcony with panoramic marina beach views",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=800&fit=crop&crop=center",
        alt: "Premium living room with sea-facing windows",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&crop=center",
        alt: "Modern dining area with city and sea views",
        isPrimary: false
      }
    ],
    owner: {
      name: "Lakshmi Iyer",
      email: "lakshmi@marinaproperties.com"
    },
    slug: "beachfront-apartment-marina-beach-road",
    createdAt: new Date("2024-02-10")
  },
  {
    id: "6",
    title: "Modern Flat in Velachery IT Hub",
    description: "Brand new 2BHK apartment in Velachery with proximity to IT companies and metro connectivity.",
    address: "89, Velachery Main Road, Near Phoenix MarketCity",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600042",
    latitude: 12.9790,
    longitude: 80.2207,
    price: 7200000,
    propertyType: "APARTMENT",
    status: "FOR_SALE", 
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1100,
    yearBuilt: 2023,
    features: {
      amenities: ["IT Hub Location", "Metro Access", "Brand New", "Mall Nearby", "Ready to Move"],
      parking: "1 Car Parking",
      heating: "Split AC",
      flooring: "Granite & Tiles"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&crop=center",
        alt: "Brand new 2BHK apartment in Velachery IT hub",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=800&fit=crop&crop=center",
        alt: "Contemporary bedroom with modern interiors",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&h=800&fit=crop&crop=center",
        alt: "Fully equipped modern kitchen with appliances",
        isPrimary: false
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&h=800&fit=crop&crop=center",
        alt: "Spacious living area ready for immediate occupancy",
        isPrimary: false
      }
    ],
    owner: {
      name: "Arjun Reddy",
      email: "arjun@velacheryproperties.com"
    },
    slug: "modern-flat-velachery-it-hub",
    createdAt: new Date("2024-02-20")
  },
  {
    id: "7",
    title: "Heritage Bungalow in Chetpet",
    description: "Beautifully restored colonial-era bungalow with modern amenities in peaceful Chetpet neighborhood.",
    address: "28, Dr. Nair Road, Chetpet",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600031",
    latitude: 13.0732,
    longitude: 80.2378,
    price: 14000000,
    propertyType: "HOUSE",
    status: "FOR_SALE",
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 1950,
    features: {
      amenities: ["Heritage Property", "Large Garden", "Original Architecture", "Central Location", "Peaceful Area"],
      parking: "2 Car Parking",
      heating: "Window AC",
      flooring: "Traditional Tiles & Teakwood"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?w=800&h=600&fit=crop",
        alt: "Colonial heritage bungalow with garden",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        alt: "Traditional architecture with modern comforts",
        isPrimary: false
      }
    ],
    owner: {
      name: "Colonel Ramesh",
      email: "ramesh@heritagehomes.com"
    },
    slug: "heritage-bungalow-chetpet",
    createdAt: new Date("2024-01-20")
  },
  {
    id: "8",
    title: "Luxury Penthouse in Nungambakkam",
    description: "Exclusive 4BHK penthouse with panoramic city views, private terrace, and premium amenities.",
    address: "67, Khader Nawaz Khan Road, Nungambakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600034",
    latitude: 13.0594,
    longitude: 80.2430,
    price: 25000000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3500,
    yearBuilt: 2022,
    features: {
      amenities: ["Penthouse", "City Views", "Private Terrace", "Premium Location", "Concierge Service"],
      parking: "3 Car Parking",
      heating: "Ducted AC",
      flooring: "Imported Italian Marble"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
        alt: "Luxury penthouse living area with city views",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        alt: "Private terrace with skyline views",
        isPrimary: false
      }
    ],
    owner: {
      name: "Vikram Malhotra",
      email: "vikram@luxuryproperties.com"
    },
    slug: "luxury-penthouse-nungambakkam",
    createdAt: new Date("2024-02-12")
  },
  {
    id: "9",
    title: "Family Villa in ECR Akkarai",
    description: "3BHK independent villa along East Coast Road with sea breeze and modern amenities.",
    address: "123, East Coast Road, Akkarai",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600119",
    latitude: 12.8472,
    longitude: 80.2446,
    price: 11500000,
    propertyType: "HOUSE",
    status: "FOR_SALE",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2200,
    yearBuilt: 2020,
    features: {
      amenities: ["ECR Location", "Sea Breeze", "Independent Villa", "Garden", "Peaceful Environment"],
      parking: "2 Car Parking",
      heating: "Split AC",
      flooring: "Granite & Marble"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
        alt: "Coastal villa with modern design",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
        alt: "Villa garden with outdoor seating",
        isPrimary: false
      }
    ],
    owner: {
      name: "Deepa Rajan",
      email: "deepa@ecrproperties.com"
    },
    slug: "family-villa-ecr-akkarai",
    createdAt: new Date("2024-02-08")
  },
  {
    id: "10",
    title: "Budget Apartment in Chromepet",
    description: "Affordable 2BHK apartment in Chromepet with good connectivity and basic amenities.",
    address: "34, GST Road, Near Chromepet Railway Station",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600044",
    latitude: 12.9516,
    longitude: 80.1462,
    price: 4500000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 950,
    yearBuilt: 2017,
    features: {
      amenities: ["Budget Friendly", "Railway Station Nearby", "Good Connectivity", "Basic Amenities"],
      parking: "1 Car Parking",
      heating: "Window AC",
      flooring: "Ceramic Tiles"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop",
        alt: "Affordable apartment with good layout",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Compact kitchen and dining area",
        isPrimary: false
      }
    ],
    owner: {
      name: "Ganesan Murthy",
      email: "ganesan@budgethomes.com"
    },
    slug: "budget-apartment-chromepet",
    createdAt: new Date("2024-01-30")
  },
  {
    id: "11",
    title: "Luxury Row House in Porur",
    description: "Premium 3BHK row house in gated community with modern amenities and excellent connectivity.",
    address: "45, Kundrathur Main Road, Porur",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600116",
    latitude: 13.0381,
    longitude: 80.1564,
    price: 9800000,
    propertyType: "TOWNHOUSE",
    status: "FOR_SALE",
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1800,
    yearBuilt: 2021,
    features: {
      amenities: ["Gated Community", "Row House", "Club House", "Children's Play Area", "IT Corridor Access"],
      parking: "2 Car Parking",
      heating: "Split AC",
      flooring: "Granite & Tiles"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop",
        alt: "Modern row house with front garden",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1600566753051-6057c2ec317d?w=800&h=600&fit=crop",
        alt: "Contemporary interior design",
        isPrimary: false
      }
    ],
    owner: {
      name: "Karthik Subramanian",
      email: "karthik@porurproperties.com"
    },
    slug: "luxury-row-house-porur",
    createdAt: new Date("2024-02-03")
  },
  {
    id: "12",
    title: "Serviced Apartment in T. Nagar",
    description: "Fully furnished 1BHK serviced apartment in commercial hub T. Nagar with hotel-like amenities.",
    address: "78, Usman Road, T. Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600017",
    latitude: 13.0418,
    longitude: 80.2341,
    price: 6200000,
    propertyType: "APARTMENT",
    status: "FOR_RENT",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 650,
    yearBuilt: 2019,
    features: {
      amenities: ["Fully Furnished", "Commercial Area", "Shopping District", "Metro Access", "Housekeeping Service"],
      parking: "No Parking",
      heating: "Window AC",
      flooring: "Laminate Flooring"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        alt: "Fully furnished serviced apartment",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        alt: "Modern kitchenette with appliances",
        isPrimary: false
      }
    ],
    owner: {
      name: "Suresh Hotels Pvt Ltd",
      email: "booking@sureshserviced.com"
    },
    slug: "serviced-apartment-t-nagar",
    createdAt: new Date("2024-02-15")
  },
  {
    id: "13",
    title: "Spacious 3BHK in Adyar",
    description: "Well-ventilated 3BHK apartment in prestigious Adyar locality with park views and premium amenities.",
    address: "127, 5th Main Road, Gandhi Nagar, Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600020",
    latitude: 13.0067,
    longitude: 80.2206,
    price: 13500000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1650,
    yearBuilt: 2018,
    features: {
      amenities: ["Park Views", "Premium Location", "Well Ventilated", "Lift", "Generator Backup"],
      parking: "2 Car Parking",
      heating: "Split AC",
      flooring: "Marble & Granite"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800&h=600&fit=crop",
        alt: "Spacious apartment with park views",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Well-designed living area",
        isPrimary: false
      }
    ],
    owner: {
      name: "Radhika Krishnamurthy",
      email: "radhika@adyarhomes.com"
    },
    slug: "spacious-3bhk-adyar",
    createdAt: new Date("2024-01-18")
  },
  {
    id: "14",
    title: "Commercial Space in Mount Road",
    description: "Prime commercial property in Mount Road business district, ideal for offices, showrooms, or retail.",
    address: "89, Anna Salai (Mount Road), Near LIC Building",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600002",
    latitude: 13.0634,
    longitude: 80.2547,
    price: 45000000,
    propertyType: "COMMERCIAL",
    status: "FOR_SALE",
    bedrooms: 0,
    bathrooms: 4,
    squareFeet: 3500,
    yearBuilt: 2015,
    features: {
      amenities: ["Prime Location", "Business District", "Metro Access", "High Footfall", "Modern Facilities"],
      parking: "10 Car Parking",
      heating: "Central AC",
      flooring: "Commercial Granite"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        alt: "Modern commercial building exterior",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        alt: "Professional office interior",
        isPrimary: false
      }
    ],
    owner: {
      name: "Chennai Commercial Ventures",
      email: "info@ccvproperties.com"
    },
    slug: "commercial-space-mount-road",
    createdAt: new Date("2024-02-25")
  },
  {
    id: "15",
    title: "Studio Apartment in Mylapore",
    description: "Cozy studio apartment in cultural heart of Mylapore, perfect for singles or young couples.",
    address: "56, Kutchery Road, Near Kapaleeshwarar Temple, Mylapore",
    city: "Chennai",
    state: "Tamil Nadu",
    zipCode: "600004",
    latitude: 13.0339,
    longitude: 80.2619,
    price: 3800000,
    propertyType: "APARTMENT",
    status: "FOR_SALE",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 450,
    yearBuilt: 2019,
    features: {
      amenities: ["Cultural Area", "Temple Nearby", "Traditional Locality", "Good Connectivity", "Compact Design"],
      parking: "No Parking",
      heating: "Ceiling Fan",
      flooring: "Ceramic Tiles"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "Cozy studio apartment layout",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        alt: "Compact kitchen area",
        isPrimary: false
      }
    ],
    owner: {
      name: "Bala Subramanian",
      email: "bala@mylaporeflats.com"
    },
    slug: "studio-apartment-mylapore",
    createdAt: new Date("2024-01-22")
  }
];

export const sampleUsers = [
  {
    id: "admin-1",
    email: "admin@realtywebsite.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
    createdAt: new Date("2025-11-01")
  },
  {
    id: "agent-1", 
    email: "agent@realtywebsite.com",
    password: "agent123",
    name: "Rajesh Kumar",
    role: "AGENT",
    createdAt: new Date("2025-11-01")
  },
  {
    id: "user-1",
    email: "user@realtywebsite.com", 
    password: "user123",
    name: "Priya Sharma",
    role: "USER",
    createdAt: new Date("2025-11-01")
  },
  {
    id: "broker-1", 
    email: "sarah@realtywebsite.com",
    password: "broker123",
    name: "Sarah Johnson",
    role: "BROKER",
    createdAt: new Date("2025-11-01")
  }
];

export const sampleInquiries = [
  {
    id: "1",
    name: "Arun Kumar",
    email: "arun.kumar@gmail.com",
    phone: "+91 98400 12345",
    message: "I'm interested in the Besant Nagar villa. Could we schedule a viewing this weekend? Looking for a family home near the beach.",
    status: "PENDING",
    propertyId: "1",
    createdAt: new Date("2024-12-01")
  },
  {
    id: "2", 
    name: "Preethi Sharma",
    email: "preethi.sharma@techcorp.com",
    phone: "+91 99400 98765",
    message: "Working in IT sector and looking for apartment near Express Avenue Mall. The Royapettah property seems ideal for metro connectivity.",
    status: "RESPONDED",
    propertyId: "2", 
    createdAt: new Date("2025-11-30")
  }
];