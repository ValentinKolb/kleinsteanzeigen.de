import {CategoryModel, ProductModel} from "../models";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {Badge, Box, createStyles, Divider, Group, rem, SimpleGrid, Skeleton, Stack, Text, Title} from "@mantine/core";
import {usePB} from "../lib/pocketbase";
import React from "react";
import {extractFromHtmlString} from "../lib/util";
import ImageLightbox from "./ImageLightbox";
import {IconArchive, IconBox, IconBoxOff, IconHome, IconHomeOff, IconMap, IconMoneybag} from "@tabler/icons-react";
import Link from "next/link";
import TextWithIcon from "./TextWithIcon";


const useStyles = createStyles((theme) => ({
    icon: {
        marginRight: rem(5),
        color: theme.colors.gray[5],
    },
}))

export type GridViewMode = "gridView" | "listView"

const ProductPreview = ({product, mode, loading}: {
    product: ProductModel,
    mode: GridViewMode,
    loading: false
} | {
    product: null,
    mode: GridViewMode,
    loading: true
}) => {

    const {pb} = usePB()

    return <Box
        sx={(theme) => ({
            display: "flex",
            flexDirection: mode === "gridView" ? "column" : "row",
            borderRadius: theme.radius.md,
            overflow: "hidden",

            boxShadow: theme.shadows.sm,

            transition: 'all 0.2s ease-out',
            '&:hover': {
                boxShadow: theme.shadows.xl,
                transform: "scale(1.01)",
            }
        })}
    >
        <Box
            sx={(theme) => ({
                height: mode === "gridView" ? 100 : "100%",
                width: mode === "gridView" ? "100%" : "20%",
                minWidth: 100,
                flexShrink: 0
            })}
        >
            <ImageLightbox
                src={product ? pb.getFileUrl(product, product.images[0]) : ""}
                alt={product ? product.name + " Preview" : "Preview"}
                loading={loading}
            />
        </Box>

        <Box
            sx={(theme) => ({
                height: "100%",
                padding: theme.spacing.md,
                flexShrink: 1,
                width: mode === "gridView" ? "100%" : "80%",
                overflow: "hidden",
            })}
        >
            <Box
                sx={(theme) => ({
                    textDecoration: "none",
                    color: "inherit",
                    '&:hover h3': {
                        color: theme.colors.green[8],
                        textDecoration: "underline"
                    }
                })}
                component={Link}
                href={product ? "/product/" + product.id : "#"}
            >
                <Stack spacing={"xs"}>

                    {loading ?
                        <Skeleton height={20} width={"30%"}/>
                        :
                        <Title order={3} color={"green"} truncate>
                            {product.name}
                        </Title>
                    }

                    {loading ?
                        <Skeleton height={10} width={"90%"}/>
                        :
                        <Text fz="xs" c="dimmed" truncate>
                            {extractFromHtmlString(product.description)}
                        </Text>}

                    {loading ?
                        <Skeleton height={10} width={"20%"}/>
                        :
                        <Text
                            sx={(theme) => ({
                                color: theme.colors.blue[7],
                                fontSize: theme.headings.sizes.h3.fontSize,
                                fontWeight: 700
                            })}
                            truncate
                        >
                            {product.price == 0 ? "VB" : product.price + "€"}
                        </Text>
                    }
                </Stack>

                <Divider my={"sm"}/>

                <Box
                    sx={(theme) => ({

                        display: "flex",
                        alignItems: "start",
                        flexDirection: mode === "gridView" ? "column" : "row",
                        justifyContent: mode === "gridView" ? "space-between" : "flex-start",
                        flexWrap: "wrap",
                        gap: theme.spacing.md

                    })}
                >
                    {loading ?
                        <Skeleton height={10}/>
                        :
                        <Box sx={(thema) => ({
                            width:  mode === "gridView" ?  "100%" : "auto",
                        })}
                        >
                            <TextWithIcon Icon={product.shipping ? IconBox : IconBoxOff} truncate>
                                {product.shipping ? "Versand" : "Kein Versand"}
                            </TextWithIcon>
                        </Box>
                    }
                    {loading ?
                        <Skeleton height={10}/>
                        :
                        <Box sx={(thema) => ({
                            width: mode === "gridView" ?  "100%" : "auto",
                        })}
                        >
                            <TextWithIcon Icon={product.pickup ? IconHome : IconHomeOff} truncate>
                                {product.pickup ? "Abholung" : "Keine Abholung"}
                            </TextWithIcon>
                        </Box>
                    }
                    {loading ?
                        <Skeleton height={10}/>
                        :
                        <Box sx={(thema) => ({
                            width: mode === "gridView" ?  "100%" : "auto",
                        })}
                        >
                            <TextWithIcon
                                Icon={IconMap}
                                truncate
                            >
                                {product.location_name}
                            </TextWithIcon>
                        </Box>
                    }
                </Box>

                <SimpleGrid
                    breakpoints={mode === "gridView" ? [
                        {minWidth: 'xs', cols: 1},
                        {minWidth: 'sm', cols: 2},
                    ] : [
                        {minWidth: 'xs', cols: 2},
                        {minWidth: 'sm', cols: 4},


                    ]}
                    sx={{width: "100%"}}
                >


                </SimpleGrid>


                <Divider my={"sm"}/>
            </Box>

            {loading ?
                <Group>
                    <Skeleton height={20} width={"30%"} radius={"xl"}/>
                    <Skeleton height={20} width={"30%"} radius={"xl"}/>
                </Group>
                :

                <>
                    {(product?.archived || product?.sold) && <>
                        <Group>
                            {
                                product?.sold && <Badge
                                    variant="light" color="green"
                                    leftSection={<IconMoneybag size={14} stroke={1}/>}
                                >
                                    Verkauft
                                </Badge>
                            }
                            {
                                product?.archived && <Badge
                                    variant="light" color="blue"
                                    leftSection={<IconArchive size={14} stroke={1}/>}
                                >
                                    Archiviert
                                </Badge>
                            }
                        </Group>
                        <Divider my={"sm"}/>
                    </>}

                    <Group>
                        {product.expand.categories.map((category: CategoryModel) => (
                            <Badge
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                }}
                                variant="light"
                                color="gray"
                                key={category.id}
                                component={Link}
                                href={"/category/" + category.id}
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </Group>
                </>
            }
        </Box>
    </Box>
}

export default function ProductGrid({products, mode, loading}: {
    products: ProductModel[],
    mode: GridViewMode,
    loading: boolean,
}) {

    const [autoAnimateRef] = useAutoAnimate()

    return <>
        <SimpleGrid cols={mode === "gridView" ? 2 : 1} breakpoints={[
            {minWidth: 'xs', cols: mode === "gridView" ? 3 : 1},
            {minWidth: 'md', cols: mode === "gridView" ? 4 : 1},
        ]} ref={autoAnimateRef}>
            {loading ?
                new Array(14).fill(null).map((v, index) => (
                    <ProductPreview key={index} product={v} mode={mode} loading={true}/>
                ))
                :
                products.map((product, index) => (
                    <ProductPreview key={product.id} product={product} mode={mode} loading={false}/>
                ))
            }
        </SimpleGrid>
    </>


}