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
    Flex, Badge, ActionIcon, MultiSelect, RangeSlider, BoxProps, Stack, TextInput, Dialog, Modal, Collapse
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
import {useState} from "react";
import {useClickOutside} from "@mantine/hooks";
import InserateProductDialog from "../components/InserateProductDialog";

const Search = ({close, ...props}: BoxProps & { close: () => void }) => {
    return <Box
        mb={"sm"}
        {...props}
    >
        <Stack
            //    justify={"space-between"}
            h={"100%"}
        >
            <Box>
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

            <Group position={"left"}>
                <Button
                    variant={"outline"}
                    onClick={close}
                    sx={(theme) => ({
                        bottom: 0,
                        alignSelf: "flex-start",
                    })}
                >
                    Abbrechen
                </Button>

                <Button
                    variant={"outline"}
                    // gradient={{from: "teal", to: "cyan"}}
                    //color={"gray"}
                    onClick={close}
                    leftIcon={<FaSearch/>}
                    sx={(theme) => ({
                        bottom: 0,
                        alignSelf: "flex-start",
                    })}
                >
                    Suchen
                </Button>
            </Group>
        </Stack>
    </Box>
}

const Badges = () => {
    return <Group mb={"sm"} grow>

        <Badge
            leftSection={<FaMapPin/>}
            variant={"outline"}
            //color={"gray"}
        >
            Lokal
        </Badge>

        <Badge
            leftSection={<FaHandshake/>}
            variant={"outline"}
            //color={"gray"}
        >
            Direkt
        </Badge>

        <Badge
            leftSection={<FaTree/>}
            variant={"outline"}
            //color={"gray"}
        >
            Nachhaltig
        </Badge>

        <Badge
            leftSection={<FaUsers/>}
            variant={"outline"}
            //color={"gray"}
        >
            Persönlich
        </Badge>

        <Badge
            leftSection={<FaLink/>}
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

            <Box py={"sm"}>

                <Flex
                    mb={"sm"}
                    dir={"row"}
                    align="center"
                    gap="md"
                    py={"sm"}
                    sx={(theme) => ({
                        borderRadius: theme.radius.md,
                        //  backgroundImage: `url("/background.svg")`,
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
                        leftIcon={<FaSearch/>}
                        onClick={() => setShowSearch(b => !b)}
                        sx={{boxShadow: "0 0 10px 5px white;",}}
                    >
                        Stöbern
                    </Button>


                    <Text c={"dimmend"} sx={{
                        // textShadow: "black 0px 0 10px"
                    }}>oder</Text>

                    <Button
                        variant={"outline"}
                        leftIcon={<FaPlus/>}
                        sx={{boxShadow: "0 0 10px 5px white;",}}
                        onClick={() => setShowInserateProductDialog(true)}
                    >
                        Selbst inserieren
                    </Button>
                </Flex>

                <Collapse in={showSearch}>
                    <Search close={() => setShowSearch(false)} mb={"lg"}/>
                </Collapse>

                <Badges/>

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
