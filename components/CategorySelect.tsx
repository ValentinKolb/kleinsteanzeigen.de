import React, {forwardRef} from "react";
import {CategoryModel} from "../models";
import {Avatar, Group, MultiSelect, MultiSelectProps, Text} from "@mantine/core";
import {useQuery} from "react-query";
import {usePB} from "../lib/pocketbase";

const AutoCompleteItem = forwardRef<HTMLDivElement, CategoryModel>(
    ({description, value, image, name, ...others}: CategoryModel, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image}/>
                <div>
                    <Text color={"green"}>{name}</Text>
                    <Text size="xs" color="dimmed">
                        {description}
                    </Text>
                </div>
            </Group>
        </div>

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