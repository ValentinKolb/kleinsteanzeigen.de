import {createStyles, Title, Text, Button, Container, Group, rem} from '@mantine/core';
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: rem(80),
        paddingBottom: rem(80),
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(220),
        lineHeight: 1,
        marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(120),
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(38),

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(32),
        },
    },

    description: {
        maxWidth: rem(500),
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    },
}));

export default function NotFoundTitle() {
    const {classes} = useStyles();

    return (
        <Container className={classes.root}>
            <div className={classes.label}>404</div>
            <Title className={classes.title}>Du hast einen geheimen Ort gefunden</Title>
            <Text color="dimmed" size="lg" align="center" className={classes.description}>
                Leider haben wir den eigentlich angefragten Inhalt nicht gefunden. Möglicherweise war der Link falsch
                oder die Seite wurde auf eine andere URL verschoben.
            </Text>
            <Group position="center">
                <Button variant="subtle" size="md"
                        component={Link}
                        href={"/"}
                >
                    Zurück zur Startseite
                </Button>
            </Group>
        </Container>
    );
}