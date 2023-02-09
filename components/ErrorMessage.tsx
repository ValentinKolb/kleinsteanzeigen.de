import {Button, Stack, Text, Title, useMantineTheme} from "@mantine/core";
import {IconArrowRight, IconError404, TablerIconsProps} from "@tabler/icons-react";
import {useRouter} from "next/router";
import {FC} from "react";

export default function ErrorMessage({label, description, Action, Icon}: {
    label: string,
    description: string,
    Action?: FC,
    Icon?: FC<TablerIconsProps>
}) {

    Icon = Icon || IconError404

    const theme = useMantineTheme()
    const router = useRouter()

    return <>
        <Stack
            my={"md"}
            spacing={"lg"}
            align={"center"}
        >
            <Title order={1} mb={"sm"}
                   color={"yellow"}
            >
                {label}
            </Title>
            <Icon stroke={1} size={200} color={theme.colors.red[5]}/>
            <Text size={"lg"}
                  color={"yellow"}
            >
                {description}
            </Text>
            {Action ? <Action/> : <Button
                rightIcon={<IconArrowRight/>}
                color={"green"}
                onClick={() => router.push("/")}
            >
                Weiter zu Home
            </Button>}
        </Stack>
    </>
}