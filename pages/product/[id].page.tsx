import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {ProductModel} from "../../models";
import {usePB} from "../../lib/pocketbase";
import {Box, LoadingOverlay, Title, useMantineTheme} from "@mantine/core";
import {
    IconArrowsDiagonal,
    IconArrowsMoveHorizontal,
    IconArrowsMoveVertical,
    IconBox,
    IconBoxOff,
    IconHome,
    IconHomeOff,
    IconWeight
} from "@tabler/icons-react";
import NotFound from "../../components/ErrorMessage";
import HTML from "../../components/HTML";
import ImageLightbox from "../../components/ImageLightbox";
import TextWithIcon from "../../components/TextWithIcon";
import {convertLength, convertWeight} from "../../lib/util";
import React from "react";

export default function ProductView() {

    const router = useRouter()
    const {pb} = usePB()
    const theme = useMantineTheme()

    const {id} = router.query as { id: string }

    const productQuery = useQuery<ProductModel>({
        queryKey: ['product', id],
        queryFn: () => pb.collection("products").getOne(id),
        enabled: !!id
    })

    if (!id || productQuery.isLoading) {
        return <LoadingOverlay visible={true}/>
    }

    if (productQuery.isError) {
        return <>
            <NotFound label={"Produkt nicht gefunden"} description={"Leider konnten wir das Produkt nicht finden."}/>
        </>
    }

    return <>


        <Box
            mb={"sm"}
            sx={(theme) => ({

                display: "flex",
                flexDirection: "row",

                gap: theme.spacing.sm,

            })}

        >

            <Box
                sx={(theme) => ({
                    borderRadius: theme.radius.md,
                    overflow: "hidden",
                    boxShadow: theme.shadows.sm,
                    minHeight: 300,
                    minWidth: 300,

                })}
            >
                <ImageLightbox
                    src={productQuery.data!.images.map(img => pb.getFileUrl(productQuery.data!, img))}
                    alt={productQuery.data!.name}
                />
            </Box>

            <Box
                sx={(theme) => ({
                    flexGrow: 1,
                    padding: theme.spacing.md,
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.md,
                })}
            >

                <Title color={"green"} order={1} mb={"sm"}>
                    {productQuery.data!.name}
                </Title>

                <Title order={2} color={"blue"}>
                    {productQuery.data!.price === 0 ? "VB" : "Preis: " + productQuery.data!.price + "€"}
                </Title>

                <TextWithIcon Icon={IconArrowsMoveVertical}>
                    {convertLength(productQuery.data!.height)}
                </TextWithIcon>

                <TextWithIcon Icon={IconArrowsMoveHorizontal}>
                    {convertLength(productQuery.data!.width)}
                </TextWithIcon>

                <TextWithIcon Icon={IconArrowsDiagonal}>
                    {convertLength(productQuery.data!.depth)}
                </TextWithIcon>

                <TextWithIcon Icon={IconWeight}>
                    {convertWeight(productQuery.data!.weight)}
                </TextWithIcon>

                <TextWithIcon Icon={productQuery.data!.shipping ? IconBox : IconBoxOff} truncate>
                    {productQuery.data!.shipping ? "Versand" : "Kein Versand"}
                </TextWithIcon>

                <TextWithIcon Icon={productQuery.data!.pickup ? IconHome : IconHomeOff} truncate>
                    {productQuery.data!.pickup ? "Abholung" : "Keine Abholung"}
                </TextWithIcon>
            </Box>

            <Box
                sx={(theme) => ({
                    border: "1px solid blue",
                })}
            >
                Verkäufer / Aktionen
            </Box>


        </Box>


        <Box
            sx={(theme) => ({
                border: "1px solid cyan",
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.md,
            })}
        >

            <Title order={2} color={"green"} mb="sm">Beschreibung</Title>

            <HTML html={productQuery.data!.description}/>

        </Box>

    </>
}