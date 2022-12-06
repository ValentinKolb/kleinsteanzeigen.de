import {
    Box,
    Group,
    Skeleton,
    Anchor,
    Breadcrumbs,
    Badge,
    Title,
    Table,
    List,
    SimpleGrid,
    Text,
    Center, Stack,
    Avatar, Rating,
    Button, Flex, Divider,
    Grid, BoxProps, MediaQuery, CSSObject, useMantineTheme, ThemeIcon
} from "@mantine/core";
import {
    FaAward,
    FaBox, FaHandshake, FaImage,
    FaInfoCircle, FaPinterest,
    FaRulerCombined,
    FaShippingFast, FaShoppingBag,
    FaShoppingBasket,
    FaShopware, FaSpeakap,
    FaWeight,
} from "react-icons/all";
import ProduktPreview from "../components/ProduktPreview";
import {Carousel} from "@mantine/carousel";
import Link from "next/link";


const ImageCarousel = (props: BoxProps) => {


    return <Box {...props} h={"300px"}>
        <Carousel
            mx="auto"
            withIndicators
            loop
        >

            {Array(4).fill(0).map((_, i) => (
                <Carousel.Slide key={i}>
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
                                <FaImage/>
                            </Center>
                        </Box>

                        <Skeleton
                            mih={"300px"}
                            w={"100%"}
                            radius="sm"
                        />
                    </Box>
                </Carousel.Slide>
            ))}
        </Carousel>
    </Box>
}

const ProductOverview = (props: BoxProps) => {
    return <Box sx={(theme) => ({
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    })} {...props}>

        <Stack>

            <Title order={2}>Preis: 42€</Title>

            <Divider w={"100%"}/>

            <Box>

                <Title order={4} mb={"sm"}>Übersicht</Title>

                <Text c={"dimmed"} mb={"md"} lineClamp={3}>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
                    accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                    sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                    aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                    rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
                    amet.
                </Text>

            </Box>

        </Stack>

        <Group grow>
            <Button
                sx={(theme) => ({
                    justifySelf: "flex-start",
                })}
                leftIcon={<FaShoppingBag/>}
                variant="gradient"
                gradient={{from: 'indigo', to: 'teal', deg: 60}}
            >
                Merken
            </Button>

            <Button
                sx={(theme) => ({
                    justifySelf: "flex-start",
                })}
                leftIcon={<FaHandshake/>}
                variant="gradient"
                gradient={{from: 'teal', to: 'blue', deg: 60}}
            >
                Verhandeln
            </Button>

        </Group>
    </Box>
}

const SellerOverview = (props: BoxProps) => {
    return <Box sx={(theme) => ({
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    })} {...props}>
        <Stack align={"start"}>

            <Title order={2}>
                Inseriert von
            </Title>

            <Divider w={"100%"}/>

            <Flex
                dir={"row"}
                align="center"
                justify={"space-between"}
                w={"100%"}
            >
                <Title
                    order={4}
                >
                    Lorem Ipsum
                </Title>
                <Avatar/>
            </Flex>

            <Text c={"dimmed"} mb={"md"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>

            <Rating
                value={3.5}
                fractions={2}
                readOnly
            />
        </Stack>
        <Button
            component={Link}
            href={"/seller"}
            sx={(theme) => ({
                justifySelf: "flex-start",
            })}
            leftIcon={<FaAward/>}
            variant={"subtle"}
        >
            Bewertungen ansehen
        </Button>
    </Box>
}

export default function Product() {

    const items = [
        {title: 'Home', href: '/'},
        {title: 'Kategorie', href: '/'},
        {title: 'Produkt', href: 'product'},
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
                <Title order={1}>Lorem ipsum dolor</Title>
            </Box>

            <Grid justify="space-between" align="stretch">

                <Grid.Col md={12} lg={3}>
                    <ImageCarousel h={"100%"}/>
                </Grid.Col>

                <Grid.Col sm={12} md={8} lg={"auto"}>
                    <ProductOverview h={"100%"}/>
                </Grid.Col>

                <Grid.Col sm={12} md={4} lg={3}>
                    <SellerOverview h={"100%"}/>
                </Grid.Col>

            </Grid>


            <Box p={"sm"}
                 mb={"sm"}
                 sx={(theme) => ({
                     boxShadow: theme.shadows.md,
                     borderRadius: theme.radius.md,
                 })}
            >
                <Title order={2} mb={"sm"}>Produktdetails</Title>

                <Table highlightOnHover>

                    <tbody>

                    <tr>
                        <td><Badge leftSection={<FaInfoCircle/>}>Beschreibung</Badge></td>
                        <td><Text
                            c={"dimmed"}>{"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."}</Text>
                        </td>
                    </tr>


                    <tr>
                        <td><Badge leftSection={<FaRulerCombined/>}>Abmessungen</Badge></td>
                        <td><Text c={"dimmed"}>100x200cm</Text></td>
                    </tr>

                    <tr>
                        <td><Badge leftSection={<FaWeight/>}>Gewicht</Badge></td>
                        <td><Text c={"dimmed"}>20kg</Text></td>
                    </tr>

                    <tr>
                        <td><Badge leftSection={<FaBox/>}>Lieferumfang</Badge></td>
                        <td>
                            <List fz={"sm"}>
                                <List.Item> <Text c={"dimmed"}>Lorem</Text></List.Item>
                                <List.Item> <Text c={"dimmed"}>ipsum</Text></List.Item>
                                <List.Item><Text c={"dimmed"}>dolor</Text></List.Item>
                            </List>
                        </td>
                    </tr>

                    <tr>
                        <td><Badge leftSection={<FaShippingFast/>}>Versand</Badge></td>
                        <td><Text c={"dimmed"}>Versand per DHL oder Selbstabholung</Text></td>
                    </tr>

                    </tbody>


                </Table>

            </Box>

            <Title order={2} mb={"sm"}>Ähnliche Produkte</Title>

            <SimpleGrid cols={3}>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
                <ProduktPreview/>
            </SimpleGrid>

        </Box>

    )
}