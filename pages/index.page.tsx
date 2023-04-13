import {Center, Group, Pagination, Stack, Title} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {IconCategory} from "@tabler/icons-react";
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

    const [filter, setFilter] = useState<string | null>(null)

    const productQuery = useQuery({
        queryKey: ["allProducts"],
        queryFn: async () => await pb.collection("products").getList<ProductModel>(activePage, 50, {
            sort: '-created',
            expand: 'categories,seller',
            filter: `archived=false&&sold=false${filter ? '&&' + filter : ''}`
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

            {JSON.stringify(filter)}

            <Stack mt={"sm"}>

                <Search viewMode={viewMode} toggleViewMode={toggleViewMode} setFilter={setFilter} search={productQuery.refetch}/>

                <Group position="apart"
                >
                    <Title order={2} color={"green"}>
                        Neue Anzeigen
                    </Title>

                    <TextWithIcon
                        Icon={IconCategory}
                        color={"dimmed"}
                        component={Link}
                        href={"/category"}
                        underline
                    >
                        Kategorien
                    </TextWithIcon>
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
