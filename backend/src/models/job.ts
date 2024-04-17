/**
 * @author Om Anand (B00947378)
 */
import { Schema, model } from 'mongoose'
import { Job } from '../types'

const jobSchema = new Schema<Job>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyDetails: { type: String, required: true },
    createDate: { type: Date, required: true },
    experienceLevel: { type: String, required: true },
    type: { type: String, required: true },
    userId: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
})

const JobModel = model<Job>('Job', jobSchema)

export default JobModel
