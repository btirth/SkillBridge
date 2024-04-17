import axios from 'axios';

export const APP_TITLE = "SkillBridge";

export default axios.create({
    baseURL: "http://localhost:8000/"
})