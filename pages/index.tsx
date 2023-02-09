import {
    Center,
    Box,
    Autocomplete,
    Text,
    NumberInput,
    Title,
    Pagination,
    SimpleGrid,
    Group,
    Button,
    Flex,
    Badge,
    ActionIcon,
    MultiSelect,
    RangeSlider,
    BoxProps,
    Stack,
    TextInput,
    Dialog,
    Modal,
    Collapse,
    Anchor,
    Input, Tooltip
} from "@mantine/core";
import ProduktPreview from "../components/ProduktPreview";
import {useState} from "react";
import {useClickOutside} from "@mantine/hooks";
import InserateProductDialog from "../components/InserateProductDialog";
import data from "../data";
import {Carousel} from "@mantine/carousel";
import {
    IconChevronDown,
    IconChevronUp,
    IconFilter, IconFilterOff,
    IconHeartHandshake,
    IconLink,
    IconMapPin, IconPlus,
    IconRuler,
    IconSearch,
    IconTree,
    IconUsers
} from "@tabler/icons";

const Badges = () => {
    return <Group mb={"sm"} grow>

        <Badge
            leftSection={<IconMapPin size={12}/>}
            variant={"light"}
            //color={"gray"}
        >
            Lokal
        </Badge>

        <Badge
            leftSection={<IconHeartHandshake size={12}/>}
            variant={"light"}
            //color={"gray"}
        >
            Direkt
        </Badge>

        <Badge
            leftSection={<IconTree size={12}/>}
            variant={"light"}
            //color={"gray"}
        >
            Nachhaltig
        </Badge>

        <Badge
            leftSection={<IconUsers size={12}/>}
            variant={"light"}
            //color={"gray"}
        >
            Persönlich
        </Badge>

        <Badge
            leftSection={<IconLink size={12}/>}
            variant={"light"}
            //color={"gray"}
        >
            ... mehr
        </Badge>
    </Group>
}

export default function Home() {

    const [showSearch, setShowSearch] = useState(false)
    const ref = useClickOutside(() => setShowSearch(false))

    const [showInserateProductDialog, setShowInserateProductDialog] = useState(false)

    const products = data

    return (
        <>
            <Modal
                opened={showInserateProductDialog}
                onClose={() => setShowInserateProductDialog(false)}
                title="Produkt inserieren"
                size={"mlg"}
            >
                <InserateProductDialog close={() => setShowInserateProductDialog(false)}/>
            </Modal>

            <Carousel mx="auto" withIndicators loop height={300} mb={"sm"} withControls={false}>

                {

                    products.map((product, index) => {
                        return (
                            <Carousel.Slide key={index}>
                                <Box
                                    sx={(theme) => ({
                                        borderRadius: theme.radius.md,
                                        boxShadow: theme.shadows.md,
                                        transition: "all 0.2s ease",
                                        cursor: "pointer",
                                    })}
                                    style={{
                                        backgroundImage: `url(/images/${product.images[0]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        height: "100%",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",

                                    }}
                                >
                                    <Stack
                                        align={"start"}
                                        sx={(theme) => ({
                                            marginTop: 20,
                                            marginLeft: 20,
                                            width: "30%",
                                            backgroundColor: "white",
                                            opacity: 0.95,
                                            borderRadius: theme.radius.md,
                                            boxShadow: theme.shadows.xl,
                                            padding: theme.spacing.md,
                                            transition: "all 0.2s ease-in-out",
                                            "&:hover": {
                                                transform: "scale(1.01)",
                                            }
                                        })}
                                    >
                                        <Title size={"xl"}>
                                            {product.name}
                                        </Title>

                                        <Group>


                                            <Badge variant={"filled"} color={"green"}>
                                                {product.price}€
                                            </Badge>

                                            <Badge color={"yellow"} variant={"outline"}>
                                                Sonderangebot
                                            </Badge>
                                        </Group>


                                        <Text lineClamp={3}>
                                            {product.description}
                                        </Text>


                                        <Anchor color={"blue"}
                                                href={`/product?productName=${encodeURIComponent(product.name)}`}>
                                            Mehr erfahren
                                        </Anchor>

                                    </Stack>
                                </Box>
                            </Carousel.Slide>)
                    })
                }
            </Carousel>

            <Box>
                <Box mb={"sm"}>

                    <Flex
                        gap={"sm"}
                        direction={{base: 'column', sm: 'row'}}
                        sx={(theme) => ({})}
                    >
                        <Autocomplete
                            sx={(theme) => ({
                                flexGrow: 1,
                            })}
                            placeholder={"Suche"}
                            data={['iPhone (trending)', 'Sofa', 'Pflanzen']}
                            rightSection={
                                <Tooltip label={showSearch ? "Filter verbergen" : "Filter anzeigen"}>
                                    <ActionIcon size={32} onClick={() => setShowSearch(b => !b)}>
                                        {showSearch ? <IconFilterOff size={20}/> : <IconFilter size={20}/>}
                                    </ActionIcon>
                                </Tooltip>
                            }
                        />

                        <Group position="center">
                            <Button
                                variant={"outline"}
                                leftIcon={<IconSearch/>}
                                color={"green"}
                            >
                                Stöbern
                            </Button>

                            <Text c={"dimmend"}>oder</Text>

                            <Button
                                variant={"outline"}
                                color={"yellow"}
                                leftIcon={<IconPlus/>}
                                onClick={() => setShowInserateProductDialog(true)}
                            >
                                Selbst inserieren
                            </Button>

                        </Group>

                    </Flex>

                    <Collapse in={showSearch}>
                        <Box my={"sm"}>
                            <SimpleGrid breakpoints={[
                                {minWidth: 'xs', cols: 2, spacing: 'sm'},
                                {maxWidth: 'xs', cols: 1, spacing: 'sm'},
                            ]}>
                                <Stack>
                                    <MultiSelect
                                        data={["Schmuck", "Kleidung", "Elektronik", "Möbel", "Pflanzen", "Sonstiges"]}
                                        label="Kategorien"
                                        description={"In welchen Kategorien suchst du?"}
                                        icon={<IconFilter/>}
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
                                    <Autocomplete
                                        label="Region"
                                        icon={<IconMapPin/>}
                                        placeholder="Ulm, Baden-Württemberg, ..."
                                        description={"Von wo aus suchst du?"}
                                        data={['Ulm', 'Augsburg']}
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

                <SimpleGrid cols={2}>
                    {products.map((product, i) => (<ProduktPreview key={i} product={product}/>))}
                </SimpleGrid>

                <Center>
                    <Pagination
                        total={10}
                        sx={(theme) => ({
                            boxShadow: theme.shadows.md,
                            padding: theme.spacing.sm,
                            borderRadius: theme.radius.md,
                        })}
                    />
                </Center>

            </Box>

        </>
    )
}
