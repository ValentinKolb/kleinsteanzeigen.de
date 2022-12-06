import {
    Box,
    Group,
    Badge,
    Center,
    ActionIcon,
    Text,
    Container,
    Button,
    Modal,
    TextInput,
    PasswordInput, Code, Drawer, Textarea, Checkbox, Flex, MediaQuery
} from "@mantine/core";
import {FaCarrot, FaCheck, FaLockOpen, FaThumbsUp, FaUser, FaUserLock, FaUserPlus} from "react-icons/all";
import Link from "next/link";
import {useState} from "react";

export default function NavBar() {

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    return <>

        <Drawer
            opened={showRegister}
            onClose={() => setShowRegister(false)}
            title="Account erstellen"
            padding="xl"
            size="xl"
        >
            <TextInput withAsterisk label="Anmeldename" placeholder="Anmeldename" mb={"sm"}/>
            <TextInput label="Telefonnummer" placeholder="Telefonnummer" mb={"sm"}/>
            <TextInput withAsterisk label="E-Mail" placeholder="E-Mail" mb={"sm"}/>
            <PasswordInput withAsterisk label="Passwort" placeholder="Passwort" mb={"sm"}/>
            <PasswordInput withAsterisk label="Passwort wiederholen" placeholder="Passwort wiederholen" mb={"sm"}/>
            <Textarea label="Über dich" placeholder="Erzähle anderen etwas über dich" mb={"sm"}/>
            <Checkbox required label="Ich akzeptiere die AGB" mb={"sm"}/>
            <Checkbox label="Ich möchte per Email über neue Angebote oder Chat Nachrichten benachrichtigt werden"
                      mb={"sm"}/>
            <Button
                variant={"gradient"}
                gradient={{from: 'teal', to: 'blue', deg: 45}}
                leftIcon={<FaUserPlus/>}
                onClick={() => setShowRegister(false)}
            >
                Account erstellen
            </Button>
        </Drawer>


        <Modal
            opened={showLogin}
            onClose={() => setShowLogin(false)}
            title="Login"
        >
            <TextInput label="Anmeldename" placeholder="Anmeldename" mb={"sm"}/>
            <PasswordInput label="Passwort" placeholder="Passwort" mb={"sm"}/>

            <Group>
                <Button
                    variant={"gradient"}
                    gradient={{from: 'teal', to: 'blue', deg: 45}}
                    leftIcon={<FaLockOpen/>}
                    onClick={() => setShowLogin(false)}
                >
                    Einloggen
                </Button>

                <Text>oder</Text>

                <Button
                    variant={"gradient"}
                    gradient={{from: 'blue', to: 'green', deg: 45}}
                    leftIcon={<FaUser/>}
                    onClick={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                    }}
                >
                    Konto erstellen
                </Button>
            </Group>
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
                    width: "1320px",
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
                        variant={"gradient"}
                        gradient={{from: 'teal', to: 'blue', deg: 45}}
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
                                color={"green"}
                            >
                                Trusted Online Shop
                            </Badge>
                        </MediaQuery>

                        <ActionIcon
                            size={"xl"}
                            onClick={() => setShowLogin(true)}
                            sx={(theme) => ({
                                borderRadius: theme.radius.sm,
                                boxShadow: theme.shadows.md,

                            })}
                            variant={"gradient"}
                            gradient={{from: 'cyan', to: 'green', deg: 45}}
                        >
                            <FaUserLock/>
                        </ActionIcon>
                    </Group>

                </Group>

            </Box>

        </Flex>
    </>
}