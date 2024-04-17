import { MenuItem, Select } from "@mui/material"

interface Props {
    value: string
    onChange: (e: any) => any
    enumValues: object
}

export const InputSelect: React.FC<Props> = ({ value, onChange, enumValues }) => {
    return <>
        <Select
            value={value}
            sx={{ marginTop: "10px" , width: 200}}
            onChange={onChange}
            required
        >
            {Object.keys(enumValues).map(
                enumValue => <MenuItem value={enumValue} key={enumValue}>{enumValues[enumValue as keyof typeof enumValues]}</MenuItem>
            )}
        </Select>
    </>
}