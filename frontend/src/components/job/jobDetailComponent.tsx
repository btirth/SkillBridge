import React from 'react'

import { Typography, Grid, Box, Paper } from '@mui/material'
import { NewJobData, experienceLevels, jobTypes, locationProvinces } from '../../models/jobs.model'
1

interface JobDetailProps {
    job: NewJobData
}


const JobDetailComponent: React.FC<JobDetailProps> = ({ job }) => {
    return (
        <Paper style={{ padding: '20px' }}>
            <Typography component={'span'} variant="h6" gutterBottom align="center">
                {job.title}
            </Typography>
            <Grid item xs={12} >
                <Grid container justifyContent="space-evenly" display="flex" alignItems="center">
                    <Grid item >
                        <Typography component={'span'} variant="body1" gutterBottom style={{ wordWrap: "break-word" }}>
                            <strong>Location</strong>
                            <Box>{job.city},{locationProvinces[job.province as unknown as keyof typeof locationProvinces]}</Box>
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Typography component={'span'} variant="body1" gutterBottom style={{ wordWrap: "break-word" }}>
                            <strong>Experience</strong>
                            <Box>{experienceLevels[job.experienceLevel as unknown as keyof typeof experienceLevels]}</Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography component={'span'} variant="body1" gutterBottom style={{ wordWrap: "break-word" }}>
                            <strong>Type</strong>
                            <Box>{jobTypes[job.type as unknown as keyof typeof jobTypes]}</Box>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <Typography component={'span'} variant="body1" gutterBottom style={{ wordWrap: "break-word" }}>
                        <strong>Description</strong>
                        <Box>{job.description}</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component={'span'} variant="body1" gutterBottom>
                        <strong>Create Date</strong>
                        <Box>{new Date(job.createDate).toLocaleDateString()}</Box>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component={'span'} variant="body1" gutterBottom style={{ wordWrap: "break-word" }}>
                        <strong>Company Details</strong>
                        <Box>{job.companyDetails}</Box>
                    </Typography>
                </Grid>

            </Grid>
        </Paper>
    )
}

export default JobDetailComponent
