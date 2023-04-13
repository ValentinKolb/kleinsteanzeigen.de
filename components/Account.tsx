import {PocketbaseError, usePB} from "../lib/pocketbase";
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Group,
    Input,
    Text,
    TextInput,
    ThemeIcon,
    Title,
    Tooltip,
    UnstyledButton
} from "@mantine/core";
import {UserModel} from "../models";
import {useState} from "react";
import {IconCertificate, IconCertificateOff, IconCheck, IconPencil, IconPencilPlus, IconX} from "@tabler/icons-react";
import ImageSelect from "./ImageSelect";
import {useForm} from "@mantine/form";
import {useMutation} from "react-query";
import TextWithIcon from "./TextWithIcon";
import TextEditor from "./TextEditor";
import HTML from "./HTML";
import {removeEmptyTagsFromHtmlString} from "../lib/util";
import {useRouter} from "next/router";

const ProfileAvatar = ({user, refresh}: { user: UserModel, refresh: () => Promise<any> }) => {

    const {pb} = usePB()

    const [showImageUpload, setShowImageUpload] = useState(false)
    const formValues = useForm({
        initialValues: {
            avatar: null as File | null
        }
    })

    const changeAvatarMutation = useMutation<any, PocketbaseError>({
        mutationFn: async () => {
            if (formValues.values.avatar) {
                const data = new FormData()
                data.append("avatar", formValues.values.avatar)
                await pb.collection("users").update(user.id, data)
            }
        },
        onSuccess: async () => {
            formValues.reset()
            setShowImageUpload(false)
            await refresh()
        }
    })

    const avatarSrc = formValues.values.avatar ? URL.createObjectURL(formValues.values.avatar) : user.avatar ? pb.getFileUrl(user, user.avatar) : null

    return <>
        <Box
            sx={(theme) => ({
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: 100,
                width: 100,
            })}
        >
            {
                showImageUpload && !formValues.values.avatar ? <Box
                    sx={(theme) => ({
                        width: "100%",
                        height: "100%",
                    })}
                >
                    <ImageSelect
                        onChange={(file) => formValues.setFieldValue("avatar", file[0])}
                        fileCount={formValues.values.avatar ? 1 : 0}
                        maxFileCount={1}
                        small
                    />
                    <ActionIcon
                        sx={(theme) => ({
                            top: 5,
                            right: 5,
                            position: "absolute",
                        })}
                        aria-label={"Bild verwerfen"}
                        onClick={() => {
                            formValues.reset()
                            setShowImageUpload(false)
                        }}
                    >
                        <IconX/>
                    </ActionIcon>
                </Box> : <>
                    <Avatar
                        src={avatarSrc}
                        alt={user.username}
                        radius={"md"}
                        sx={(theme) => ({
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            "&:hover": {
                                boxShadow: theme.shadows.md
                            }
                        })}
                    />
                    {
                        formValues.values.avatar ? <>
                                <Box
                                    sx={(theme) => ({
                                        position: "absolute",
                                        bottom: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-evenly",
                                        gab: theme.spacing.md,
                                        width: "100%"
                                    })}
                                >
                                    <ActionIcon
                                        variant={"light"}
                                        color={"green"}
                                        aria-label={"Bild hochladen"}
                                        onClick={() => changeAvatarMutation.mutate()}
                                        loading={changeAvatarMutation.isLoading}
                                    >
                                        <IconCheck/>
                                    </ActionIcon>
                                    <ActionIcon
                                        variant={"light"}
                                        color={"red"}
                                        aria-label={"Bild verwerfen"}
                                        onClick={() => {
                                            formValues.reset()
                                            setShowImageUpload(false)
                                        }}
                                    >
                                        <IconX/>
                                    </ActionIcon>
                                </Box>
                            </>
                            :
                            <ActionIcon
                                onClick={() => setShowImageUpload(true)}
                                color={"green"}
                                variant={"light"}
                                radius={"md"}
                                sx={(theme) => ({
                                    top: 5,
                                    right: 5,
                                    transition: "all 0.2s ease-out",
                                    position: "absolute",
                                })}
                            >
                                <IconPencil/>
                            </ActionIcon>
                    }
                </>
            }
        </Box>
    </>
}

const ProfileEmail = ({user}: { user: UserModel }) => {

    const {pb} = usePB()

    return <Box>

        <TextInput
            label={"E-Mail Adresse"}
            value={user.email}
            disabled={true}
            description={
                user.verified ? (
                    <Box sx={(theme) => ({
                        display: "flex",
                        alignItems: "start",
                    })}>
                        <TextWithIcon Icon={IconCertificate} color={"green"}>
                            E-Mail Adresse verifiziert
                        </TextWithIcon>
                    </Box>
                ) : (
                    <Tooltip label={"E-Mail Adresse verifizieren"} position={"top"} withArrow>
                        <UnstyledButton
                            sx={(theme) => ({
                                textDecoration: "underline",
                                textDecorationColor: theme.colors.yellow[5],
                            })}
                            onClick={() => pb.collection("users").requestVerification(user.email)}
                        >
                            <TextWithIcon Icon={IconCertificateOff} color={"yellow"}>
                                E-Mail Adresse nicht verifiziert
                            </TextWithIcon>
                        </UnstyledButton>
                    </Tooltip>
                )}
        />

    </Box>
}

const ProfileAboutMe = ({user, refresh}: { user: UserModel, refresh: () => Promise<any> }) => {

    const {pb} = usePB()

    const [edit, setEdit] = useState(false)

    const [aboutMe, setAboutMe] = useState(user.aboutMe || "")

    const updateUserMutation = useMutation<any, PocketbaseError>({
        mutationFn: async () => {
            await pb.collection("users").update(user.id, {
                aboutMe: removeEmptyTagsFromHtmlString(aboutMe)
            })
        }
    })

    return <Box
        sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
        })}
    >
        {edit && <>
            <TextEditor
                label={"Über mich"}
                description={"Erzähle uns etwas über dich."}
                onChange={(value) => setAboutMe(value)}
                value={aboutMe}
            />
        </>}

        {!edit && aboutMe !== "" && <>
            <Input.Wrapper
                label={"Über mich"}
                description={"Erzähle uns etwas über dich."}
            >
                <UnstyledButton
                    onClick={() => setEdit(true)}
                    sx={(theme) => ({
                        position: "relative",
                        boxShadow: theme.shadows.sm,
                        padding: theme.spacing.md,
                        borderRadius: theme.radius.md,
                        cursor: "text",
                        width: "100%",
                    })}
                >
                    <HTML
                        html={aboutMe}
                        sx={(theme) => ({
                            color: theme.colors.gray[7],
                            fontSize: theme.fontSizes.sm,
                        })}
                    />
                    <ThemeIcon
                        color={"green"}
                        variant={"light"}
                        radius={"md"}
                        sx={(theme) => ({
                            top: 5,
                            right: 5,
                            transition: "all 0.2s ease-out",
                            position: "absolute",
                            cursor: "pointer",
                        })}
                    >
                        <IconPencil/>
                    </ThemeIcon>
                </UnstyledButton>
            </Input.Wrapper>
        </>}
        {!edit && aboutMe === "" && <Box
            sx={(theme) => ({
                lineHeight: 1,
            })}
        >
            <Button
                compact
                color={"green"}
                variant={"light"}
                leftIcon={<IconPencilPlus/>}
                onClick={() => setEdit(true)}
            >
                Über mich hinzufügen
            </Button>
        </Box>}
        {edit && <Group>
            <Button
                compact
                color={"green"}
                variant={"light"}
                leftIcon={<IconCheck/>}
                onClick={() => updateUserMutation.mutateAsync().then(async () => {
                    setEdit(false)
                    setAboutMe(removeEmptyTagsFromHtmlString(aboutMe || ""))
                    await refresh()
                })}
                loading={updateUserMutation.isLoading}
            >
                Speichern
            </Button>
            <Button
                compact
                color={"red"}
                variant={"light"}
                leftIcon={<IconX/>}
                onClick={() => {
                    setEdit(false)
                    setAboutMe(user.aboutMe || "")
                }}
            >
                Abbrechen
            </Button>
        </Group>}
    </Box>
}

export default function Account() {

    const {user, refresh} = usePB()
    const router = useRouter()

    const formValues = useForm({
        initialValues: {
            avatar: null as File | null
        }
    })

    const refreshMutation = useMutation<any, PocketbaseError>({
        mutationFn: async () => {
            await refresh()
        }
    })

    if (!user) {
        router.push("/404")
        return <></>
    }

    return <>
        <Box
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.md,
            })}
        >
            <Box
                sx={(theme) => ({
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: theme.spacing.md,
                })}
            >
                <Box sx={(theme) => ({
                    flexShrink: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                })}>
                    <Title order={3}>Profil</Title>

                    <Text color={"dimmed"} size={"xs"}>
                        Hier kannst du deine Einstellungen für dein Profil bearbeiten. Passe deine persönlichen
                        Informationen an
                        und verwalte deine Bestellungen. Bei Fragen stehen wir dir gerne zur Verfügung.
                    </Text>
                </Box>

                <Box sx={(theme) => ({
                    width: 100,
                    height: 100,
                })}>
                    <ProfileAvatar user={user} refresh={refresh}/>
                </Box>
            </Box>
            <TextInput
                disabled
                label={"Benutzername"}
                description={"Unter diesem Namen werden deine Beiträge angezeigt."}
                value={user.username}
            />

            <ProfileEmail user={user}/>

            <ProfileAboutMe user={user} refresh={refresh}/>
        </Box>
    </>
}