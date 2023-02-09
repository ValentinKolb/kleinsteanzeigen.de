import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from "next/head"
import {Container, MantineProvider, Box, BadgeStylesParams} from "@mantine/core"
import NavBar from "../components/NavBar"
import "@fontsource/aclonica"
import {emotionCache} from "./emotion-cache";


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
                emotionCache={emotionCache}
                theme={{
                    colors: {
                        "green":  ['#bad689','#acce71','#9ec659','#90be42','#82b62a','#75ae13', '#699c11', '#5d8b0f', '#51790d'],
                        "red":    ['#ed8c95','#ea757f','#e65e6a','#e34655','#df2f40','#DC192B', '#c61626', '#b01422', '#9a111e'],
                        "blue":   ['#8cace5','#759ce0','#5e8bdb','#477ad6','#306ad1','#1a5acc', '#1751b7', '#1448a3', '#123e8e'],
                        "yellow": ['#f7cf85','#f6c66d','#f4bc54','#f3b33c','#f1a924','#f0a00c', '#d8900a', '#c08009', '#a87008'],
                    },
                    //primaryColor: 'yellow',
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
