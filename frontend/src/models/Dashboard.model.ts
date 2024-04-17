import { JobModel } from "./jobs.model";

export interface DashboardJobs {
  isLoading: boolean;
  data: JobModel[];
}

export interface DashboardNews {
  isLoading: boolean;
  data: DashboardNewsItem[];
}

export interface DashboardNewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}
