import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {ProductModel, SellerView} from "../../../models";
import {usePB} from "../../../lib/pocketbase";
import {Box, Button, Center, Flex, Pagination, Spoiler, Text, Title, Tooltip, useMantineTheme} from "@mantine/core";
import {IconHome, IconLayoutGrid, IconLayoutList, IconSlash} from "@tabler/icons-react";
import ProductGrid, {GridViewMode} from "../../../components/ProductGrid";
import React, {useEffect, useState} from "react";
import {useToggle} from "@mantine/hooks";
import Link from "next/link";
import HTML from "../../../components/HTML";

export default function AuctionsView() {

    const {pb} = usePB()
    const router = useRouter()
    const {id} = router.query as { id: string }

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)
    const theme = useMantineTheme()

    const productQuery = useQuery({
        queryKey: ["productBySeller", id],
        queryFn: async () => {
            return await pb.collection("products").getList<ProductModel>(1, 50, {
                sort: '-created',
                expand: 'seller,categories',
                filter: `seller='${id}'`
            })
        },
        onSuccess: (data) => setTotalPages(data.totalPages),
    })

    const sellerQuery = useQuery({
        queryKey: ["seller", id],
        queryFn: async () => {
            return await pb.collection("sellers").getOne<SellerView>(id)
        },
        enabled: !!id
    })

    useEffect(() => {
        productQuery.refetch()
    }, [activePage])

    if (productQuery.isError) {
        return router.push("/")
    }

    return <>
        <Box
            mb={"sm"}
            sx={(theme) => ({
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: theme.spacing.xs,
                [theme.fn.smallerThan("xs")]: {
                    flexDirection: "column",
                }
            })}
        >
            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.xs
                })}
            >
                <Flex gap={"xs"} align={"center"}>
                    <Box
                        component={Link}
                        href={"/"}
                        sx={(theme) => ({
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                        })}
                    >
                        <Tooltip label={"Home"}>
                            <IconHome
                                size={32}
                                color={theme.colors.green[5]}
                            />
                        </Tooltip>
                    </Box>

                    <IconSlash
                        size={20}
                        color={theme.colors.gray[5]}
                    />

                    <Title order={1} color={"green"} truncate>
                        Produkte von {sellerQuery.data?.username}
                    </Title>
                </Flex>
            </Box>

            <Button
                compact
                color={"gray"}
                variant={"light"}
                onClick={() => toggleViewMode()}
                leftIcon={viewMode === "gridView" ?
                    <IconLayoutList size={14}/> :
                    <IconLayoutGrid size={14}/>
                }
            >
                {viewMode === "gridView" ? "Spaltenansicht" : "Zeilenansicht"}
            </Button>

        </Box>

        <Spoiler
            maxHeight={100}
            showLabel={
                <Text color={"gray"}>... vollständige Beschreibung von {sellerQuery.data?.username} anzeigen</Text>
            }
            hideLabel={
                <Text color={"gray"}>... weniger anzeigen</Text>
            }
            mb={"md"}
        >
            <HTML html={sellerQuery.data?.aboutMe ?? ""}/>
        </Spoiler>
        <Box mb={"sm"}>
            <ProductGrid products={productQuery.data?.items ?? []} mode={viewMode}
                         loading={productQuery.isLoading}/>
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