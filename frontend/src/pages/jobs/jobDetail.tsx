/**
 * @author Om Anand (B00947378)
 */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Typography, Grid, Box, Container, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, CircularProgress } from '@mui/material'
import { deleteJob, getJob } from './job'
import { JobModel } from '../../models/jobs.model'
import JobDetailComponent from '../../components/job/jobDetailComponent'

type JobDetailParams = {
    jobId: string
}

const JobDetail: React.FC = () => {
    // Extracting jobId from route parameters
    const navigate = useNavigate()
    const { jobId } = useParams<JobDetailParams>()
    const [job, setJob] = useState<JobModel>()
    const userId = sessionStorage.getItem("userId")!!
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [isLoading, setLoading] = useState(false);

    // Finding job details based on jobId
    useEffect(() => {
        setLoading(true)
        getJob(jobId!)
            .then((response) => {
                if (response.status === 200) {
                    setJob(response.data)
                }
            })
            .catch(_ => console.log("Unable to get job ", jobId))
        setLoading(false)
    }, [jobId]);

    const handleDeleteJob = () => {
        if (job && job.userId === userId) {
            deleteJob(jobId!)
                .then((response) => {
                    if (response.status === 200) {
                        setSnackbarOpen(true)
                        navigate("/jobs")
                    }
                })
                .catch(_ => console.log("Unable to delete job ", jobId))
        }
    }

    return (
        <>
            <Box >
                <Container>
                    <Typography variant="h5">Job Details</Typography>
                    {isLoading
                        ? (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                {job &&
                                    <>
                                        <Grid container>
                                            <Grid item xs={12} sx={{ padding: '5px' }}>
                                                <JobDetailComponent job={job} />
                                            </Grid>
                                            <Grid item xs={12} sx={{ padding: '5px' }}>
                                                <Box display="flex" justifyContent="space-evenly">
                                                    <Button variant="contained" color="primary">
                                                        Apply Now
                                                    </Button>
                                                    {userId === job.userId && (
                                                        <>
                                                            <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setConfirmDeleteOpen(true)}>
                                                                Delete Job
                                                            </Button>
                                                            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                                                                <DialogTitle>Confirm Delete</DialogTitle>
                                                                <DialogContent>
                                                                    <Typography variant="body1">Are you sure you want to delete this job?</Typography>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
                                                                        Cancel
                                                                    </Button>
                                                                    <Button color="primary" autoFocus onClick={handleDeleteJob} >
                                                                        Delete
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </>
                                }
                                {!job && <Typography component={'span'} variant="h6">No job found with job ID {jobId}.</Typography>}
                            </>
                        )}
                </Container>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message="Job deleted successfully"
            />
        </>
    )
}
export default JobDetail

