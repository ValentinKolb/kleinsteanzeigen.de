import {usePB} from "../../lib/pocketbase";
import {useQuery} from "react-query";
import {CategoryModel} from "../../models";
import {Box, Divider, Image, LoadingOverlay, SimpleGrid, Text, Title} from "@mantine/core";
import React from "react";
import Link from "next/link";

const CategoryCard = ({category}: { category: CategoryModel }) => {

    const {pb} = usePB()

    return <>

        <Box
            component={Link}
            href={`/category/${category.id}`}
            sx={(theme) => ({
                padding: theme.spacing.md,
                boxShadow: theme.shadows.sm,
                borderRadius: theme.radius.md,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.md,

                transition: 'all 0.2s ease-out',
                '&:hover': {
                    boxShadow: theme.shadows.xl,
                    transform: "scale(1.01)",
                },
                '&:hover h4': {
                    color: theme.colors.green[8],
                    textDecoration: "underline"
                }
            })}
        >

            <Box

                sx={(theme) => ({

                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.md,
                    [theme.fn.smallerThan('lg')]: {
                        flexDirection: "row",
                    },

                })}
            >
                <Image
                    src={pb.getFileUrl(category, category.icon)}
                    alt={category.name}
                    height={50}
                    width={50}
                />
                <Box

                    sx={(theme) => ({
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: theme.spacing.md,
                        justifyContent: "space-between"
                    })}
                >

                    <Title order={4} color={"green"}>{category.name}</Title>
                    <Divider
                        size="lg"
                        color={"yellow"}
                        sx={(theme) => ({
                            width: "40%",
                        })}
                    />
                </Box>
            </Box>
            <Text color={"dimmed"}>
                {category.description}
            </Text>
        </Box>

    </>
}

export default function Categories() {

    const {pb} = usePB()

    const categoriesQuery = useQuery(
        {
            queryKey: ["categories"],
            queryFn: async () => await pb
                .collection("categories")
                .getFullList<CategoryModel>({
                    sort: "name"
                })
        }
    )

    return <>

        <LoadingOverlay visible={categoriesQuery.isLoading}/>

        <Title
            order={1}
            mb={"md"}
            color={"green"}
        >
            Kategorien
        </Title>

        <SimpleGrid breakpoints={[
            {minWidth: "xs", cols: 1},
            {minWidth: "sm", cols: 2},
            {minWidth: "md", cols: 3},

        ]} spacing={20}>
            {
                categoriesQuery.data?.map(category => {
                    return <CategoryCard category={category} key={category.id}/>
                })
            }
        </SimpleGrid>

    </>


}