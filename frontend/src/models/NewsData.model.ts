export interface NewsDataApiResponseinterface {
  status: "success" | "error";
  totalResults?: number;
  article_id?: string;
  title?: string;
  link?: string;
  source_id?: string;
  source_url?: string;
  source_icon?: string;
  source_priority?: number;
  keywords?: string[];
  creator?: string;
  image_url?: string;
  video_url?: string;
  description?: string;
  pubDate?: string;
  content?: string;
  country?: string;
  category?: string;
  language?: string;
  ai_tag?: string[];
  sentiment?: "positive" | "negative" | "neutral";
  sentiment_stats?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  ai_region?: string;
  nextPage?: string;
  code?: string; // Included as part of the error response
  message?: string; // Included as part of the error response
}
