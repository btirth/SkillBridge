/**
 * @author Om Anand (B00947378)
 */
import  JobModel  from '../models/job'
import { Job, NewJobData } from '../types'
import { v4 as uuidv4 } from 'uuid';

const getAll = async (): Promise<Array<Job>> => {
    return await JobModel.find({});
}

const getJob = async (jobId: string): Promise<Job | null> => {
    return await JobModel.findOne({id: jobId}).exec()
}

const addJob = async (entry: NewJobData): Promise<Job> => {
    const newJobEntry = {
        id: uuidv4(),
        ...entry
    };
    const job = new JobModel(newJobEntry)
    await job.save()
    return job
}

const deleteJob = async (jobId: string): Promise<Job | null> => {
    return await JobModel.findOneAndDelete({id: jobId})
}


export default {
    getAll,
    getJob,
    addJob,
    deleteJob
}
