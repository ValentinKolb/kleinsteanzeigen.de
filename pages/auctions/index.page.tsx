import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {CategoryModel, ProductModel, UserModel} from "../../models";
import {usePB} from "../../lib/pocketbase";
import {
    ActionIcon,
    Box,
    Button,
    Center,
    Flex,
    LoadingOverlay, Menu, Modal,
    Pagination, Stack,
    Text,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {
    IconCategory,
    IconDots,
    IconHome,
    IconLayoutGrid,
    IconLayoutList,
    IconPlus,
    IconSlash, IconSparkles
} from "@tabler/icons-react";
import NotFound from "../../components/ErrorMessage";
import ProductGrid, {GridViewMode} from "../../components/ProductGrid";
import React, {useEffect, useState} from "react";
import {useToggle} from "@mantine/hooks";
import Link from "next/link";
import ErrorMessage from "../../components/ErrorMessage";
import InserateProductDialog from "../../components/InserateProductDialog";

export default function AuctionsView() {

    const {pb, user} = usePB()

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)
    const [showInserateProductDialog, setShowInserateProductDialog] = useState(false)
    const theme = useMantineTheme()

    const productQuery = useQuery({
        queryKey: ["productByCategory", user?.id],
        queryFn: async () => await pb.collection("products").getList<ProductModel>(1, 50, {
            sort: '-created',
            expand: 'categories,seller',
            filter: `seller.id?="${user!.id}"`
        }),
        onSuccess: (data) => setTotalPages(data.totalPages),
    })

    useEffect(() => {
        productQuery.refetch()
    }, [activePage])

    if (productQuery.isError) {
        return <>
            <NotFound label={"Auktionen nicht gefunden"} description={
                "Leider konnten wir deine Auktionen nicht finden."
            }/>
        </>
    }

    return <>
        <Modal
            opened={showInserateProductDialog}
            onClose={() => setShowInserateProductDialog(false)}
            title={"Neues Produkt inserieren"}
            size={"xl"}
        >
            <InserateProductDialog close={() => setShowInserateProductDialog(false)}/>
        </Modal>

        <Box
            mb={"sm"}
            sx={(theme) => ({
                display: "flex",
                flexDirection: "row",
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
                        Mein Auktionen
                    </Title>
                </Flex>
                <Text color={"dimmed"} sx={{flexShrink: 1}}>
                    Herzlich Willkommen zu deinen Produkten! Hier findest du eine Übersicht all deiner aktiven und
                    abgeschlossenen Anzeigen.
                    Viel Erfolg bei deinen Anzeigen!
                </Text>
            </Box>

            <Menu shadow="md" width={200} position={"bottom-end"}>
                <Menu.Target>
                    <Button
                        compact
                        color={"gray"}
                        variant={"light"}
                        leftIcon={<IconSparkles size={14}/>}
                    >
                        Aktionen
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        component={"button"}
                        onClick={() => setShowInserateProductDialog(true)}
                        icon={<IconPlus size={14}/>}
                    >
                        Inserieren
                    </Menu.Item>
                    <Menu.Item
                        component={"button"}
                        onClick={() => toggleViewMode()}
                        icon={viewMode === "gridView" ?
                            <IconLayoutList size={14}/> :
                            <IconLayoutGrid size={14}/>
                        }
                    >
                        {viewMode === "gridView" ? "Spaltenansicht" : "Zeilenansicht"}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Box>
        <Box mb={"sm"}>
            <ProductGrid products={productQuery.data?.items ?? []} mode={viewMode} loading={!user || productQuery.isLoading}/>
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