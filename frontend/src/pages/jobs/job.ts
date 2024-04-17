/**
 * @author Om Anand (B00947378)
 */
import axios from "axios"
import { NewJobData } from "../../models/jobs.model"

const BASE_URL = import.meta.env.VITE_BASE_URL
const JOB_URL = `${BASE_URL}/job`

export const createJob = async (newJobData: NewJobData) => {
    const url = `${JOB_URL}/create`
    return await axios.post(url, newJobData)
}

export const getAllJobs = async () => {
    const url = `${JOB_URL}/`
    return await axios.get(url)
}

export const getJob = async (jobId: string) => {
    const url = `${JOB_URL}/${jobId}`
    return await axios.get(url)
}

export const deleteJob = async (jobId: string) => {
    const url = `${JOB_URL}/${jobId}`
    return await axios.delete(url)
}