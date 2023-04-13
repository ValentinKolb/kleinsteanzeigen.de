import {useRouter} from "next/router";
import {useMutation, useQuery} from "react-query";
import {BookmarkModel, ProductModel, SellerView} from "../../models";
import {usePB} from "../../lib/pocketbase";
import {
    ActionIcon,
    Alert, Avatar,
    Badge,
    Box,
    Button, Center,
    Divider,
    Group, Image,
    Loader,
    LoadingOverlay,
    Modal,
    SimpleGrid,
    Switch,
    SwitchProps,
    Text,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCheck,
    IconHeart,
    IconHeartFilled,
    IconHome,
    IconHomeOff,
    IconMap,
    IconMessage,
    IconPackage,
    IconPackageOff,
    IconQuestionMark,
    IconTrash,
    IconX
} from "@tabler/icons-react";
import HTML from "../../components/HTML";
import ImageLightbox from "../../components/ImageLightbox";
import TextWithIcon from "../../components/TextWithIcon";
import React from "react";
import {useDisclosure} from "@mantine/hooks";
import Link from "next/link";
import {extractFromHtmlString} from "../../lib/util";

const CustomSwitch = ({loading, ...props}: {
    loading: boolean
} & SwitchProps) => {
    const theme = useMantineTheme()
    return (
        <Switch
            thumbIcon={
                props.disabled ? null
                    :
                    loading ?
                        <Loader size="0.8rem"/>
                        :
                        props.checked ?
                            <IconCheck size="0.8rem" stroke={3} color={theme.colors.green[5]}/>
                            : <IconX size="0.8rem" stroke={3} color={theme.colors.yellow[5]}/>
            }
            styles={{
                track: {
                    cursor: loading ? 'not-allowed' : 'pointer !important',
                }
            }}
            {...props}
        />
    )
}

const ProductActions = ({product, refresh}: { product: ProductModel, refresh: () => Promise<any> }) => {

    const {pb} = usePB()
    const router = useRouter()
    const theme = useMantineTheme()
    const [showDeleteModal, {open, close}] = useDisclosure(false);

    const toggleSoldMutation = useMutation({
        mutationFn: async () => {
            await pb.collection("products").update(product.id, {
                sold: !product.sold
            })
        },
        onSuccess: () => refresh()
    })

    const toggleArchivedMutation = useMutation({
        mutationFn: async () => {
            await pb.collection("products").update(product.id, {
                archived: !product.archived
            })
        },
        onSuccess: () => refresh()
    })

    const deleteProductMutation = useMutation({
        mutationFn: async () => {
            await pb.collection("products").delete(product.id)
        },
        onSuccess: () => router.push("/")
    })

    return <>
        <Modal opened={showDeleteModal} onClose={close}
               title={"Produkt löschen"} size={"xs"}
               styles={{title: {color: theme.colors.red[5]}}}
        >

            <Text color={"dimmed"} mb={"md"} size={"sm"}>
                Wenn du fortfährst, wird das Produkt dauerhaft gelöscht, einschließlich aller
                zugehörigen Informationen.
            </Text>

            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                })}
            >

                <Button
                    color={"green"}
                    variant={"outline"}
                    onClick={close}
                    leftIcon={<IconX/>}
                >
                    Abbrechen
                </Button>

                <Button
                    color={"red"}
                    variant={"outline"}
                    onClick={() => deleteProductMutation.mutate()}
                    leftIcon={<IconTrash/>}
                    loading={deleteProductMutation.isLoading}
                >
                    Löschen
                </Button>

            </Box>

        </Modal>

        <Box
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.sm,
            })}
        >
            <Title order={2} color={"gray"}>Aktionen</Title>

            <Divider/>

            <Title order={5} color={"gray"}>Verfügbarkeit</Title>

            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: theme.spacing.sm,
                })}
            >
                <Box
                    sx={(theme) => ({
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: theme.spacing.sm,
                    })}
                >
                    <CustomSwitch
                        label="Verkauft"
                        checked={product.sold}
                        onChange={() => toggleSoldMutation.mutate()}
                        loading={toggleSoldMutation.isLoading}
                    />
                    <TextWithIcon Icon={IconQuestionMark} color={"dimmed"}>
                        Ist das Produkt noch verfügbar?
                    </TextWithIcon>
                </Box>

                <Box
                    sx={(theme) => ({
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: theme.spacing.sm,
                    })}
                >
                    <CustomSwitch
                        label="Sichtbar"
                        disabled={product.sold}
                        checked={!product.archived}
                        onChange={() => toggleArchivedMutation.mutate()}
                        loading={toggleArchivedMutation.isLoading}
                    />

                    <TextWithIcon Icon={IconQuestionMark} color={"dimmed"}>
                        Soll das Produkt in der Suche angezeigt werden?
                    </TextWithIcon>
                </Box>


            </Box>

            <Divider/>

            <Button
                color={"red"}
                leftIcon={<IconTrash size={20}/>}
                onClick={() => open()}
                variant={"outline"}
            >
                Löschen
            </Button>
        </Box>
    </>
}

const ProductHeader = ({product}: { product: ProductModel }) => {
    const {user, pb} = usePB()

    const bookmarkCountQuery = useQuery({
        queryFn: async () => (await pb.collection("bookmarks").getFullList<BookmarkModel>({
            filter: `product='${product.id}'`
        })).length,
        queryKey: ["bookmarkCount", product.id],
    })

    const bookmarkQuery = useQuery({
        queryFn: async () => await pb.collection("bookmarks").getFullList<BookmarkModel>({
            filter: `user='${user?.id}'&&product='${product.id}'`
        }),
        queryKey: ["bookmark", user?.id],
        enabled: !!user
    })

    const isBookmarked = bookmarkQuery.data?.length

    const bookmarkMutation = useMutation({
        mutationFn: async () => {
            if (!user) return
            if (isBookmarked) {
                await Promise.allSettled(
                    (bookmarkQuery.data ?? []).map(async (bookmark) => await pb.collection("bookmarks").delete(bookmark.id))
                )
            } else {
                await pb.collection("bookmarks").create({
                    user: user.id,
                    product: product.id
                })
            }
        },
        onSuccess: async () => {
            await bookmarkQuery.refetch()
            await bookmarkCountQuery.refetch()
        }
    })

    const userIsSeller = user?.id === product.expand.seller.id

    return <>
        <Box
            sx={(theme) => ({
                flexGrow: 1,
                padding: theme.spacing.xs,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: theme.spacing.sm,
                flexShrink: 1,
            })}
        >
            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.xs,
                })}
            >
                <Title order={2} color={"blue"}>
                    {product.price === 0 ? "VB" : "Preis: " + product.price + "€"}
                </Title>

                <Divider/>

                <Group>
                    <Badge
                        color={product.shipping ? "green" : "yellow"}
                        leftSection={product.shipping ? <IconPackage size={14}/> :
                            <IconPackageOff size={14}/>}
                    >
                        {product.shipping ? "Versand möglich" : "Kein Versand"}
                    </Badge>
                    <Badge
                        color={product.pickup ? "green" : "yellow"}
                        leftSection={product.pickup ? <IconHome size={14}/> :
                            <IconHomeOff size={14}/>}
                    >
                        {product.pickup ? "Abholung möglich" : "Keine Abholung"}
                    </Badge>
                </Group>

                <Divider/>
                <TextWithIcon Icon={IconHeart} color={"dimmed"}>
                    {
                        bookmarkCountQuery?.data === undefined || bookmarkCountQuery.isLoading ? <>Lade ...</> :
                            <>
                                {bookmarkCountQuery?.data >= 200 ? "200+" : bookmarkCountQuery.data ?? 0} interessierte {bookmarkCountQuery?.data === 1 ? "Person" : "Personen"}
                            </>
                    }
                </TextWithIcon>
            </Box>

            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexDirection: "row",
                    gap: theme.spacing.sm,
                    justifyContent: "space-between"
                })}
            >

                <Tooltip label={isBookmarked ? "Favorit entfernen" : "Zu Favoriten hinzufügen"}>
                    <ActionIcon
                        size={"lg"}
                        aria-label={"Zu Favoriten hinzufügen"}
                        color={"green"}
                        disabled={!(!!user && !userIsSeller)}
                        onClick={() => bookmarkMutation.mutate()}
                    >
                        {
                            isBookmarked ?
                                <IconHeartFilled/> :
                                <IconHeart/>
                        }
                    </ActionIcon>
                </Tooltip>

                <Button
                    rightIcon={<IconMessage/>}
                    aria-label={"Nachricht senden"}
                    color={"green"}
                    disabled={!(!!user && !userIsSeller)}
                >
                    Verhandeln
                </Button>
            </Box>
        </Box>
    </>
}

const SellerPreview = ({seller}: { seller: SellerView }) => {

    const {pb} = usePB()
    const profilePic = pb.getFileUrl(seller, seller.avatar)

    return <Box
        sx={(theme) => ({
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "start",
            gap: theme.spacing.xs,
        })}
    >

        <Box
            sx={(theme) => ({
                width: "100%",
                display: "flex",
                justifyContent: "center",
            })}
        >
            <Avatar
                alt={"Profilbild von " + seller.username}
                src={profilePic}
                sx={(theme) => ({
                    objectFit: "contain",
                    borderRadius: "50%",
                    overflow: "hidden",
                    height: 100,
                    width: 100,
                })}
            />
        </Box>

        <Box
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
            })}
        >
            <Text color={"dimmed"} size={"xs"}>
                Inseriert von
            </Text>
            <Title order={3} color={"blue"} truncate
                   sx={(theme) => ({
                       maxWidth: "100%",
                   })}
            >
                {seller.username}
            </Title>
        </Box>

        {seller.aboutMe &&
            <Box
                sx={(theme) => ({

                    maxHeight: 11.625 * 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                })}
            >
                <Text fz="xs" c="dimmed">
                    {extractFromHtmlString(seller.aboutMe)}
                </Text>
            </Box>
        }


        <Box
            sx={(theme) => ({
                display: "flex",
                justifyContent: "center",
                width: "100%",
            })}
        >
            <Button

                component={Link}
                href={"/product/by/" + seller.id}
            >
                Profil ansehen
            </Button>
        </Box>
    </Box>
}

export default function ProductView() {

    const router = useRouter()
    const {pb, user} = usePB()

    const {id} = router.query as { id: string }

    const productQuery = useQuery<ProductModel>({
        queryKey: ['product', id],
        queryFn: () => pb.collection("products").getOne(id, {
            expand: 'categories,seller'
        }),
        enabled: !!id,
    })

    if (!id || productQuery.isLoading) {
        return <LoadingOverlay visible={true}/>
    }

    if (productQuery.isError) {
        router.push("/404")
        return <></>
    }

    const product = productQuery.data!
    const userIsSeller = user?.id === product.expand.seller.id

    return <>

        {userIsSeller && <Alert
            mb={"sm"}
            icon={<IconAlertCircle size="1rem"/>}
            title="Dieses Produkt ist von dir"
            color="green"
            variant={"outline"}
        >
            Du kannst es als verkauft markieren, unsichtbar schalten oder löschen.
        </Alert>}

        <Title color={"green"} order={1}>
            {product.name}
        </Title>

        <Box mb={"sm"}>
            <TextWithIcon Icon={IconMap} color={"dimmed"}>
                {product.location_name}
            </TextWithIcon>
        </Box>

        <SimpleGrid
            mb={"sm"}
            breakpoints={[
                {minWidth: "xs", cols: 1,},
                {minWidth: "md", cols: 2,},
            ]}

        >
            <Box
                sx={(theme) => ({
                    borderRadius: theme.radius.md,
                    overflow: "hidden",
                    boxShadow: theme.shadows.sm,
                    minHeight: 300,
                    minWidth: 300,

                })}
            >
                <ImageLightbox
                    src={product.images.map(img => pb.getFileUrl(product, img))}
                    alt={product.name}
                />
            </Box>

            <SimpleGrid

                breakpoints={[
                    {minWidth: "xs", cols: 1,},
                    {minWidth: "sm", cols: 2,},
                ]}
            >

                <ProductHeader product={product}/>

                <Box
                    sx={(theme) => ({
                        border: userIsSeller ? `1px solid ${theme.colors.green[5]}` : "none",
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.md,
                        boxShadow: theme.shadows.sm,
                        flexShrink: 1,
                    })}
                >
                    {userIsSeller ? <>
                        <ProductActions product={product} refresh={productQuery.refetch}/>
                    </> : <>
                        <SellerPreview seller={product.expand.seller}/>
                    </>}
                </Box>
            </SimpleGrid>
        </SimpleGrid>

        <Box
            sx={(theme) => ({
                padding: theme.spacing.xs,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
            })}
        >

            <Title order={2} color={"green"} mb="sm">Beschreibung</Title>

            <HTML html={product.description}/>

        </Box>

        {product.included && <Box
            mt={"sm"}
            sx={(theme) => ({
                padding: theme.spacing.xs,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
            })}
        >

            <Title order={2} color={"green"} mb="sm">Lieferumfang</Title>

            <HTML html={product.included}/>

        </Box>}

    </>
}