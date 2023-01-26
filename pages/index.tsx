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
    Flex, Badge, ActionIcon, MultiSelect, RangeSlider, BoxProps, Stack, TextInput, Dialog, Modal, Collapse, Anchor
} from "@mantine/core";
import ProduktPreview from "../components/ProduktPreview";
import {useState} from "react";
import {useClickOutside} from "@mantine/hooks";
import InserateProductDialog from "../components/InserateProductDialog";
import data from "../data";
import {Carousel} from "@mantine/carousel";
import {
    IconFilter,
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
            leftSection={<IconMapPin size={12} />}
            variant={"outline"}
            //color={"gray"}
        >
            Lokal
        </Badge>

        <Badge
            leftSection={<IconHeartHandshake size={12} />}
            variant={"outline"}
            //color={"gray"}
        >
            Direkt
        </Badge>

        <Badge
            leftSection={<IconTree size={12} />}
            variant={"outline"}
            //color={"gray"}
        >
            Nachhaltig
        </Badge>

        <Badge
            leftSection={<IconUsers size={12} />}
            variant={"outline"}
            //color={"gray"}
        >
            Persönlich
        </Badge>

        <Badge
            leftSection={<IconLink size={12} />}
            variant={"outline"}
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
                                        })}
                                    >

                                        <Stack
                                            align={"start"}
                                            sx={(theme) => ({
                                                borderRadius: theme.radius.md,
                                                boxShadow: theme.shadows.md,
                                                backgroundColor: "white",
                                                padding: theme.spacing.md,

                                            })}
                                        >
                                            <Title size={"xl"}>
                                                {product.name}
                                            </Title>

                                            <Badge variant={"outline"} >
                                                {product.price}€
                                            </Badge>

                                            <Text lineClamp={3}>
                                                {product.description}
                                            </Text>

                                            <Anchor href={`/product?productName=${encodeURIComponent(product.name)}`}>
                                                Mehr erfahren
                                            </Anchor>

                                        </Stack>

                                        <Badge color={"green"}>
                                            Sonderangebot
                                        </Badge>

                                    </Stack>
                                </Box>
                            </Carousel.Slide>)
                    })
                }
            </Carousel>

            <Box>
                <Group position="apart" align={"center"}>
                    <Autocomplete
                        sx={(theme) => ({
                            flexGrow: 1,
                        })}
                        mb={"sm"}
                        placeholder={"Suche"}
                        icon={<IconSearch/>}
                        data={['iPhone (trending)', 'Sofa', 'Pflanzen']}
                    />
                    <ActionIcon onClick={() => setShowSearch(b => !b)}>
                        <IconFilter/>
                    </ActionIcon>
                </Group>

                <Collapse in={showSearch}>
                    <Box
                        mb={"sm"}
                    >
                        <Stack
                            //    justify={"space-between"}
                            h={"100%"}
                        >
                            <Box>


                                <Autocomplete
                                    mb={"sm"}
                                    label="Region"
                                    icon={<IconMapPin/>}
                                    placeholder="Ulm, Baden-Württemberg, ..."
                                    description={"Von wo aus suchst du?"}
                                    data={['Ulm', 'Augsburg']}
                                />

                                <NumberInput
                                    mb={"sm"}
                                    label={"Entfernung"}
                                    description={"Wie weit willst du fahren? (in km)"}
                                    icon={<IconRuler/>}
                                />

                                <MultiSelect
                                    data={["Schmuck", "Kleidung", "Elektronik", "Möbel", "Pflanzen", "Sonstiges"]}
                                    label="Kategorien"
                                    description={"In welchen Kategorien suchst du?"}
                                    icon={<IconFilter/>}
                                />

                                <RangeSlider
                                    my={"xl"}
                                    label={null}
                                    //color={"gray"}
                                    marks={[
                                        {value: 20, label: '10€'},
                                        {value: 50, label: '100€'},
                                        {value: 80, label: '1.000€'},
                                    ]}
                                />

                            </Box>
                        </Stack>
                    </Box>
                </Collapse>

                <Flex
                    mb={"sm"}
                    dir={"row"}
                    align="center"
                    gap="md"
                    py={"sm"}
                    sx={(theme) => ({
                        borderRadius: theme.radius.md,
                        // backgroundImage: `url("/background.svg")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        transition: "all 0.2s ease-in-out",
                        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                            justifyContent: "center"
                        }
                    })}
                >
                    <Button
                        variant={"outline"}
                        leftIcon={<IconSearch/>}
                        sx={{boxShadow: "0 0 10px 5px white;",}}
                    >
                        Stöbern
                    </Button>

                    <Text c={"dimmend"} sx={{
                        // textShadow: "black 0px 0 10px"
                    }}>oder</Text>

                    <Button
                        variant={"outline"}
                        leftIcon={<IconPlus/>}
                        sx={{boxShadow: "0 0 10px 5px white;",}}
                        onClick={() => setShowInserateProductDialog(true)}
                    >
                        Selbst inserieren
                    </Button>
                </Flex>


                <Badges/>

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
