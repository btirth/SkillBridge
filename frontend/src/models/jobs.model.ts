/**
 * @author Om Anand (B00947378)
 */
export enum experienceLevels {
    internship = "Internship",
    entry = "Entry",
    associate = "Associate",
    senior = "Senior",
    director = "Director",
    executive = "Executive",
}

export enum jobTypes {
    partTime = "Part-time",
    fullTime = "Full-time",
    contract = "Contract",
    internship = "Internship",
}

export enum locationProvinces {
    ON = "Ontario",
    BC = "British Columbia",
    QC = "Quebec",
    AB = "Alberta",
    MB = "Manitoba",
    SK = "Saskatchewan",
    NS = "Nova Scotia",
    NB = "New Brunswick",
    NL = "Newfoundland and Labrador",
    PE = "Prince Edward Island",
    YT = "Yukon",
    NT = "Northwest Territories",
    NU = "Nunavut",
}

export interface JobModel {
    id: string
    title: string
    description: string
    companyDetails: string
    createDate: Date
    experienceLevel: experienceLevels
    type: jobTypes
    userId: string
    city: string
    province: locationProvinces
}

export type NewJobData = Omit<JobModel, 'id' >

export type NewJobErrorData = {
    [P in keyof NewJobData]: string
}