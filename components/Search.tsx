import {useHover, useInterval, useMediaQuery, useWindowScroll} from "@mantine/hooks";
import {
    ActionIcon,
    Autocomplete,
    Badge,
    Box,
    Button,
    Collapse,
    Flex,
    Group,
    Image,
    Input,
    Modal,
    RangeSlider, rem,
    RingProgress,
    SimpleGrid,
    Skeleton, Slider,
    Stack,
    Text, TextInput,
    Title,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import {
    IconCategory, IconCurrencyEuro, IconCurrencyEuroOff,
    IconFilter,
    IconFilterOff,
    IconLayoutGrid,
    IconLayoutList,
    IconPlus, IconRuler2Off, IconRulerMeasure, IconRulerOff,
    IconSearch
} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {GridViewMode} from "./ProductGrid";
import {usePB} from "../lib/pocketbase";
import {useForm} from "@mantine/form";
import LocationInput, {GeoLocation} from "./LocationInput";
import {useQuery} from "react-query";
import InserateProductDialog from "./InserateProductDialog";
import {Prism} from "@mantine/prism";
import CategorySelect from "./CategorySelect";
import {CategoryModel} from "../models";
import Link from "next/link";
import TextWithIcon from "./TextWithIcon";
import {calculateBoundingBox} from "../lib/util";

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

const RandomCategoriesWithTransition = ({height, show}: {
    height: number,
    show: boolean
}) => {

    const [scroll] = useWindowScroll()

    return (
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
                mounted={show}
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
    )
}

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
const SearchBtn = ({onClick, disabled}: { onClick: () => void, disabled: boolean }) => {
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
                boxShadow: theme.shadows.lg,
            })}
        >
            <Text
                span
                color={disabled ? "gray" : "green"}
                underline={!disabled}
                sx={(theme) => ({
                    textDecorationThickness: 2
                })}
            >
                Stöbern
            </Text>
        </Button>

        <Box
            sx={(theme) => ({
                position: "absolute",
                top: -29,
                left: 85,
                [theme.fn.smallerThan(theme.breakpoints.sm)]: {
                    display: "none"
                }
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

const SloganWithTransition = ({height, show}: {
    height: number,
    show: boolean
}) => {
    const [scroll] = useWindowScroll()
    return <Box
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
            mounted={show}
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
}

const Search = ({
                    viewMode,
                    toggleViewMode,
                    setFilter,
                    search
                }: {
    viewMode: GridViewMode
    toggleViewMode: () => void,
    setFilter: (filter: string | null) => void,
    search: () => void
}) => {

    const {pb} = usePB()

    const [scroll] = useWindowScroll()

    const theme = useMantineTheme()

    const height = Math.max(0, 300 - scroll.y ** 1.5)

    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`, true, {getInitialValueInEffect: false})

    const [showFilters, setShowFilters] = useState(false)

    const [showInserateProductDialog, setShowInserateProductDialog] = useState(false)

    const formValues = useForm({
        initialValues: {
            search: "",
            categories: [] as string[],
            maxPrice: 0,
            location: null as GeoLocation | null,
            maxRange: 0,
        }
    })

    const filterForPrice = formValues.values.maxPrice !== 0
    const filterForRange = formValues.values.maxRange !== 0


    useEffect(() => {
        const locationFilter = () => {
            if (formValues.values.location && formValues.values.maxRange !== 0) {
                const box = calculateBoundingBox(formValues.values.location.lat, formValues.values.location.lon, formValues.values.maxRange)
                console.table(box)
                return `location_lat<='${box.maxLatitude}'&&location_lat>='${box.minLatitude}'&&location_lon<='${box.maxLongitude}'&&location_lon>='${box.minLongitude}'`
            }
            return null
        }

        const priceFilter = () => {
            if (formValues.values.maxPrice !== 0) {
                return `price<='${formValues.values.maxPrice}'`
            }
            return null
        }

        const categoryFilter = () => {
            if (formValues.values.categories.length > 0) {
                return formValues.values.categories.map((c) => `categories.id?='${c}'`).join("||")
            }
            return null
        }
        setFilter([
            locationFilter(),
            priceFilter(),
            categoryFilter(),
            formValues.values.search ? `name?~'${formValues.values.search}'` : null
        ].filter((e) => e !== null).join("&&"))
    }, [formValues.values, setFilter])

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

            <SloganWithTransition show={!showFilters} height={height}/>

            <RandomCategoriesWithTransition height={height} show={!showFilters}/>

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
                        <TextInput
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

                                    <Tooltip label={showFilters ? "Filter verbergen" : "Filter anzeigen"}>
                                        <ActionIcon size={32} radius="xl" onClick={() => setShowFilters(b => !b)}>
                                            {showFilters ? <IconFilterOff size={20}/> : <IconFilter size={20}/>}
                                        </ActionIcon>
                                    </Tooltip>
                                </>
                            }
                            placeholder="Nach Produkten suchen ..."
                            rightSectionWidth={84}
                            {...formValues.getInputProps("search")}
                        />

                        <Group position="center">

                            <SearchBtn disabled={formValues.values.search === ""} onClick={search}/>

                            <Text c={"dimmend"}>oder</Text>

                            <InserateBtn onClick={() => setShowInserateProductDialog(true)}/>
                        </Group>
                    </Flex>

                    <Collapse in={showFilters && (isMobile || scroll.y < 20)}>
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
                                        <Slider
                                            my={"sm"}
                                            mx={"xs"}
                                            color={filterForPrice ? "green" : "gray"}
                                            label={(value) => value !== 0 ? `${value * 10}€` : null}
                                            marks={[
                                                {value: 20, label: `200€`},
                                                {value: 50, label: `500€`},
                                                {value: 80, label: `800€`},
                                            ]}
                                            thumbChildren={formValues.values.maxPrice === 0 ?
                                                <IconCurrencyEuroOff size="1rem"/> : <IconCurrencyEuro size="1rem"/>}
                                            thumbSize={26}
                                            styles={{thumb: {borderWidth: rem(2), padding: rem(3)}}}
                                            {...formValues.getInputProps("maxPrice")}
                                        />
                                    </Input.Wrapper>
                                </Stack>

                                <Stack>
                                    <LocationInput
                                        onChange={(value) => formValues.setFieldValue("location", value)}
                                        label={"Region"}
                                        description={"Wo suchst du?"}
                                    />
                                    <Input.Wrapper
                                        label={"Entfernung"}
                                        description={"Wie weit bist du bereit zu fahren?"}
                                    >
                                        <Slider
                                            my={"sm"}
                                            mx={"xs"}
                                            color={filterForRange ? "green" : "gray"}
                                            label={(value) => value !== 0 ? `${value * 5}km` : null}
                                            marks={[
                                                {value: 20, label: `${100}km`},
                                                {value: 50, label: `${250}km`},
                                                {value: 80, label: `${400}km`},
                                            ]}
                                            thumbChildren={formValues.values.maxRange === 0 ?
                                                <IconRuler2Off size="1rem"/> : <IconRulerMeasure size="1rem"/>}
                                            thumbSize={26}
                                            styles={{thumb: {borderWidth: rem(2), padding: rem(3)}}}
                                            disabled={!formValues.values.location}
                                            {...formValues.getInputProps("maxRange")}
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

export default Search