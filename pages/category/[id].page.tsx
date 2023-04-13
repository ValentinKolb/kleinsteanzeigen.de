import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {CategoryModel, ProductModel} from "../../models";
import {usePB} from "../../lib/pocketbase";
import {
    Box,
    Button,
    Center,
    Flex,
    LoadingOverlay,
    Pagination,
    Text,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {IconCategory, IconChevronRight, IconLayoutGrid, IconLayoutList} from "@tabler/icons-react";
import ProductGrid, {GridViewMode} from "../../components/ProductGrid";
import React, {useEffect, useState} from "react";
import {useToggle} from "@mantine/hooks";
import Link from "next/link";

export default function CategoryView() {

    const router = useRouter()
    const {pb} = usePB()

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const {id} = router.query as { id: string }
    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)
    const theme = useMantineTheme()

    const categoryQuery = useQuery<CategoryModel>({
        queryKey: ['product', id],
        queryFn: () => pb.collection("categories").getOne(id),

    })

    const productQuery = useQuery({
        queryKey: ["productByCategory", id],
        queryFn: async () => await pb.collection("products").getList<ProductModel>(1, 50, {
            sort: '-created',
            expand: 'categories,seller',
            filter: `categories.id?="${id}"&&archived=false&&sold=false`
        }),
        onSuccess: (data) => setTotalPages(data.totalPages),
        enabled: !!id
    })

    useEffect(() => {
        productQuery.refetch()
    }, [activePage])

    if (!id || categoryQuery.isLoading) {
        return <LoadingOverlay visible={true}/>
    }

    if (categoryQuery.isError) {
        router.push("/404")
        return <></>
    }

    return <>
        <Box
            mb={"sm"}
            sx={(theme) => ({
                display: "flex",
                flexDirection: "row",
                gap: theme.spacing.xs,
                justifyContent: "space-between",
                [theme.fn.smallerThan("xs")]: {
                    flexDirection: "column",
                }
            })}
        >
            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.xs,
                })}
            >
                <Flex gap={"xs"} align={"center"}>
                    <Box
                        component={Link}
                        href={"/category"}
                        sx={(theme) => ({
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                        })}
                    >
                        <Tooltip label={"Alle Kategorien"}>
                            <IconCategory
                                size={25}
                                color={theme.colors.green[5]}
                            />
                        </Tooltip>
                    </Box>

                    <IconChevronRight
                        size={20}
                        color={theme.colors.gray[5]}
                    />

                    <Title order={2} color={"green"} truncate
                           sx={{lineHeight: 1.1}}
                    >
                        {categoryQuery.data!.name}
                    </Title>
                </Flex>
                <Text color={"dimmed"} sx={{flexShrink: 1}}>
                    {categoryQuery.data!.description}
                </Text>
            </Box>
            <Button
                leftIcon={
                    viewMode === "gridView" ? <IconLayoutList size={20}/> :
                        <IconLayoutGrid size={20}/>
                }
                variant={"light"}
                onClick={() => toggleViewMode()}
                color={"gray"}
                compact
                mb={"sm"}
            >
                {viewMode === "gridView" ? "Spaltenansicht" : "Zeilenansicht"}
            </Button>
        </Box>
        <Box mb={"sm"}>
            <ProductGrid products={productQuery.data?.items ?? []} mode={viewMode} loading={false}/>
        </Box>
        <Center>
            <Pagination
                value={activePage}
                onChange={(page) => setPage(page)}
                total={totalPages}
            />
        </Center>
    </>
}