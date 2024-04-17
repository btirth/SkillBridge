/**
 * @author Om Anand (B00947378)
 */
import React from 'react'
import { Card, CardContent, Typography, Button, Grid } from '@mui/material'

interface JobProps {
  title: string
  province: string
  description: string
  onButtonClick: () => any
}


const Job: React.FC<JobProps> = ({ title, province, description, onButtonClick }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '20px', padding: "20px"}}>
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            <Typography variant="h5" component="h2" gutterBottom>{title}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography color="textSecondary" gutterBottom align='right'>{province}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" component="p" gutterBottom style={{ wordWrap: "break-word" }} >
          {description}
        </Typography>
        <Button variant="contained" onClick={onButtonClick}>
          Learn more
        </Button>
      </CardContent>
    </Card>
  )
}

export default Job
