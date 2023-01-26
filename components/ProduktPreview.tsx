import {BoxProps, Box, Skeleton, Group, Rating, Badge, Stack, Text, Tooltip, Title} from "@mantine/core";
import {useRouter} from "next/router";
import {ProductData} from "../data";
import Image from "next/image";

export default function ProduktPreview({product, ...props}: BoxProps & { product: ProductData }) {

    const rounter = useRouter()

    return (
        <Box
            onClick={() => rounter.push({
                pathname: '/product',
                query: {productName: product.name}
            })}
            sx={(theme) => ({
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                    transform: "scale(1.01)",
                }
            })}
            mb={"sm"}
            p={"sm"}
            {...props}
        >

            <Stack
                sx={(theme) => ({
                    alignItems: "start"
                })}
            >

                <Group>

                    <Box sx={(theme) => ({})}>
                        <Image src={`/images/${product.images[0]}`} alt={product.name} width={150} height={150}/>
                    </Box>

                    <Stack spacing={"md"} align={"start"}>

                        <Text
                            size={"lg"}
                            weight={700}
                            sx={{
                                textOverflow: "ellipsis",
                            }}
                        >
                            {product.name}
                        </Text>

                        <Title
                            order={5}
                            // gradient={{from: "cyan", to: "green", deg: 45}}
                            // color={"blue"}
                            // size={"lg"}
                            color={"brand"}
                        >
                            {product.price} €
                        </Title>

                        <Tooltip label={"Verkäufer*in Rating"} position={"bottom"} withArrow>
                            <Rating
                                value={3.5}
                                fractions={2}
                                readOnly
                                color={"brand"}
                                sx={(theme) => ({
                                    alignSelf: "flex-start",
                                })}
                            />
                        </Tooltip>
                    </Stack>
                </Group>


                <Box>
                    <Text lineClamp={2} color={"dimmed"}>
                        {product.description}
                    </Text>
                </Box>
            </Stack>
        </Box>
    )
}