import { Typography } from "@mui/material"

interface Props {
    title: string;
    description: string;
}

export const InputTitle: React.FC<Props> = ({ title, description }) => {
    return <>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
    </>
}