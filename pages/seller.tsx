import {
    Badge,
    Breadcrumbs,
    Group,
    Box,
    Anchor,
    Title,
    Grid,
    Divider,
    Flex,
    Avatar,
    Text,
    Rating,
    Stack, Skeleton, Center, Spoiler, Button, SimpleGrid,
} from "@mantine/core";
import {
    FaBoxes,
    FaCertificate,
    FaChevronDown,
    FaChevronUp,
    FaCouch,
    FaImage,
    FaShoppingBasket,
    FaUser,
    FaUserCheck
} from "react-icons/all";
import ProduktPreview from "../components/ProduktPreview";

export default function Seller() {

    const items = [
        {title: 'Home', href: '/'},
        {title: 'Verkaufende', href: '/'},
        {title: 'Lorem Ipsum', href: 'product'},
    ].map((item, index) => (
        <Anchor href={item.href} key={index} color={"dimmed"}>
            {item.title}
        </Anchor>
    ));

    return (
        <Box py={"sm"}>
            <Group position={"apart"} mb={"sm"}>
                <Breadcrumbs>{items}</Breadcrumbs>
                <Badge
                    color={"gray"}
                    leftSection={<FaShoppingBasket/>}
                >
                    Professioneller Reseller
                </Badge>
            </Group>

            <Box p={"sm"}
                 mb={"sm"}
                 sx={(theme) => ({
                     boxShadow: theme.shadows.md,
                     borderRadius: theme.radius.md,
                 })}
            >
                <Title order={1}>Lorem Ipsum</Title>
            </Box>

            <Grid justify="space-between" align="stretch">

                <Grid.Col xs={3} md={2}>

                    <Box pos={"relative"}>
                        <Box sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 1,
                            height: "100%",
                            width: "100%",
                        }}>
                            <Center
                                h={"100%"}
                                w={"100%"}
                            >
                                <FaUser/>
                            </Center>
                        </Box>

                        <Skeleton
                            mih={"200px"}
                            w={"100%"}
                            radius="sm"
                        />
                    </Box>
                </Grid.Col>

                <Grid.Col xs={9} md={10}>
                    <Box p={"sm"}
                         mb={"sm"}
                         sx={(theme) => ({
                             boxShadow: theme.shadows.md,
                             borderRadius: theme.radius.md,
                         })}
                    >
                        <Stack align={"start"}>

                            <Title order={2}>
                                Über mich
                            </Title>

                            <Divider w={"100%"}/>

                            <Text c={"dimmed"} mb={"md"}>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                                invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
                                accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                                sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                                sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                                aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                                rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                                amet.
                            </Text>
                        </Stack>


                    </Box>
                </Grid.Col>

            </Grid>

            <Box p={"sm"}
                 mb={"sm"}
                 sx={(theme) => ({
                     boxShadow: theme.shadows.md,
                     borderRadius: theme.radius.md,
                 })}
            >
                <Title order={2} mb={"sm"}>Durchschnitte Bewertung</Title>

                <Group mb={"sm"}>
                    <Rating
                        value={3.5}
                        fractions={2}
                        readOnly
                    />

                    <Text c={"dimmed"}>3.5 von 5</Text>

                </Group>

                <Group mb={"sm"}>
                    <Badge
                        leftSection={<FaCertificate/>}
                        variant={"gradient"}
                        gradient={{from: 'teal', to: 'cyan', deg: 45}}
                    >
                        Insgesamt 12 Bewertungen
                    </Badge>

                    <Badge
                        leftSection={<FaUserCheck/>}
                        variant={"gradient"}
                        gradient={{from: 'cyan', to: 'green', deg: 45}}
                    >
                        Verifiziert
                    </Badge>

                    <Badge
                        leftSection={<FaBoxes/>}
                        variant={"gradient"}
                        gradient={{from: 'green', to: 'teal', deg: 45}}
                    >
                        Pro Seller
                    </Badge>
                </Group>

                <Divider w={"100%"} mb={"sm"}/>

                <Title order={2} mb={"sm"}>Bewertungen</Title>

                <Spoiler
                    maxHeight={300}
                    showLabel={
                        <Button
                            variant={"gradient"}
                            gradient={{from: 'yellow', to: 'orange', deg: 45}}
                            leftIcon={<FaChevronDown/>}
                            mt={"sm"}
                        >
                            Alle Bewertungen anzeigen
                        </Button>
                    }
                    hideLabel={
                        <Button
                            variant={"gradient"}
                            gradient={{from: 'yellow', to: 'orange', deg: 135}}
                            leftIcon={<FaChevronUp/>}
                        >
                            Bewertungen ausblenden
                        </Button>
                    }
                    transitionDuration={5}
                >
                    {Array.from({length: 10}).map((_, index) => (
                        <Box key={index}
                             p={"sm"}
                             mb={"sm"}
                             sx={(theme) => ({
                                 boxShadow: theme.shadows.md,
                                 borderRadius: theme.radius.md,
                             })}
                        >

                            <Group>

                                <Avatar/>


                                <Rating
                                    value={(10 - index) / 2}
                                    fractions={2}
                                    readOnly
                                />


                                <Spoiler maxHeight={50} hideLabel={"Ausblenden"} showLabel={"Mehr anzeigen"}
                                         transitionDuration={.2}>
                                    <Text c={"dimmed"}>
                                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                        eirmod
                                        tempor
                                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                                        eos
                                        et
                                        accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                                        takimata
                                        sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                                        consetetur
                                        sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
                                        magna
                                        aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                                        dolores et
                                        ea
                                    </Text>
                                </Spoiler>

                            </Group>


                        </Box>
                    ))}

                </Spoiler>

            </Box>

            <Divider w={"100%"} mt={"lg"} mb={"sm"}/>

            <Box
                mb={"sm"}
            >
                <SimpleGrid cols={2}>
                    {Array(7).fill(0).map((_, i) => (
                        <ProduktPreview
                            key={i}
                            sx={(theme) => ({
                                borderRadius: theme.radius.md,
                                boxShadow: "none",
                                transition: "all .2s ease",
                                "&:hover": {
                                    boxShadow: theme.shadows.md,
                                    transform: "scale(1.01)",
                                }
                            })}
                        />
                    ))}
                </SimpleGrid>

            </Box>

        </Box>
    )
}