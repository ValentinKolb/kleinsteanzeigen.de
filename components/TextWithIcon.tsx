import {Box, Center, createStyles, rem, Text, TextProps} from "@mantine/core";
import {TablerIconsProps} from "@tabler/icons-react";
import React, {FC} from "react";
import {PolymorphicComponentProps} from "@mantine/utils";

const useStyles = createStyles((theme) => ({
    icon: {
        marginRight: 5,
        color: theme.colors.gray[5],
    },
}))

export default function TextWithIcon({
                                         Icon,
                                         ...props
                                     }: { Icon: FC<TablerIconsProps> } & TextProps & PolymorphicComponentProps<any>) {
    return <Box
        sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            flexDirection: "row",
        })}
    >
        <Box
            sx={(theme) => ({
                height: 15,
                width: 15,
                color: theme.colors.gray[5],
                marginRight: 5,
                lineHeight: 1,
            })}
        >
            <Icon size={15} stroke={1.5}/>
        </Box>
        <Text size="xs" {...props}/>
    </Box>
}