import {Group, GroupProps, Progress} from "@mantine/core";

export default function StrengthMeter({
                                          strength,
                                          enabled,
                                          ...props
                                      }: { strength: number, enabled: boolean } & Omit<GroupProps, "children">) {

    return <Group spacing={5} grow {...props}>
        {
            Array(4)
                .fill(0)
                .map((_, index) => (
                    <Progress
                        styles={{bar: {transitionDuration: '0ms'}}}
                        value={
                            enabled && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
                        }
                        color={strength > 80 ? 'green' : strength > 50 ? 'yellow' : 'red'}
                        key={index}
                        size={4}
                    />
                ))
        }
    </Group>
}