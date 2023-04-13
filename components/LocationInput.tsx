import {ActionIcon, Autocomplete, Input, InputWrapperProps, Loader} from "@mantine/core";
import {IconMap, IconX} from "@tabler/icons-react";
import {forwardRef, useEffect, useState} from "react";
import {useQuery} from "react-query";
import {ofetch} from "ofetch";

export type GeoLocation = {
    lon: string,
    lat: string,
    name: string,
    id: string
}

type NominatimResponse = {
    place_id: number,
    display_name: string,
    lat: string,
    lon: string
}

type AutoCompleteSuggestion = {
    value: string
    location: GeoLocation
}

export default function LocationInput({onChange, ...props}: {
    onChange: (value: GeoLocation | null) => void
} & Omit<InputWrapperProps, "children" | "onChange">) {

    const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null)
    const [autoCompleteValue, setAutoCompleteValue] = useState<string>("")
    const [suggestions, setSuggestions] = useState<AutoCompleteSuggestion[]>([])

    const query = useQuery({
        queryKey: ['location', autoCompleteValue],
        queryFn: async () => await ofetch<NominatimResponse[]>(`https://geo.kleinsteanzeigen.de/search`, {
                query: {
                    q: autoCompleteValue,
                    format: "json"
                }
            }
        ),
        onSuccess: (data) => {
            setSuggestions(data
                .filter((obj, index, self) =>
                    index === self.findIndex((o) => o.display_name === obj.display_name)
                )
                .map(f => ({
                        label: f.display_name,
                        value: f.display_name,
                        location: {
                            lon: f.lon,
                            lat: f.lat,
                            name: f.display_name,
                            id: f.place_id.toString()
                        }
                    })
                ))
        }
    })

    useEffect(() => {
        if (autoCompleteValue) {
            query.refetch()
            const res = suggestions.find(s => s.value === autoCompleteValue)
            if (res) {
                onChange(res.location)
                setSelectedLocation(res.location)
            } else {
                onChange(null)
                setSelectedLocation(null)
            }
        }
    }, [autoCompleteValue])

    return <>
        <Input.Wrapper {...props}>
            <Autocomplete
                mt={props.label || props.description ? 5 : 0}
                value={autoCompleteValue}
                onChange={setAutoCompleteValue}
                data={suggestions}
                rightSection={
                    <ActionIcon
                        variant={"transparent"}
                        disabled={!autoCompleteValue}
                        onClick={() => {
                            setAutoCompleteValue("")
                            setSelectedLocation(null)
                            onChange(null)
                        }}
                    >
                        {
                            selectedLocation ? <IconX/> : autoCompleteValue && suggestions.length
                        }
                    </ActionIcon>
                }
                icon={query.isLoading ?
                    <Loader color={"gray"} size={"xs"}/> : <IconMap/>
                }
                styles={{
                    input: {
                        textOverflow: "ellipsis",
                    }
                }}
                maxDropdownHeight={200}
            />
        </Input.Wrapper>
    </>
}