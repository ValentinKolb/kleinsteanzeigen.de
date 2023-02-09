import {Box, Flex, Group, Image, Loader, Text} from "@mantine/core";
import Link from "next/link";
import dynamic from "next/dynamic";
import {useWindowScroll} from "@mantine/hooks";

const UserNav = dynamic(() => import("./UserNav"), {
    ssr: false,
    loading: () => <Loader size={"sm"}/>
})

export default function NavBar() {

    const [scroll] = useWindowScroll()

    return <>
        <Flex
            justify={"center"}
            sx={(theme) => ({
                top: 0,
                backgroundColor: "white",
                zIndex: 100,
                width: "100%",
                position: "fixed",
                boxShadow: scroll.y < 15 ? "none" : scroll.y < 25 ? theme.shadows.sm : theme.shadows.md,
                transition: "all 0.2 ease"
            })}>

            <Box
                sx={(theme) => ({
                    width: "960px",
                })}
                p={"xs"}
            >
                <Group position="apart">
                    <Box
                        component={Link}
                        href={"/"}
                        sx={(theme) => ({
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                                textDecoration: "underline",
                                textDecorationThickness: 3,
                                textDecorationColor: theme.colors.yellow[5],
                            },
                            borderRadius: theme.radius.md
                        })}
                    >
                        <Image
                            mr={5}
                            height={30}
                            width={30}
                            alt={"Logo"}
                            src={"/logo.png"}
                            fit={"contain"}
                        />
                        <Box
                            sx={(theme) => ({

                                display: "flex",
                                flexDirection: "row"

                            })}
                        >
                            <Text
                                color={"green"}
                                sx={(theme) => ({

                                    fontSize: theme.headings.sizes.h2.fontSize,
                                    fontWeight: 700,
                                    margin: 0,
                                    padding: 0,
                                    lineHeight: 1,

                                })}
                            >
                                Kleinste
                            </Text>
                            <Text
                                color={"blue"}
                                sx={(theme) => ({

                                    fontSize: theme.headings.sizes.h2.fontSize,
                                    fontWeight: 700,
                                    margin: 0,
                                    padding: 0,
                                    lineHeight: 1,

                                })}
                            >
                                anzeigen
                            </Text>
                        </Box>
                    </Box>
                    <UserNav/>
                </Group>
            </Box>
        </Flex>
    </>
}