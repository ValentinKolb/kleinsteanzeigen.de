import {PocketbaseError, usePB} from "../lib/pocketbase"
import {useState} from "react";
import {useForm} from "@mantine/form";
import {useMutation} from "react-query";
import {
    ActionIcon,
    Avatar, Box,
    Button,
    Group, Image,
    Menu,
    Modal,
    PasswordInput,
    Popover,
    Text,
    TextInput, ThemeIcon,
    Title, UnstyledButton
} from "@mantine/core";
import Register from "./Register";
import {
    IconHammer,
    IconHandRock, IconHeart,
    IconLockOpen,
    IconLogin,
    IconLogout,
    IconMessageCircle,
    IconUser, IconUserCircle,
    IconUserCog,
    IconUserPlus
} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import Account from "./Account";
import Link from "next/link";

const LoginButton = () => {

    const {pb} = usePB()

    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const formValues = useForm({
        initialValues: {
            username: '',
            password: '',
        }
    })

    const loginMutation = useMutation<any, PocketbaseError>(async () => {
        await pb.collection("users").authWithPassword(formValues.values.username, formValues.values.password)
    })

    return <>

        <Modal
            opened={showRegister}
            onClose={() => setShowRegister(false)}
            title={"Registrieren"}
            size={"xl"}
        >
            <Register close={() => setShowRegister(false)}/>
        </Modal>

        <Popover width={400} trapFocus position="bottom-end" withArrow shadow="md" opened={showLogin}
                 onChange={() => setShowLogin(l => !l)}>

            <Popover.Target>
                <ActionIcon
                    size={"lg"}
                    radius={"xl"}
                    onClick={() => setShowLogin(true)}
                    color={"blue"}
                >
                    <IconLogin/>
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <form onSubmit={formValues.onSubmit((_ => {
                    loginMutation.mutateAsync().then(() => setShowLogin(false))
                }))}>

                    <Title order={3} color={"green"} mb={"sm"}>Anmelden</Title>

                    <TextInput
                        data-autofocus
                        placeholder="Anmeldename oder Email" mb={"sm"}
                        {...formValues.getInputProps('username')}
                    />
                    <PasswordInput
                        placeholder="Passwort" mb={"sm"}
                        {...formValues.getInputProps('password')}
                    />

                    {loginMutation.isError && <Text mb={"sm"} color={"red"}>Login fehlgeschlagen</Text>}

                    <Group>
                        <Button
                            color={"green"}
                            leftIcon={<IconLockOpen/>}
                            type={"submit"}
                        >
                            Einloggen
                        </Button>

                        <Text>oder</Text>

                        <Button
                            color={"blue"}
                            leftIcon={<IconUserPlus/>}
                            onClick={() => {
                                setShowLogin(false)
                                setShowRegister(true)
                            }}
                        >
                            Registrieren
                        </Button>
                    </Group>

                </form>
            </Popover.Dropdown>

        </Popover>

    </>
}

const UserButton = () => {

    const {user, logout, pb} = usePB()
    const [opened, {open, close}] = useDisclosure(false)

    const avatar = user?.avatar ? pb.getFileUrl(user, user.avatar) : null

    return <>

        <Modal size={"lg"} opened={opened} onClose={close} title={`Account Einstellungen`}>
            <Account/>
        </Modal>

        <Menu shadow="md" width={200} position={"bottom-end"}>
            <Menu.Target>
                {!avatar ?
                    <ActionIcon color={"green"} radius={"xl"} size={"lg"}>
                        <IconUserCircle size="2.125rem"/>
                    </ActionIcon>
                    :
                    <UnstyledButton
                        sx={(theme) => ({
                            borderRadius: 100,
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                            boxShadow: theme.shadows.lg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                boxShadow: theme.shadows.xl,
                                transform: "scale(1.05)",
                            }
                        })}
                    >
                        <Image src={avatar} alt={user?.username} height={35} width={35} fit={"cover"}/>
                        <Box
                            sx={(theme) => ({
                                height: "100%",
                                width: "100%",
                                borderRadius: 100,
                                position: "absolute",

                                top: 0,
                                left: 0,

                                outline: "1px solid rgba(255, 255, 255, 0.5)",
                                outlineOffset: -1,
                            })}
                        />
                    </UnstyledButton>
                }
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label><IconHandRock size={12}/> Hallo {user?.username} </Menu.Label>
                <Menu.Item
                    component={"button"}
                    onClick={() => open()}
                    icon={<IconUserCog size={14}/>}
                >
                    Account
                </Menu.Item>
                <Menu.Item icon={<IconMessageCircle size={14}/>}>Nachrichten</Menu.Item>

                <Menu.Divider/>

                <Menu.Item
                    component={Link}
                    href={"/auctions"}
                    icon={<IconHammer size={14}/>}
                >
                    Meine Inserate
                </Menu.Item>

                <Menu.Item
                    component={Link}
                    href={"/product/my"}
                    icon={<IconHeart size={14}/>}
                >
                    Favoriten
                </Menu.Item>

                <Menu.Divider/>

                <Menu.Item
                    component={"button"}
                    onClick={() => logout()}
                    color="red"
                    icon={<IconLogout size={14}/>}
                >
                    Ausloggen
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>

}

export default function UserNav() {
    const {pb} = usePB()

    return <>
        {
            pb.authStore.isValid ?
                <UserButton/>
                : <LoginButton/>
        }
    </>
}