import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head"
import {Container, MantineProvider, Box, BadgeStylesParams} from "@mantine/core"
import NavBar from "../components/NavBar"
import "@fontsource/aclonica"


export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>Kleinsteanzeigen</title>
                <meta name="description" content="Kleinsteanzeigen - der Ort um krass einzukaufen"/>
                <link rel="icon" href="/favicon.svg"/>
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colors: {
                        brand: ['#86B817', '#86B817', '#86B817', '#86B817', '#86B817', '#86B817', '#86B817', '#86B817', '#86B817', '#86B817']
                    },
                    primaryColor: 'brand',
                    components: {
                        Badge: {
                            styles: (theme, {variant}: BadgeStylesParams) => ({})
                        }
                    }
                }}
            >
                <main>
                    <NavBar/>
                    <Container
                        //size={"xl"}
                        sx={(theme) => ({
                            marginTop: "85px",
                            boxShadow: theme.shadows.md,
                        })}
                    >
                        <Component {...pageProps} />
                    </Container>
                </main>
            </MantineProvider>
        </>
    );
}
