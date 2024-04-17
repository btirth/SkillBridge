import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { CameraAlt } from '@mui/icons-material';
import { auth } from '../../utils/firebase';
import { useNavigate } from 'react-router-dom';


interface UserDetails {
    _id: string,
    uid: string,
    email: string,
    firstName: string,
    lastName: string,
    image: string,
    dob: Dayjs | null,
    profession: string,
    companyName: string
}

export default function ProfilePage({ }: { uid: string }): React.ReactElement {
    const [editMode, setEditMode] = useState(false);
    const [userDa, setUserDa] = useState<UserDetails | null>(null);
    const data = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    console.log(data)

    useEffect(() => {
        const getById = async () => {
            try {
                const userData = await axios.get<UserDetails>(`${import.meta.env.VITE_BASE_URL}/userDetails/${data}`);
                console.log(userData.data);
                setUserDa({ ...userData.data });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        getById();
    }, [data]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDa(prevData => ({
            ...prevData!,
            [name]: value
        }));
    };


    const handleDateChange = (value: Dayjs | null) => {
        setUserDa(prevData => ({
            ...prevData!,
            dob: value
        }));
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = async () => {
        try {
            auth.currentUser?.delete().then(() => {
                sessionStorage.clear()
                navigate('/')
                axios.delete(`${import.meta.env.VITE_BASE_URL}/userDetails/${userDa?._id}`);
            })

        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
    const handleSave = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/userDetails/${userDa?.uid}`, userDa);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setUserDa(prevData => ({
                        ...prevData!,
                        image: reader.result as string
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <Container maxWidth="lg" component="main">
            <Container component="section" maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ pt: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                    User Details
                                </Typography>
                                <Divider />
                                {userDa && (
                                    <Stack spacing={2} alignItems="center" sx={{ pt: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={2} position="relative">
                                            <Avatar src={userDa.image} sx={{ width: 120, height: 120 }} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="upload-photo"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="upload-photo"
                                                style={{
                                                    position: 'absolute',
                                                    top: '35%',
                                                    left: '22%',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        backgroundColor: 'white',
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                        borderRadius: '50%'
                                                    }}
                                                >
                                                    <IconButton component="span">
                                                        <CameraAlt />
                                                    </IconButton>
                                                </span>
                                            </label>
                                        </Stack>

                                        <TextField
                                            name="firstName"
                                            fullWidth
                                            label="First Name"
                                            value={userDa.firstName}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            sx={{ color: 'text.primary' }}
                                        />
                                        <TextField
                                            name="lastName"
                                            fullWidth
                                            label="Last Name"
                                            value={userDa.lastName}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        <TextField
                                            name="email"
                                            fullWidth
                                            label="Email"
                                            value={userDa.email}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        <TextField
                                            name="companyName"
                                            fullWidth
                                            label="Company Name"
                                            value={userDa.companyName}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        <TextField
                                            name="profession"
                                            fullWidth
                                            label="Profession"
                                            value={userDa.profession}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                        />
                                        <Grid item xs={12}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker
                                                        label="Date of Birth"
                                                        defaultValue={dayjs()}
                                                        value={dayjs(userDa.dob)}
                                                        onChange={handleDateChange}
                                                        disabled={!editMode}    
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Grid>
                                        {editMode ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleEdit}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </Stack>
                                )}
                            </CardContent>
                            <Divider />
                        </Card>
                        <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                        <Button sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete Account
                        </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
}
