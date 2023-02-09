import {Center, createStyles, rem, Text, TextProps} from "@mantine/core";
import {TablerIconsProps} from "@tabler/icons-react";
import React, {FC} from "react";
import {PolymorphicComponentProps} from "@mantine/utils";

const useStyles = createStyles((theme) => ({
    icon: {
        marginRight: rem(5),
        color: theme.colors.gray[5],
    },
}))

export default function TextWithIcon({
                                         Icon,
                                         ...props
                                     }: { Icon: FC<TablerIconsProps> } & TextProps & PolymorphicComponentProps<any>) {

    const {classes} = useStyles()

    return <Center>
        <Icon size="1.05rem" className={classes.icon} stroke={1.5}/>
        <Text size="xs" {...props}/>
    </Center>

}