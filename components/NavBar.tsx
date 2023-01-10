import {
    Box,
    Group,
    Badge,
    Divider,
    ActionIcon,
    Text,
    Container,
    Button,
    Modal,
    TextInput,
    PasswordInput, Code, Drawer, Textarea, Checkbox, Flex, MediaQuery, Popover, Title
} from "@mantine/core";
import {FaCarrot, FaCheck, FaLockOpen, FaThumbsUp, FaUser, FaUserLock, FaUserPlus} from "react-icons/all";
import Link from "next/link";
import {useState} from "react";
import Register from "./Register";

export default function NavBar() {

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const countSteps = 3

    return <>

        <Modal
            opened={showRegister}
            onClose={() => setShowRegister(false)}
            title="Registrieren"
        >
            <Register close={() => setShowRegister(false)}/>
        </Modal>

        <Flex
            justify={"center"}
            sx={(theme) => ({
                top: 0,
                backgroundColor: "white",
                zIndex: 100,
                width: "100%",
                position: "fixed",
                boxShadow: theme.shadows.md,
                // 1320px
            })}>

            <Box
                mx={"sm"}
                sx={(theme) => ({
                    width: "960px",
                })}
                px={0}
                p={"sm"}
            >

                <Group position="apart">

                    <Button
                        size={"md"}
                        component={Link}
                        href={"/"}
                        passHref
                        variant={"outline"}
                        //gradient={{from: 'teal', to: 'blue', deg: 45}}
                        leftIcon={<FaCarrot/>}
                        sx={(theme) => ({
                            fontFamily: 'Aclonica, sans-serif',
                            boxShadow: theme.shadows.md
                        })}
                    >
                        Kleinsteanzeigen
                    </Button>

                    <Group spacing={"sm"}>

                        <MediaQuery styles={{display: "none"}} smallerThan={"xs"}>
                            <Badge
                                leftSection={<FaCheck/>}
                                color={"gray"}
                            >
                                Trusted Online Shop
                            </Badge>
                        </MediaQuery>

                        <Popover width={400} trapFocus position="bottom-end" withArrow shadow="md" opened={showLogin}
                                 onChange={() => setShowLogin(l => !l)}>

                            <Popover.Target>

                                <ActionIcon
                                    size={"xl"}
                                    onClick={() => setShowLogin(true)}
                                    sx={(theme) => ({
                                        borderRadius: theme.radius.sm,
                                        boxShadow: theme.shadows.md,

                                    })}
                                    //variant={"gradient"}
                                    //gradient={{from: 'cyan', to: 'green', deg: 45}}
                                    color={"blue"}
                                >
                                    <FaUserLock/>
                                </ActionIcon>
                            </Popover.Target>

                            <Popover.Dropdown>

                                <Title order={3}>Anmelden</Title>

                                <TextInput label="Anmeldename" placeholder="Anmeldename" mb={"sm"}/>
                                <PasswordInput label="Passwort" placeholder="Passwort" mb={"sm"}/>

                                <Group>
                                    <Button
                                        //variant={"gradient"}
                                        //gradient={{from: 'teal', to: 'blue', deg: 45}}
                                        leftIcon={<FaLockOpen/>}
                                        onClick={() => setShowLogin(false)}
                                    >
                                        Einloggen
                                    </Button>

                                    <Text>oder</Text>

                                    <Button
                                        //variant={"gradient"}
                                        //gradient={{from: 'blue', to: 'green', deg: 45}}
                                        leftIcon={<FaUser/>}
                                        onClick={() => {
                                            setShowLogin(false)
                                            setShowRegister(true)
                                        }}
                                    >
                                        Konto erstellen
                                    </Button>
                                </Group>

                            </Popover.Dropdown>

                        </Popover>

                    </Group>

                </Group>

            </Box>

        </Flex>
    </>
}