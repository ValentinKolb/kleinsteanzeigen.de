import {
    Anchor,
    Avatar,
    Badge,
    Box,
    Breadcrumbs,
    Button,
    Center,
    Divider,
    Grid,
    Group,
    Rating,
    SimpleGrid,
    Spoiler,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import ProduktPreview from "../components/ProduktPreview";
import Image from "next/image";
import React from "react";
import data from "../data";
import {
    IconBox,
    IconCertificate,
    IconChevronDown,
    IconChevronUp,
    IconShoppingCart,
    IconUserCheck
} from "@tabler/icons-react";

export default function SellerPage() {

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
                    leftSection={<IconShoppingCart/>}
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
                <Title order={1}>Paul Müller</Title>
            </Box>

            <Grid justify="space-between" align="stretch">
                <Grid.Col xs={3} md={3}>

                    <Center
                        sx={(theme) => ({

                            position: "relative",
                            minHeight: "200px",
                        })}
                    >
                        <Image src={"/images/seller.jpg"} alt={"seller.jpg"}

                               fill={true}
                               objectFit={"cover"}
                        />
                    </Center>
                </Grid.Col>

                <Grid.Col xs={9} md={9}>
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
                                Ich bin Händler aus Leidenschaft. Ich verkaufe nur die besten Produkte.
                                <br/>
                                Ich verkaufe seit 2015 auf verschiedenen Plattformen und habe mich auf
                                die Verkauf von hochwertigen Möbeln spezialisiert.
                                <br/>
                                Alle meine Produkte sind in einem sehr guten Zustand und werden von mir
                                vor dem Verkauf auf ihre Qualität geprüft.
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
                        color={"blue"}
                    />

                    <Text c={"dimmed"}>3.5 von 5</Text>

                </Group>

                <Group mb={"sm"}>
                    <Badge
                        leftSection={<IconCertificate/>}
                        //variant={"gradient"}
                        //gradient={{from: 'teal', to: 'cyan', deg: 45}}
                    >
                        Insgesamt 12 Bewertungen
                    </Badge>

                    <Badge
                        leftSection={<IconUserCheck/>}
                        //variant={"gradient"}
                        //gradient={{from: 'cyan', to: 'green', deg: 45}}
                    >
                        Verifiziert
                    </Badge>

                    <Badge
                        leftSection={<IconBox/>}
                        //variant={"gradient"}
                        //gradient={{from: 'green', to: 'teal', deg: 45}}
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
                            //variant={"gradient"}
                            //gradient={{from: 'yellow', to: 'orange', deg: 45}}
                            leftIcon={<IconChevronDown/>}
                            mt={"sm"}
                        >
                            Alle Bewertungen anzeigen
                        </Button>
                    }
                    hideLabel={
                        <Button
                            //variant={"gradient"}
                            //gradient={{from: 'yellow', to: 'orange', deg: 135}}
                            leftIcon={<IconChevronUp/>}
                        >
                            Bewertungen ausblenden
                        </Button>
                    }
                    transitionDuration={5}
                >
                    {Array.from({length: 10}).map((_, index) => (

                        <React.Fragment key={index}>

                            <Box
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
                                        color={"blue"}
                                    />
                                    <Spoiler maxHeight={50} hideLabel={"Ausblenden"} showLabel={"Mehr anzeigen"}
                                             transitionDuration={.2}>
                                        <Text c={"dimmed"}>
                                            Ein sehr tolles Produkt habe ich erhalten, jedoch etwas zu teuer.
                                            Ich bin fasziniert von der noch guten Qualität dieser Uhr. Kann ich nur
                                            weiterempfehlen!
                                            Leider nur kein Schlag wie versprochen.
                                            Hervorragende Sammlerstücke! Das antike Design der Uhren gefällt mir sehr.
                                            Werde ich auf jeden Fall weiterempfehlen.
                                        </Text>
                                    </Spoiler>
                                </Group>
                            </Box>
                        </React.Fragment>
                    ))}
                </Spoiler>

            </Box>

            <Divider w={"100%"} mt={"lg"} mb={"sm"}/>

            <Box
                mb={"sm"}
            >
                <SimpleGrid cols={2}>
                    {data.map((product, i) => (
                        <ProduktPreview
                            product={product}
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