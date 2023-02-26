// IGDB API response
export type IGame = {
  id: number;
  name: string;
  cover: {
    id: number;
    url: string;
  };
  genres: {
    id: number;
    name: string;
  }[];
  platforms: {
    id: number;
    name: string;
  }[];
  summary: string;
  release_dates: {
    human: string;
  }[];
  aggregated_rating?: number;
  aggregated_rating_count?: number;
  game_modes: {
    name: string;
  }[];
  involved_companies: {
    id: number;
    company: {
      id: number;
      name: string;
      logo?: {
        id: number;
        url: string;
      };
      websites?: {
        url: string;
      }[];
    };
    developer: boolean;
    publisher: boolean;
  }[];
  videos?: {
    id: number;
    video_id: string;
  }[];
};

// RAWG API response
export type RGame = {
  count: number;
  next: string;
  previous: string;
  results: RGameResult[];
};

export type RGameResult = {
  id: number;
  slug: string;
  name: string;
  released: string;
  clip: string | null;
  dominant_color: string;
  genres: {
    id: number;
    name: string;
    slug: string;
  }[];
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: {
    id: number;
    title: string;
    count: number;
    percent: number;
  }[];
  ratings_count: number;
  reviews_text_count: string;
  added: number;
  added_by_status: {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
  };
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: string;
  esrb_rating: {
    id: number;
    slug: string;
    name: string;
  } | null;
  platforms: {
    platform: {
      id: number;
      slug: string;
      name: string;
    };
    released_at: string;
    requirements: {
      minimum: string;
      recommended: string;
    };
  }[];
  stores?: {
    store: {
      id: number;
      slug: string;
      name: string;
    };
  }[];
};

// OpenAI response
export type OGame = {
  name?: string;
  description?: string;
};
