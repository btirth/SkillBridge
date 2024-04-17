/**
 * @author Om Anand (B00947378)
 */
import React, { useState } from 'react'
import { TextField, Grid } from '@mui/material'

interface SearchProps {
    onSearchChange: (searchTerm: string) => void
}

const Search: React.FC<SearchProps> = ({ onSearchChange }) => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
        onSearchChange(event.target.value)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField label="Search Jobs" variant="outlined" fullWidth value={searchTerm} onChange={handleSearchChange} />
            </Grid>
        </Grid>
    )
}

export default Search
