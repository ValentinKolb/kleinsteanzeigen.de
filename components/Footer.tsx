import {createStyles, Container, Group, Anchor, rem, Image} from '@mantine/core';
import React from "react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: rem(120),
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
}));

interface FooterSimpleProps {
    links: { link: string; label: string }[];
}

export function Footer({links}: FooterSimpleProps) {
    const {classes} = useStyles();
    const items = links.map((link) => (
        <Anchor
            component={Link}
            color="dimmed"
            key={link.label}
            href={link.link}
            size="sm"
        >
            {link.label}
        </Anchor>
    ))

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <Image
                    mr={5}
                    height={28}
                    width={28}
                    alt={"Logo"}
                    src={"/msg_animal_1.png"}
                    fit={"contain"}
                />
                <Group className={classes.links}>{items}</Group>
            </Container>
        </div>
    );
}