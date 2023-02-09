import {Stack, Text, Title, useMantineTheme} from "@mantine/core";
import {TablerIconsProps} from "@tabler/icons-react";
import {FC} from "react";

export default function Message(
    {Action, label, description, Icon}: {
        label: string,
        description: string,
        Action?: FC,
        Icon: FC<TablerIconsProps>
    }
) {

    const theme = useMantineTheme()

    return <>
        <Stack
            my={"md"}
            spacing={"lg"}
            align={"center"}
        >
            <Title order={1} mb={"sm"}
                   variant={"gradient"}
                   gradient={{
                       from: "green",
                       to: "yellow",
                   }}
            >
                {label}
            </Title>

            <Icon stroke={1} size={200} color={theme.colors.green[5]}/>

            <Text size={"lg"}
                  variant={"gradient"}
                  gradient={{
                      from: "green",
                      to: "yellow",
                  }}
            >
                {description}
            </Text>

            {Action && <Action/>}
        </Stack>

    </>
}