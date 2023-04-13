import {ActionIcon, Center, Group, Pagination, Stack, Title, Tooltip, UnstyledButton} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {IconCategory, IconGridPattern, IconLayoutGrid, IconLayoutList} from "@tabler/icons-react";
import {usePB} from "../lib/pocketbase";
import {useQuery} from "react-query";
import ProductGrid, {GridViewMode} from "../components/ProductGrid";
import {ProductModel} from "../models";
import {useToggle} from "@mantine/hooks";
import Link from "next/link";
import TextWithIcon from "../components/TextWithIcon";
import Search from "../components/Search";


export default function Home() {

    const {pb} = usePB()

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)

    const [productFilter, setProductFilter] = useState<string | null>(null)

    const productQuery = useQuery({
        queryKey: ["allProducts"],
        queryFn: async () => await pb.collection("products").getList<ProductModel>(activePage, 50, {
            sort: '-created',
            expand: 'categories,seller',
            filter: `archived=false&&sold=false${productFilter ? '&&' + productFilter : ''}`
        }),
        onSuccess: (data) => {
            setTotalPages(data.totalPages)
        }
    })

    useEffect(() => {
        productQuery.refetch()
    }, [activePage])

    return (
        <>
            <Stack mt={"sm"}>

                <Search setFilter={setProductFilter} search={productQuery.refetch}/>

                <Group position="apart">
                    <Title order={2} color={"green"}>
                        Alle Produkte
                    </Title>

                    <Tooltip
                        label={viewMode === "gridView" ? "Produkte als Zeilen anzeigen" : "Produkte als Raster anzeigen"}>

                        <UnstyledButton onClick={() => toggleViewMode()}>
                            <TextWithIcon
                                Icon={viewMode === "gridView" ? IconLayoutList : IconLayoutGrid}
                                color={"dimmed"}
                                underline
                            >
                                {viewMode === "gridView" ? "Listenansicht" : "Spaltenansicht"}
                            </TextWithIcon>
                        </UnstyledButton>
                    </Tooltip>
                </Group>

                <ProductGrid
                    products={productQuery.data?.items ?? []}
                    mode={viewMode}
                    loading={productQuery.isLoading}
                />

                <Center>
                    <Pagination
                        value={activePage}
                        onChange={(page) => setPage(page)}
                        total={totalPages}
                    />
                </Center>

            </Stack>
        </>
    )
}
