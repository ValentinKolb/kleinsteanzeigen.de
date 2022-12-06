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
    Flex, Badge, MediaQuery, MultiSelect, RangeSlider
} from "@mantine/core";
import ProduktPreview from "../components/ProduktPreview";
import {
    FaEye, FaFilter,
    FaHandshake,
    FaLink,
    FaMapPin,
    FaPlus,
    FaRuler,
    FaSearch,
    FaTree,
    FaUserCheck,
    FaUsers
} from "react-icons/all";

export default function Home() {
    return (
        <>
            <Box py={"sm"}>


                <Flex
                    mb={"sm"}
                    dir={"row"}
                    align="center"
                    gap="md"
                    p={"xl"}
                    sx={(theme) => ({
                        borderRadius: theme.radius.md,
                        backgroundImage: `url("/background.svg")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        transition: "all 0.2s ease-in-out",
                        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                            justifyContent: "center"
                        }
                    })}
                >
                    <Box
                        sx={(theme) => ({
                            boxShadow: "0 0 10px 5px white;",
                            borderRadius: theme.radius.md,
                            padding: "5px",
                            backgroundImage: `linear-gradient(45deg, ${theme.colors.blue[5]}, ${theme.colors.teal[5]})`,
                            transition: "all 2s ease-in-out",
                            "&:hover": {
                                backgroundImage: `linear-gradient(45deg, ${theme.colors.cyan[5]}, ${theme.colors.indigo[5]})`,
                            }

                        })}
                    >
                        < Box
                            sx={(theme) => ({
                                borderRadius: theme.radius.md,
                                padding: "5px",
                                backgroundColor: "white",
                            })}
                        >
                            <Title order={1}>Inserate</Title>
                        </Box>

                    </Box>


                    <Text c={"white"} sx={{
                        textShadow: "black 0px 0 10px"
                    }}>oder</Text>

                    <Button
                        variant={"gradient"}
                        gradient={{from: "teal", to: "cyan"}}
                        leftIcon={<FaPlus/>}
                        sx={{boxShadow: "0 0 10px 5px white;",}}
                    >
                        Selbst inserieren
                    </Button>
                </Flex>

                <Group mb={"sm"} grow>

                    <Badge
                        leftSection={<FaMapPin/>}
                        variant={"gradient"}
                        gradient={{from: 'cyan', to: 'green', deg: 45}}
                    >
                        Lokal
                    </Badge>

                    <Badge
                        leftSection={<FaHandshake/>}
                        variant={"gradient"}
                        gradient={{from: 'green', to: 'teal', deg: 45}}
                    >
                        Direkt
                    </Badge>

                    <Badge
                        leftSection={<FaTree/>}
                        variant={"gradient"}
                        gradient={{from: 'green', to: 'lime', deg: 45}}
                    >
                        Nachhaltig
                    </Badge>

                    <Badge
                        leftSection={<FaUsers/>}
                        variant={"gradient"}
                        gradient={{from: 'lime', to: 'yellow', deg: 45}}
                    >
                        Persönlich
                    </Badge>

                    <Badge
                        leftSection={<FaLink/>}
                        variant={"gradient"}
                        gradient={{from: 'yellow', to: 'orange', deg: 45}}
                    >
                        ... mehr zu unseren Werten
                    </Badge>
                </Group>


                <Box
                    mb={"sm"}
                >
                    <Autocomplete
                        mb={"sm"}
                        label={"Suche"}
                        description={"Suche nach Produkten"}
                        placeholder={"Suche"}
                        icon={<FaSearch/>}
                        data={['iPhone (trending)', 'Sofa', 'Pflanzen']}
                    />

                    <Autocomplete
                        mb={"sm"}
                        label="Region"
                        icon={<FaMapPin/>}
                        placeholder="Ulm, Baden-Württemberg, ..."
                        description={"Von wo aus suchst du?"}
                        data={['Ulm', 'Augsburg']}
                    />

                    <NumberInput
                        mb={"sm"}
                        label={"Entfernung"}
                        description={"Wie weit willst du fahren? (in km)"}
                        icon={<FaRuler/>}
                    />

                    <MultiSelect
                        data={["Schmuck", "Kleidung", "Elektronik", "Möbel", "Pflanzen", "Sonstiges"]}
                        label="Kategorien"
                        description={"In welchen Kategorien suchst du?"}
                        icon={<FaFilter/>}
                    />

                    <RangeSlider
                        my={"lg"}
                        label={null}
                        color={"teal"}
                        marks={[
                            {value: 20, label: '10€'},
                            {value: 50, label: '100€'},
                            {value: 80, label: '1.000€'},
                        ]}
                    />

                    <Button
                        variant={"gradient"}
                        gradient={{from: "teal", to: "cyan"}}
                        leftIcon={<FaSearch/>}
                    >
                        Suchen
                    </Button>

                </Box>


                <SimpleGrid cols={2}>

                    {Array(21).fill(0).map((_, i) => (<ProduktPreview key={i}/>))}

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
