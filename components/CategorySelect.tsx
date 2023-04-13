import React, {forwardRef} from "react";
import {CategoryModel} from "../models";
import {Avatar, Box, Group, MultiSelect, MultiSelectProps, Text} from "@mantine/core";
import {useQuery} from "react-query";
import {usePB} from "../lib/pocketbase";

const AutoCompleteItem = forwardRef<HTMLDivElement, CategoryModel>(
    ({description, value, image, name, ...others}: CategoryModel, ref) => (
        <Box ref={ref} {...others}

             sx={(theme) => ({
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "start",
                 gap: theme.spacing.sm
             })}
        >
            <Avatar
                src={image}
                alt={name}
                size="sm"
            />
            <Box>
                <Text color={"green"}>{name}</Text>
                <Text size="xs" color="dimmed">
                    {description}
                </Text>
            </Box>
        </Box>

    )
)

AutoCompleteItem.displayName = "AutoCompleteItem"

export default function CategorySelect(props: Omit<MultiSelectProps, "data" | "itemComponent">) {
    const {pb} = usePB()
    const categoriesQuery = useQuery(
        {
            queryKey: ["categoriesQuery"],
            queryFn: async () => await pb
                .collection("categories")
                .getFullList({sort: "name"})
                .then(data => data.map(v => ({
                    name: v.name,
                    description: v.description,
                    value: v.id,
                    label: v.name,
                    image: pb.getFileUrl(v, v.icon)
                })))
        }
    )

    return (
        <MultiSelect
            data={categoriesQuery.data ?? []}
            placeholder={"Kategorie"}
            description={"In welche Kategorien passen zu deinem Produkt?"}
            itemComponent={AutoCompleteItem}
            searchable
            {...props}
        />
    )
}