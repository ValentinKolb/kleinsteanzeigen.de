import {PocketbaseError, usePB} from "../lib/pocketbase"
import {useState} from "react";
import {useForm} from "@mantine/form";
import {useMutation} from "react-query";
import {ActionIcon, Button, Group, Menu, Modal, PasswordInput, Popover, Text, TextInput, Title} from "@mantine/core";
import Register from "./Register";
import {
    IconHammer,
    IconHandRock,
    IconLockOpen,
    IconLogin,
    IconLogout,
    IconMessageCircle,
    IconUser,
    IconUserCog,
    IconUserPlus
} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import Account from "./Account";

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

    const {user, logout} = usePB()
    const [opened, {open, close}] = useDisclosure(false);

    return <>

        <Modal size={"lg"} opened={opened} onClose={close} title={`Hallo ${user?.username}`}>
            <Account/>
        </Modal>


        <Menu shadow="md" width={200} position={"bottom-end"}>
            <Menu.Target>
                <ActionIcon
                    size="lg"
                    radius="xl"
                    color={"green"}
                >
                    <IconUser/>
                </ActionIcon>
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
                <Menu.Item icon={<IconHammer size={14}/>}>Meine Auktionen</Menu.Item>

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