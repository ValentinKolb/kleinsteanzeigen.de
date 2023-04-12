import {
    ActionIcon,
    Autocomplete,
    Badge,
    Box,
    Button,
    Center,
    Collapse,
    Flex,
    Group,
    Image,
    Input,
    Modal,
    MultiSelect,
    Pagination,
    RangeSlider,
    RingProgress,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Title,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import InserateProductDialog from "../components/InserateProductDialog";
import {
    IconCategory,
    IconFilter,
    IconFilterOff,
    IconLayoutGrid,
    IconLayoutList,
    IconMapPin,
    IconPlus,
    IconSearch
} from "@tabler/icons-react";
import {usePB} from "../lib/pocketbase";
import {useQuery} from "react-query";
import ProductGrid, {GridViewMode} from "../components/ProductGrid";
import {CategoryModel, ProductModel} from "../models";
import {useHover, useInterval, useMediaQuery, useToggle, useWindowScroll} from "@mantine/hooks";
import Link from "next/link";
import TextWithIcon from "../components/TextWithIcon";
import {useForm} from "@mantine/form";
import {Prism} from "@mantine/prism";
import CategorySelect from "../components/CategorySelect";
import LocationInput from "../components/LocationInput";

const tags = [
    "Second Hand",
    "Gebrauchtwaren",
    "Schnäppchen",
    "Tauschen",
    "Marktplatz",
    "Deals",
    "Vintage",
    "Sammlerstücke",
    "Seltenheitswert",
    "Raritäten",
    "Antiquitäten",
    "Nachhaltigkeit"
]

const InserateBtn = ({onClick}: { onClick: () => void }) => {

    const {hovered, ref} = useHover()

    return <Box
        ref={ref}
        sx={(theme) => ({
            position: "relative",
        })}
    >
        <Box
            sx={(theme) => ({
                position: "absolute",
                //top: hovered ? 40 : 0,
                left: 85,
                transition: "all 0.2s ease-in-out",
            })}
        >
            <Image
                fit={"contain"}
                height={25}
                width={25}
                alt={"Teddy legs"}
                src={"legs.png"}
            />
        </Box>


        <Button
            bg={"white"}
            size={"md"}
            variant={"subtle"}
            color={"blue"}
            leftIcon={<IconPlus/>}
            radius={"lg"}
            sx={(theme) => ({
                boxShadow: theme.shadows.lg
            })}
            onClick={onClick}
        >
            Inserieren

        </Button>

    </Box>
}

const SearchBtn = ({onClick}: { onClick: () => void }) => {
    const {hovered, ref} = useHover()
    return <Box
        ref={ref}
        sx={(theme) => ({
            position: "relative",
        })}
    >
        <Button
            onClick={onClick}
            size={"md"}
            variant={"subtle"}
            leftIcon={<IconSearch/>}
            color={"green"}
            radius={"lg"}
            sx={(theme) => ({
                boxShadow: theme.shadows.lg
            })}
        >
            Stöbern
        </Button>

        <Box
            sx={(theme) => ({
                position: "absolute",
                top: -29,
                left: 85,
            })}
        >
            <Image
                fit={"contain"}
                height={35}
                width={35}
                alt={"Button Animal"}
                src={hovered ? "/btn_animal_2.png" : "/btn_animal_1.png"}
            />
        </Box>
    </Box>
}

const RandomCategories = () => {

    const {pb} = usePB()

    const [seconds, setSeconds] = useState(0)
    const interval = useInterval(() => setSeconds((s) => s + 0.01), 10)
    useEffect(() => {
        interval.start()
        return interval.stop
    }, [])

    const [currentIndex, setCurrentIndex] = useState(0);

    const categoriesQuery = useQuery(
        {
            queryKey: ["categories"],
            queryFn: async () => await pb
                .collection("categories")
                .getFullList<CategoryModel>({
                    sort: "name"
                })
        }
    )

    function isCloseToMultipleOf5(value: number) {
        const tolerance = 0.01
        const remainder = value % 5
        return Math.abs(remainder) < tolerance || Math.abs(remainder - 5) < tolerance
    }

    useEffect(() => {
        if (isCloseToMultipleOf5(seconds) && categoriesQuery.data) {
            setCurrentIndex((currentIndex + 3) % categoriesQuery.data!.length);
        }
    }, [seconds, categoriesQuery.data]);

    if (categoriesQuery.isLoading) {
        return (
            <Group>
                <Skeleton width={90} height={20} radius="xl"/>
                <Skeleton width={120} height={20} radius="xl"/>
                <Skeleton width={80} height={20} radius="xl"/>
                <Skeleton width={20} height={20} radius="xl"/>
            </Group>)
    }

    return <Box
        sx={(theme) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.sm
        })}
    >
        {(categoriesQuery.data ?? []).slice(currentIndex, currentIndex + 3).map((category) => (
            <Badge
                key={category.id}
                component={Link}
                href={`/category/${category.id}`}
                sx={(theme) => ({
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        textDecoration: "underline",
                        textDecorationThickness: 2
                    }
                })}
            >
                {category.name}
            </Badge>
        ))}
        <RingProgress
            size={20}
            thickness={3}
            roundCaps={true}
            sections={[
                {value: (seconds % 5) * 25 - 5, color: 'green'},
            ]}
        />
    </Box>
}

const Search = ({
                    viewMode,
                    toggleViewMode
                }: {
    viewMode: GridViewMode
    toggleViewMode: () => void
}) => {

    const {pb} = usePB()

    const [scroll] = useWindowScroll()

    const theme = useMantineTheme()

    const height = Math.max(0, 300 - scroll.y ** 1.5)

    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, true, {getInitialValueInEffect: false})

    const [showSearch, setShowSearch] = useState(false)

    const [showInserateProductDialog, setShowInserateProductDialog] = useState(false)

    const formValues = useForm({
        initialValues: {
            search: "",
            categories: [] as string[],
            price: {
                from: 0,
                to: 1000
            },
            shipping: false,
            pickup: false,
            sold: false,
        }
    })

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
    return <>

        <Modal
            opened={showInserateProductDialog}
            onClose={() => setShowInserateProductDialog(false)}
            title={"Neues Produkt inserieren"}
            size={"xl"}
        >
            <InserateProductDialog close={() => setShowInserateProductDialog(false)}/>
        </Modal>

        <Prism language={"json"}>
            {JSON.stringify(formValues.values, null, 2)}
        </Prism>

        <Box
            sx={(theme) => ({
                position: "relative",
            })}
        >
            <Box
                sx={(theme) => ({
                    position: "absolute",
                    width: "100%",
                    height: (height - 42) / 2,
                    opacity: scroll.y < 20 ? 1 : 0,
                    transition: "all 0.2s ease",
                    [theme.fn.smallerThan(theme.breakpoints.md)]: {
                        display: "none"
                    }
                })}
            >
                <Transition
                    mounted={!showSearch}
                    transition="slide-down"
                    duration={200}
                    timingFunction="ease"
                >
                    {(styles) =>
                        <Box
                            style={styles}
                            sx={(theme) => ({
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",

                            })}
                        >
                            <Title order={1} color={"green"}>
                                Regional, direkt & kostenlos
                            </Title>
                        </Box>
                    }
                </Transition>
            </Box>

            <Box
                sx={(theme) => ({
                    bottom: 0,
                    position: "absolute",
                    width: "100%",
                    height: (height - 42) / 2,
                    opacity: scroll.y < 20 ? 1 : 0,
                    transition: "all 0.2s ease",
                    [theme.fn.smallerThan(theme.breakpoints.md)]: {
                        display: "none"
                    }
                })}
            >
                <Transition
                    mounted={!showSearch}
                    transition="slide-up"
                    duration={200}
                    timingFunction="ease"
                >
                    {(styles) =>
                        <Box
                            style={styles}
                            sx={(theme) => ({
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "center",
                            })}
                        >
                            <RandomCategories/>
                        </Box>
                    }
                </Transition>
            </Box>

            <Box
                sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.3s ease-out",
                    [theme.fn.largerThan(theme.breakpoints.md)]: {
                        height: height,
                        overflow: "hidden"
                    }
                })}
            >
                <Box
                    sx={(theme) => ({
                        width: "100%",
                    })}
                >
                    <Flex
                        gap={"sm"}
                        direction={{base: 'column', sm: 'row'}}
                        sx={(theme) => ({})}
                    >
                        <Autocomplete
                            data={['iPhone (trending)', 'Sofa', 'Pflanzen']}
                            sx={(theme) => ({
                                flexGrow: 1,
                            })}
                            styles={(theme) => ({
                                input: {
                                    boxShadow: theme.shadows.lg,
                                    borderWidth: 0,
                                    borderColor: theme.colors.green[5],
                                    transition: "all 0.1s ease-out",
                                    '&:focus': {
                                        borderWidth: 1
                                    }
                                }
                            })}
                            icon={<IconSearch size="1.1rem" stroke={1.5}/>}
                            radius="xl"
                            size="md"
                            rightSection={
                                <>
                                    <Tooltip
                                        label={viewMode === "gridView" ? "Produkte als Zeilen anzeigen" : "Produkte als Raster anzeigen"}>
                                        <ActionIcon size={32} radius="xl" onClick={() => toggleViewMode()}>
                                            {viewMode === "gridView" ? <IconLayoutList size={20}/> :
                                                <IconLayoutGrid size={20}/>}
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label={showSearch ? "Filter verbergen" : "Filter anzeigen"}>
                                        <ActionIcon size={32} radius="xl" onClick={() => setShowSearch(b => !b)}>
                                            {showSearch ? <IconFilterOff size={20}/> : <IconFilter size={20}/>}
                                        </ActionIcon>
                                    </Tooltip>
                                </>
                            }
                            placeholder="Nach Produkten suchen ..."
                            rightSectionWidth={84}
                            {...formValues.getInputProps("search")}
                        />

                        <Group position="center">

                            <SearchBtn onClick={() => {
                            }}/>

                            <Text c={"dimmend"}>oder</Text>

                            <InserateBtn onClick={() => setShowInserateProductDialog(true)}/>
                        </Group>
                    </Flex>

                    <Collapse in={showSearch && (isMobile || scroll.y < 20)}>
                        <Box my={"sm"}>
                            <SimpleGrid breakpoints={[
                                {minWidth: 'xs', cols: 2, spacing: 'sm'},
                                {maxWidth: 'xs', cols: 1, spacing: 'sm'},
                            ]}>
                                <Stack>

                                    <CategorySelect
                                        clearable
                                        icon={<IconCategory/>}
                                        label={"Kategorie"}
                                        description={"In welcher Kategorie suchst du?"}
                                        {...formValues.getInputProps("categories")}
                                    />

                                    <Input.Wrapper
                                        label={"Preis"}
                                        description={"In welchem Preisbereich suchst du?"}
                                    >
                                        <RangeSlider
                                            my={"sm"}
                                            marks={[
                                                {value: 20, label: '10€'},
                                                {value: 50, label: '100€'},
                                                {value: 80, label: '1.000€'},
                                            ]}
                                        />
                                    </Input.Wrapper>
                                </Stack>

                                <Stack>
                                    <LocationInput

                                        label={"Region"}
                                        description={"Wo suchst du?"}
                                    />
                                    <Input.Wrapper
                                        label={"Entfernung"}
                                        description={"Wie weit bist du bereit zu fahren?"}
                                    >
                                        <RangeSlider
                                            my={"sm"}
                                            marks={[
                                                {value: 20, label: '10km'},
                                                {value: 50, label: '50km'},
                                                {value: 80, label: '100km'},
                                            ]}
                                        />
                                    </Input.Wrapper>

                                </Stack>
                            </SimpleGrid>
                        </Box>
                    </Collapse>
                </Box>
            </Box>
        </Box>
    </>
}

export default function Home() {

    const {pb} = usePB()

    const [viewMode, toggleViewMode] = useToggle<GridViewMode>(['gridView', 'listView'])

    const [activePage, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(10)

    const productQuery = useQuery({
        queryKey: ["allProducts"],
        queryFn: async () => await pb.collection("products").getList<ProductModel>(activePage, 50, {
            sort: '-created',
            expand: 'categories,seller',
            filter: `archived=false&&sold=false`
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

                <Search viewMode={viewMode} toggleViewMode={toggleViewMode}/>

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
