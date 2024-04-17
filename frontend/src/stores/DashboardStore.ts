import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { DashboardJobs, DashboardNews } from "../models/Dashboard.model";
import { getAllJobs } from "../pages/jobs/job";
import axios from "axios";
import { NewsDataApiResponseinterface } from "../models/NewsData.model";

export class DashboardStore {
  rootStore: RootStore;
  jobs: DashboardJobs = {
    isLoading: false,
    data: [],
  };
  news: DashboardNews = {
    isLoading: false,
    data: [],
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async getDashboardJobs() {
    this.jobs.isLoading = true;
    this.jobs.data = await getAllJobs()
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.error("Unable to fetch jobs", error);
        return [];
      });
    this.jobs.isLoading = false;
  }

  async getDashboardNews() {
    this.news.isLoading = true;
    const apiKey = "pub_4091311458d0a1bcc6f15104f92ec11e7ac1c";
    const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=business&size=3&language=en`;
    try {
      const response = await axios.get(apiUrl);

      if (response.data && response.data.results) {
        this.news.data = response.data.results.map(
          (newsItem: NewsDataApiResponseinterface) => {
            return {
              title: newsItem.title,
              description: newsItem.description,
              link: newsItem.link,
              pubDate: newsItem.pubDate,
            };
          }
        );
        this.news.isLoading = false;
      }
    } catch (error) {
      console.log("Error while fetching news: ", error);
      this.news.data = [];
      this.news.isLoading = false;
    }
    this.news.isLoading = false;
  }
}
