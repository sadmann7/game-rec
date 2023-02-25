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
  aggregated_rating: number;
  aggregated_rating_count: number;
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
      websites: {
        url: string;
      }[];
    };
    developer: boolean;
    publisher: boolean;
  }[];
  videos: {
    id: number;
    video_id: string;
  }[];
};
