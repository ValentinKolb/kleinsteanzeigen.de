import {BoxProps, Box, Skeleton, Group, Rating, Badge, Stack, Text, Tooltip} from "@mantine/core";
import {useRouter} from "next/router";
import {FaEuroSign} from "react-icons/all";

export default function ProduktPreview(props: BoxProps) {

    const rounter = useRouter()

    return (
        <Box
            onClick={() => rounter.push("/product")}
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

            <Group
                sx={(theme) => ({
                    alignItems: "start"
                })}
            >

                <Box sx={(theme) => ({
                    transition: "all 0.2s ease",
                    "&:hover": {
                        boxShadow: theme.shadows.sm,
                    }
                })}>
                    <Skeleton height={150} width={150}/>
                </Box>

                <Stack sx={(theme) => ({
                    flexGrow: 1,
                })}>

                    <Group position={"apart"}>
                        <Skeleton
                            height={30}
                            width={"20%"}
                            radius="md"
                        />

                        <Tooltip label={"Verkäufer*in Rating"} position={"bottom"} withArrow color="teal">
                            <Rating
                                value={3.5}
                                fractions={2}
                                readOnly
                                sx={(theme) => ({
                                    alignSelf: "flex-start",
                                })}
                            />
                        </Tooltip>
                    </Group>

                    <Box>

                        <Badge
                            variant={"gradient"}
                            gradient={{from: "cyan", to: "green", deg: 45}}
                        >
                            42 €
                        </Badge>

                    </Box>

                    <Box>

                        <Skeleton
                            height={8}
                            radius="xl"
                            mb={"sm"}
                        />
                        <Skeleton
                            height={8}
                            radius="xl"
                            mb={"sm"}
                        />
                        <Skeleton
                            height={8}
                            radius="xl"
                            mb={"sm"}
                            width={"80%"}
                        />

                    </Box>


                </Stack>

            </Group>
        </Box>
    )
}