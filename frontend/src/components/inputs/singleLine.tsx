import { TextField } from "@mui/material"

interface Props {
    value: string
    errorMessage: string
    placeHolder: string
    onChange: (e: any) => any
}

export const InputTextSingleLine: React.FC<Props> = ({ value, errorMessage, placeHolder, onChange }) => {
    return <>
        <TextField
            required
            placeholder={placeHolder}
            value={value}
            error={!!errorMessage}
            helperText={errorMessage}
            sx={{ paddingTop: "10px" }}
            onChange={onChange}
            inputProps={{ min: 0 }}
        />
    </>
}