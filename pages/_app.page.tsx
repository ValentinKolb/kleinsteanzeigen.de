import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head"
import {
    ActionIcon,
    Affix,
    BadgeStylesParams,
    Box,
    Container,
    Image,
    MantineProvider,
    Tooltip,
    Transition
} from "@mantine/core"
import NavBar from "../components/NavBar"
import "@fontsource/aclonica"
import {emotionCache} from "./emotion-cache";
import {PocketProvider, usePB} from "../lib/pocketbase";
import {QueryClient, QueryClientProvider} from "react-query";
import {useHover, useWindowScroll} from "@mantine/hooks";
import {IconArrowUp} from "@tabler/icons-react";
import React from "react";

const queryClient = new QueryClient()

const ButtonControls = () => {
    const {user} = usePB()
    const [scroll, scrollTo] = useWindowScroll()

    const {hovered, ref} = useHover()

    return <Affix

        position={{bottom: 20, right: 20}}
        sx={(theme) => ({})}>

        <Transition transition="slide-up" mounted={scroll.y > 20}>
            {(transitionStyles) => (
                <Tooltip label={"Nach oben"} color={"green"} position={"left"}>
                    <ActionIcon
                        style={transitionStyles}
                        mb={5}
                        color={"green"}
                        radius={"xl"}
                        size={"xl"}
                        variant={"light"}
                        sx={(theme) => ({
                            boxShadow: theme.shadows.md,
                        })}
                        onClick={() => scrollTo({...scroll, y: 0})}
                    >
                        <IconArrowUp/>
                    </ActionIcon>
                </Tooltip>
            )}
        </Transition>

        {user &&
            <Tooltip label={"Nachrichten"} color={"green"} position={"left"}>
                <Box ref={ref}>

                    <ActionIcon
                        color={"green"}
                        radius={"xl"}
                        size={"xl"}
                        variant={"light"}
                        sx={(theme) => ({
                            boxShadow: theme.shadows.md,
                        })}
                    >
                        <Image
                            fit={"contain"}
                            height={25}
                            width={25}
                            alt={"Button Animal"}
                            src={hovered ? "/msg_1.png" : "/msg_2.png"}
                        />
                    </ActionIcon>
                </Box>
            </Tooltip>
        }
    </Affix>
}

export default function MyApp({Component, pageProps}: AppProps) {

    return (
        <>
            <Head>
                <title>Kleinsteanzeigen</title>
                <meta name="description" content="Kleinsteanzeigen - der Ort um krass einzukaufen"/>
                <link rel="icon" href="/favicon.png"/>
            </Head>

            <QueryClientProvider client={queryClient}>
                <PocketProvider>
                    <MantineProvider
                        withGlobalStyles
                        withNormalizeCSS
                        emotionCache={emotionCache}
                        theme={{
                            colors: {
                                "green": ['#bad689', '#acce71', '#9ec659', '#90be42', '#82b62a', '#75ae13', '#699c11', '#5d8b0f', '#51790d'],
                                "red": ['#ed8c95', '#ea757f', '#e65e6a', '#e34655', '#df2f40', '#DC192B', '#c61626', '#b01422', '#9a111e'],
                                "blue": ['#8cace5', '#759ce0', '#5e8bdb', '#477ad6', '#306ad1', '#1a5acc', '#1751b7', '#1448a3', '#123e8e'],
                                "yellow": ['#f7cf85', '#f6c66d', '#f4bc54', '#f3b33c', '#f1a924', '#f0a00c', '#d8900a', '#c08009', '#a87008'],
                            },
                            primaryColor: 'green',
                            components: {
                                Badge: {
                                    styles: (theme, {}: BadgeStylesParams) => ({
                                        leftSection: {
                                            alignContent: "center",
                                            display: "flex",
                                        }
                                    })
                                },
                                Input: {
                                    styles: (theme) => ({
                                        input: {
                                            //borderRadius: theme.radius.xl,
                                        }
                                    })
                                },
                                Modal: {
                                    styles: (theme) => ({
                                        title: {
                                            color: theme.colors.green[6],
                                            fontSize: theme.headings.sizes.h2.fontSize,
                                            fontWeight: 700,
                                        }
                                    })
                                }
                            }
                        }}
                    >
                        <main>
                            <NavBar/>
                            <Container
                                sx={(theme) => ({
                                    marginTop: "54px",
                                    height: "100%"
                                })}
                            >
                                <Component {...pageProps} />
                            </Container>
                            <ButtonControls/>
                        </main>
                    </MantineProvider>
                </PocketProvider>
            </QueryClientProvider>
        </>
    )
}