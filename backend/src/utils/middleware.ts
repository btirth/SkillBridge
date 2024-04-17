import morgan from 'morgan';
import logger from './logger'
import { ErrorRequestHandler, RequestHandler } from 'express';

const morganMiddleWare = morgan('tiny')

const unknownEndpoint: RequestHandler = (_request, response, _next) => {
    return response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler: ErrorRequestHandler = (error: Error, _request, response, _next) => {
    logger.error(error.message)
    return response.status(500).send()
}

export default {
    morganMiddleWare, unknownEndpoint, errorHandler
}