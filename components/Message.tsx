import {Image, Stack, Text, Title, useMantineTheme} from "@mantine/core";
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
            <Title order={1} mb={"sm"} color={"green"}>
                {label}
            </Title>

            <Image
                height={100}
                fit={"contain"}
                src={"/teddy_wave.png"}
                alt={"Teddy"}
                />

            <Text size={"lg"} color={"dimmed"}>
                {description}
            </Text>

            {Action && <Action/>}
        </Stack>

    </>
}