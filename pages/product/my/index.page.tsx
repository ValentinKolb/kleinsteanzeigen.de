import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {BookmarkModel} from "../../../models";
import {usePB} from "../../../lib/pocketbase";
import {Box, Button, Center, Flex, Pagination, Text, Title, Tooltip, useMantineTheme} from "@mantine/core";
import {IconHome, IconLayoutGrid, IconLayoutList, IconSlash} from "@tabler/icons-react";
import ProductGrid, {GridViewMode} from "../../../components/ProductGrid";
import React, {useEffect, useState} from "react";
import {useToggle} from "@mantine/hooks";
import Link from "next/link";

export default function AuctionsView() {

    const {pb, user} = usePB()
    const router = useRouter()

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)
    const theme = useMantineTheme()

    const productQuery = useQuery({
        queryKey: ["productByUser", user?.id],
        queryFn: async () => {
            return await pb.collection("bookmarks").getList<BookmarkModel>(1, 50, {
                sort: '-created',
                expand: 'product,product.seller,product.categories',
                filter: `user='${user?.id}'`
            })
        },
        onSuccess: (data) => setTotalPages(data.totalPages),
        enabled: !!user
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
                        Meine Favoriten
                    </Title>
                </Flex>
                <Text color={"dimmed"} sx={{flexShrink: 1}}>
                    Hier kannst du deine Lieblingsprodukte jederzeit einsehen und verwalten,
                    ohne lange suchen zu müssen.
                    Deine Favoritenliste macht das Einkaufen noch einfacher und angenehmer.
                </Text>
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
        <Box mb={"sm"}>
            <ProductGrid products={productQuery.data?.items.map(b => b.expand.product) ?? []} mode={viewMode}
                         loading={!user || productQuery.isLoading}/>
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