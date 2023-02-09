import {
    Anchor,
    Avatar,
    Badge,
    Box,
    BoxProps,
    Breadcrumbs,
    Button,
    Center,
    Divider,
    Flex,
    Grid,
    Group,
    List,
    Rating,
    SimpleGrid,
    Skeleton,
    Stack,
    Table,
    Text,
    Title
} from "@mantine/core";
import ProduktPreview from "../components/ProduktPreview";
import {Carousel} from "@mantine/carousel";
import Link from "next/link";
import data, {ProductData} from "../data";
import {useRouter} from "next/router";
import Image from "next/image";
import {
    IconAward, IconBox,
    IconHeartHandshake,
    IconInfoCircle, IconPackgeExport,
    IconRuler,
    IconShoppingBag,
    IconShoppingCart, IconWeight
} from "@tabler/icons";

const ImageCarousel = ({product, ...props}: BoxProps & { product: ProductData }) => {

    return <Box {...props} h={"300px"}>
        <Carousel
            mx="auto"
            withIndicators
            loop
        >
            {product.images.map((imageUrl, i) => (
                <Carousel.Slide key={i}>
                    <Center
                        h={"100%"}
                        w={"100%"}
                    >
                        <Image src={`/images/${imageUrl}`} alt={product.name} width={300} height={300}/>
                    </Center>
                </Carousel.Slide>
            ))}
        </Carousel>
    </Box>
}

const ProductOverview = ({product, ...props}: BoxProps & { product: ProductData }) => {
    return <Box sx={(theme) => ({
        boxShadow: theme.shadows.md,
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    })} {...props}>

        <Stack>

            <Title order={2}>Preis: {product.price}€</Title>

            <Divider w={"100%"}/>

            <Box>

                <Title order={4} mb={"sm"}>Übersicht</Title>

                <Text c={"dimmed"} mb={"md"} lineClamp={3}>
                    {product.description}
                </Text>

            </Box>

        </Stack>

        <Group grow>
            <Button
                sx={(theme) => ({
                    justifySelf: "flex-start",
                })}
                leftIcon={<IconShoppingCart/>}
                variant="filled"
                color={"yellow"}
            >
                Merken
            </Button>

            <Button
                sx={(theme) => ({
                    justifySelf: "flex-start",
                })}
                leftIcon={<IconHeartHandshake/>}
                variant="filled"
                color={"green"}
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
                    Paul Müller
                </Title>
                <Avatar/>
            </Flex>

            <Text c={"dimmed"}>
                Ich bin Händler aus Leidenschaft. Ich verkaufe nur die besten Produkte.
            </Text>

            <Rating
                value={3.5}
                fractions={2}
                readOnly
                color={"green"}
            />
            <Button
                color={"yellow"}
                component={Link}
                href={"/seller"}
                sx={(theme) => ({
                    justifySelf: "flex-start",
                })}
                leftIcon={<IconAward/>}
                variant={"subtle"}
            >
                Bewertungen ansehen
            </Button>

        </Stack>
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
    ))

    const router = useRouter()

    const productName = router.query.productName as string

    const product = data.find(p => p.name === productName)

    if (!product) {
        return <Box>Product not found</Box>
    }

    return (
        <Box py={"sm"}>

            <Group position={"apart"} mb={"sm"}>

                <Breadcrumbs>{items}</Breadcrumbs>

                <Badge color={"green"}>
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
                <Title order={1}>{product.name}</Title>
            </Box>

            <ImageCarousel mb={"sm"} product={product}/>

            <Grid justify="space-between" align="stretch">

                <Grid.Col sm={12} md={8}>
                    <ProductOverview product={product} h={"100%"}/>
                </Grid.Col>

                <Grid.Col sm={12} md={4}>
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
                        <td valign={"top"}><Badge sx={{border: "none"}} variant={"outline"}
                                                  leftSection={<IconInfoCircle size={12}/>}>Beschreibung</Badge>
                        </td>
                        <td valign={"top"}><Text c={"dimmed"}>
                            {product.description}
                        </Text>
                        </td>
                    </tr>


                    <tr>
                        <td valign={"top"}><Badge sx={{border: "none"}} variant={"outline"}
                                                  leftSection={<IconRuler size={12}/>}>Abmessungen</Badge></td>
                        <td valign={"top"}><Text c={"dimmed"}>
                            {product.size.height} X {product.size.width} X {product.size.depth} cm
                        </Text></td>
                    </tr>

                    <tr>
                        <td valign={"top"}><Badge sx={{border: "none"}} variant={"outline"}
                                                  leftSection={<IconWeight size={12}/>}>Gewicht</Badge></td>
                        <td valign={"top"}><Text c={"dimmed"}>{product.weight}kg</Text></td>
                    </tr>

                    <tr>
                        <td valign={"top"}><Badge sx={{border: "none"}} variant={"outline"}
                                                  leftSection={<IconBox size={12}/>}>Lieferumfang</Badge></td>
                        <td valign={"top"}>
                            <List fz={"sm"} c={"dimmed"}>
                                {product.included.map((item, index) => (
                                    <List.Item key={index}>{item}</List.Item>
                                ))}
                            </List>
                        </td>
                    </tr>

                    <tr>
                        <td><Badge sx={{border: "none"}} variant={"outline"}
                                   leftSection={<IconPackgeExport size={12}/>}>Versand</Badge></td>
                        <td>

                            <List fz={"sm"} c={"dimmed"}>
                                {product.shipping &&
                                    <List.Item>Versand möglich</List.Item>
                                }
                                {product.pickup &&
                                    <List.Item>Selbstabholung möglich</List.Item>
                                }
                            </List>

                        </td>
                    </tr>

                    </tbody>


                </Table>

            </Box>

            <Title order={2} mb={"sm"}>Ähnliche Produkte</Title>

            <SimpleGrid cols={3}>

                {data.map((product, index) => (
                    <ProduktPreview key={index} product={product}/>
                ))}


            </SimpleGrid>

        </Box>

    )
}