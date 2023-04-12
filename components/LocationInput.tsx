import {Autocomplete, AutocompleteProps, Input, InputWrapperProps} from "@mantine/core";
import {IconMap} from "@tabler/icons-react";
import {useState} from "react";
import {useQuery} from "react-query";

export type Location = {
    longitude: number,
    latitude: number,
}

export default function LocationInput({onChange, ...props}: {
    onChange: (value: Location) => void
} & Omit<InputWrapperProps, "children" | "onChange">) {

    const [value, setValue] = useState('')

    const query = useQuery({
        queryKey: ['location', value],
        queryFn: async () => {

        }
    })

    const data =
        value.trim().length > 0 && !value.includes('@')
            ? ['gmail.com', 'outlook.com', 'yahoo.com'].map((provider) => `${value}@${provider}`)
            : [];

    return <>
        <Input.Wrapper {...props}>
            <Autocomplete
                value={value}
                onChange={setValue}
                data={data}
                icon={<IconMap/>}
            />
        </Input.Wrapper>
    </>
}