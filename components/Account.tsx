import {usePB} from "../lib/pocketbase";
import {ActionIcon, Avatar, Box, TextInput} from "@mantine/core";
import ErrorMessage from "./ErrorMessage";
import {UserModel} from "../models";
import {useState} from "react";
import {IconCheck, IconPencil, IconX} from "@tabler/icons-react";
import ImageSelect from "./ImageSelect";
import {useForm} from "@mantine/form";
import {useHover} from "@mantine/hooks";


const ProfileAvatar = ({user}: { user: UserModel }) => {

    const {pb} = usePB()
    const {hovered, ref} = useHover()

    const [showImageUpload, setShowImageUpload] = useState(false)
    const formValues = useForm({
        initialValues: {
            avatar: null as File | null
        }
    })

    // todo update Avatar

    const avatarSrc = formValues.values.avatar ? URL.createObjectURL(formValues.values.avatar) : user.avatar ? pb.getFileUrl(user, user.avatar) : null

    return <>
        <Box
            ref={ref}
            sx={(theme) => ({
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: 100,
                width: 100
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
                                        onClick={() => setShowImageUpload(true)}
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
                                    opacity: hovered ? 1 : 0,
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

export default function Account() {

    const {user} = usePB()

    const formValues = useForm({
        initialValues: {
            avatar: null as File | null
        }
    })

    if (!user) {
        return <ErrorMessage label={"Account nicht gefunden"} description={"Bitte melde dich erneut an."}/>
    }

    return <>

        <Box>

            <Box
                sx={(theme) => ({
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                })}
            >
                <TextInput
                    disabled
                    label={"Benutzername"}
                    value={user.username}
                />
                <Box>
                    <ProfileAvatar user={user}/>
                </Box>
            </Box>
        </Box>
    </>
}