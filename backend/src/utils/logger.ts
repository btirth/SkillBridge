/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const info = (...params: any[]) => {
    console.log(...params)
}

const error = (...params: any[]) => {
    console.error(...params)
}

export default {
    info, error
}