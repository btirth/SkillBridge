/**
 * @author Om Anand (B00947378)
 */
import express from 'express'
import jobService from '../services/jobService'
import logger from '../utils/logger'

const jobRouter = express.Router()

jobRouter.get('/', (_request, response) => {
    jobService.getAll().then(jobs => response.send(jobs))
        .catch(
            error => logger.error("Unable to fetch jobs", error)
        )
})

jobRouter.get('/:id', (request, response) => {
    const jobId: string = request.params.id;
    jobService
        .getJob(jobId).then(jobs => {
            if (jobs === null) {
                response.status(404).send({ error: 'Not found!' })
            }
            else {
                response.send(jobs)
            }
        })
        .catch(
            error => logger.error("Unable to fetch job", error)
        )
})

jobRouter.post('/create', (request, response) => {
    const newJobEntry = request.body
    jobService.addJob(newJobEntry)
        .then(
            addedEntry => response.json(addedEntry)
        ).catch(
            error => logger.error("Unable to add job", newJobEntry, error)
        )
})

jobRouter.delete('/:id', (request, response) => {
    jobService
        .deleteJob(request.params.id)
        .then(
            deletedJob => {
                if (deletedJob == undefined) {
                    return response.status(404).send({ error: 'Not found!' })
                }
                return response.send({
                    message: "Job deleted"
                })
            }
        )
        .catch(
            error => console.error("Unable to delete job", request.params.id, error)
        )
})

export default jobRouter
