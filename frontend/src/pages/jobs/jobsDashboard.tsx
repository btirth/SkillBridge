/**
 * @author Om Anand (B00947378)
 */
import React, { useEffect, useState } from 'react'
import Job from '../../components/job/jobCard'
import { useNavigate } from 'react-router-dom'
import { Box, Button, CircularProgress, Grid, SelectChangeEvent, Stack, Switch, Typography } from '@mui/material'
import Search from '../../components/job/jobSearch'
import { JobModel, experienceLevels, jobTypes, locationProvinces } from '../../models/jobs.model'
import { getAllJobs } from './job'
import { InputSelect } from '../../components/inputs/select'

export type filter = {
    province: string,
    experienceLevel: string,
    jobType: string,
}

const JobsDashboard: React.FC = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState<JobModel[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filter, setFilter] = useState<filter>({
        province: "",
        experienceLevel: "",
        jobType: "",
    })
    const [showMyJobs, setShowMyJobs] = useState<boolean>(false);
    const [userId, setUserId] = useState("");
    const [isLoading, setLoading] = useState(false);

    const getJobs = () => {
        getAllJobs()
            .then((response) => {
                if (response.status === 200) {
                    setJobs(response.data)
                }
            })
            .catch((error) => console.error("Unable to update jobs", error))

    }

    useEffect(() => {
        setLoading(true)
        getJobs()
        const storedUserId = sessionStorage.getItem("userId")!;
        setUserId(storedUserId);
        setLoading(false)
    }, [])


    // Function to handle changes in the search term
    const handleSearchChange = (searchTerm: string) => {
        setSearchTerm(searchTerm)
    }

    // function to update the user inputs
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>,
        field: string
    ) => {
        const value = event.target.value
        setFilter((prevFilter) => ({
            ...prevFilter,
            [field]: value,
        }))
    }

    // Filtering job data based on search term and location
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
        && (filter.province === '' || job.province === filter.province)
        && (filter.experienceLevel === '' || job.experienceLevel === filter.experienceLevel)
        && (filter.jobType === '' || job.type === filter.jobType)
        && ((showMyJobs ? job.userId === userId : true))
    )

    // Function to handle job click event, navigate to job details page
    const handleJobClick = (jobId: string) => {
        navigate(`/jobs/${jobId}`)
    }

    // Function to navigate to create job page
    const handleCreateJobClick = () => {
        navigate('/jobs/new');
    };

    return (
        <>
            <Grid container spacing={2} sx={{ padding: "10px" }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between">
                        <Typography variant="h2">Jobs</Typography>
                        <Button variant="contained" onClick={handleCreateJobClick} sx={{ margin: "10px" }}>Create Job</Button>
                    </Grid>
                </Grid>
                <Search onSearchChange={handleSearchChange} />
                <Grid item xs={12}>
                    <Grid container sx={{ paddingBottom: "10px" }} spacing={2} justifyContent="space-evenly" >
                        <Grid item  >
                            <Typography variant='h6' sx={{ padding: "1px" }}>Province</Typography>
                            <InputSelect
                                value={filter.province}
                                onChange={(e) => handleInputChange(e, "province")}
                                enumValues={locationProvinces}
                            />
                        </Grid>
                        <Grid item >
                            <Typography variant='h6'>Type</Typography>
                            <InputSelect
                                value={filter.jobType}
                                onChange={(e) => handleInputChange(e, "jobType")}
                                enumValues={jobTypes}
                            />
                        </Grid>
                        <Grid item  >
                            <Typography variant='h6'>Experience</Typography>
                            <InputSelect
                                value={filter.experienceLevel}
                                onChange={(e) => handleInputChange(e, "experienceLevel")}
                                enumValues={experienceLevels}
                            />
                        </Grid>
                        <Grid item>
                            <Box sx={{ width: 200, display: 'flex', justifyContent: 'center' }}>
                                <Box>
                                    <Typography variant="h6">My Jobs</Typography>
                                    <Switch
                                        checked={showMyJobs}
                                        onChange={() => setShowMyJobs(!showMyJobs)}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>

                    <Stack direction='column'>
                        {isLoading
                            ? (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {filteredJobs && filteredJobs.map(job => (

                                        <Job key={job.id}
                                            title={job.title}
                                            province={job.province}
                                            description={job.description}
                                            onButtonClick={() => handleJobClick(job.id)}
                                        />

                                    ))}
                                    {
                                        filteredJobs.length === 0 &&
                                        <Typography variant="h5" textAlign='center'>
                                            No jobs found with given input "{searchTerm}".<br />
                                            Please try again.
                                        </Typography>
                                    }
                                </>
                            )}
                    </Stack>

                </Grid>
            </Grid>

        </>
    )
}

export default JobsDashboard
