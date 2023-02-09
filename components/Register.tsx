import {useState} from "react";
import {
    ActionIcon,
    Box,
    Button,
    Center,
    Checkbox,
    Group,
    PasswordInput,
    Stepper,
    Text,
    TextInput,
    Title,
    useMantineTheme
} from "@mantine/core";
import {
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
    IconLogin,
    IconPassword,
    IconPencil,
    IconUser,
    IconX
} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {z} from "zod";
import {PocketbaseError, usePB} from "../lib/pocketbase";
import {useMutation} from "react-query";
import StrengthMeter from "./StrengthMeter";
import TextEditor from "./TextEditor";
import Link from "next/link";
import Message from "./Message";

const telRegex = new RegExp("^(0\\d{1,4})\\s?(\\d{1,12})$")

function PasswordRequirement({meets, label}: { meets: boolean; label: string }) {
    return (
        <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
            <Center inline>
                {meets ? <IconCheck size={15} stroke={1.5}/> : <IconX size={15} stroke={1.5}/>}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    )
}

const PASSWORD_REQUIREMENTS = [
    {re: /[0-9]/, label: 'Enthält Zahlen'},
    {re: /[a-z]/, label: 'Enthält Kleinbuchstaben'},
    {re: /[A-Z]/, label: 'Enthält Großbuchstaben'},
    {re: /[\W_]/, label: 'Enthält Symbole'},
]

function getStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;
    PASSWORD_REQUIREMENTS.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    })
    return Math.max(100 - (100 / (PASSWORD_REQUIREMENTS.length + 1)) * multiplier, 0);
}

export default function Register({close}: { close: () => void }) {
    const [active, setActive] = useState(0)

    const {register, login, pb} = usePB()

    const formValues = useForm({
        initialValues: {
            username: '',
            telephone: '',
            email: '',
            password: '',
            passwordConfirm: '',
            aboutMe: '',
            terms: false,
            emailNotifications: false,
        },

        validate: (values) => {
            switch (active) {
                case 0:
                    return {
                        username: z.string().min(3).safeParse(values.username).success ? null : "Der Anmeldename muss mindestens 3 Zeichen lang sein",
                        email: z.string().email().safeParse(values.email).success ? null : "Ungültige E-Mail (z.B. mail@example.com)",
                        telephone: !values.telephone || z.string().regex(telRegex).safeParse(values.telephone).success ? null : "Ungültige Telefonnummer (z.B.  0123 4567890)",
                    }
                case 1:
                    return {
                        password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/).safeParse(values.password).success ? null : "Ungültiges Passwort",
                        passwordConfirm: values.passwordConfirm && values.passwordConfirm === values.password ? null : "Die Passwörter stimmen nicht überein",
                    }
                case 3:
                    return {
                        terms: values.terms ? null : "Bitte akzeptiere die Nutzungsbedingungen",
                    }
                default:
                    return {}
            }
        },
        validateInputOnChange: true,
    })

    close = () => {
        login(formValues.values.email, formValues.values.password).then(close)
    }

    const nextStep = () =>
        setActive((current) => {
            if (formValues.validate().hasErrors) {
                return current;
            }
            return current < 3 ? current + 1 : current;
        })

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

    const createAccountMutation = useMutation<any, PocketbaseError>(
        async () => {
            await register({
                username: formValues.values.username,
                email: formValues.values.email,
                telephone: formValues.values.telephone || null,
                aboutMe: formValues.values.aboutMe || null,
                password: formValues.values.password,
                passwordConfirm: formValues.values.passwordConfirm,
                emailNotifications: formValues.values.emailNotifications,
                terms: formValues.values.terms,
            })
            return await pb.collection("users").requestVerification(formValues.values.email)
            // return await login(formValues.values.email, formValues.values.password)
        }
    )

    const passwordStrength = getStrength(formValues.values.password)

    const theme = useMantineTheme()

    return <>
        <Stepper active={active} breakpoint={"sm"} color={"green"}>
            <Stepper.Step icon={<IconUser/>} allowStepClick={false} allowStepSelect={false}>
                <Title order={3} color={"green"} mb={"sm"}>
                    Anmeldedaten
                </Title>
                <TextInput
                    data-autofocus
                    withAsterisk
                    label="Anmeldename"
                    description={"Diesen Namen sehen andere Nutzende, wenn sie auf dein Problem gehen."}
                    placeholder="Anmeldename"
                    mb={"sm"}
                    {...formValues.getInputProps('username')}
                />
                <TextInput
                    label="Telefonnummer"
                    description={"Optional. Wenn du deine Nummer hinterlegst können wir dich per SMS kontaktieren."}
                    placeholder="Telefonnummer"
                    mb={"sm"}
                    {...formValues.getInputProps('telephone')}
                />
                <TextInput
                    withAsterisk
                    label="E-Mail"
                    description={"Wenn du das möchtest können wir dir per Mail eine Nachricht schicken wenn dich jemand kontaktiert."}
                    placeholder="E-Mail"
                    mb={"sm"}
                    {...formValues.getInputProps('email')}
                />
            </Stepper.Step>

            <Stepper.Step icon={<IconPassword/>} allowStepClick={false} allowStepSelect={false}>
                <Title order={3} color={"green"} mb={"sm"}>
                    Passwort
                </Title>
                <PasswordInput
                    placeholder="Passwort"
                    description={"Wähle ein sicheres Passwort welches den unten gezeigten Richtlinien entspricht."}
                    label="Passwort"
                    required
                    mb={"sm"}
                    {...formValues.getInputProps('password')}
                />
                <PasswordInput
                    placeholder="Passwort"
                    description={"Gebe dein Passwort bitte noch einmal ein."}
                    label="Passwort wiederholen"
                    required
                    mb={"sm"}
                    {...formValues.getInputProps('passwordConfirm')}
                />

                <StrengthMeter mt="xs" mb="sm" strength={passwordStrength}
                               enabled={formValues.values.password.length > 0}/>

                <PasswordRequirement label="Hat mindestens 6 Zeichen" meets={formValues.values.password.length > 5}/>
                {
                    PASSWORD_REQUIREMENTS.map((requirement, index) => (
                        <PasswordRequirement key={index} label={requirement.label}
                                             meets={requirement.re.test(formValues.values.password)}/>
                    ))
                }
                <PasswordRequirement
                    meets={formValues.values.password === formValues.values.passwordConfirm && !!formValues.values.password}
                    label={"Die Passwörter stimmen überein"}
                />
            </Stepper.Step>

            <Stepper.Step icon={<IconPencil/>} allowStepClick={false} allowStepSelect={false}>
                <Title order={3} color={"green"}>
                    Über dich
                </Title>

                <TextEditor
                    onChange={(v) => formValues.setFieldValue("aboutMe", v)}
                    value={formValues.values.aboutMe}
                    placeholder={"Erzähle anderen etwas über dich, z.B. was möchtest du auf dieser Plattform machen?"}
                    description={"Diesen Text sehen andere Nutzende bei deinen Angeboten oder auf deinem Profil"}
                    minHeight={250}
                />
            </Stepper.Step>

            <Stepper.Step icon={<IconCheck/>} allowStepClick={false} allowStepSelect={false}>
                <Title order={3} color={"green"} mb={"sm"}>
                    Fertigstellen
                </Title>
                <Checkbox
                    required
                    label={<>Ich akzeptiere die <Link href={"/agb"} target={"_blank"}>AGB</Link></>}
                    mb={"sm"}
                    {...formValues.getInputProps('terms', {type: 'checkbox'})}
                />
                <Checkbox
                    label="Ich möchte über Chat Nachrichten per Email benachrichtigt werden (optional)"
                    mb={"sm"}
                    {...formValues.getInputProps('emailNotifications', {type: 'checkbox'})}
                />
                {createAccountMutation.isError && <PocketbaseError error={createAccountMutation.error}/>}
            </Stepper.Step>

            <Stepper.Completed>
                <Message
                    label={"Herzlich Willkommen"}
                    description={"Bitte checke deine E-Mails und bestätige deine E-Mail Adresse."}
                    Icon={IconCheck}
                    Action={() => <Button
                        rightIcon={<IconLogin/>}
                        color={"green"}
                        onClick={() => close()}
                    >
                        Anmelden
                    </Button>}
                />
            </Stepper.Completed>
        </Stepper>

        <Group position={"apart"}>
            {0 < active && active < 4 &&
                <ActionIcon
                    mt="sm"
                    size={"lg"}
                    variant="default"
                    onClick={prevStep}
                >
                    <IconChevronLeft/>
                </ActionIcon>
            }
            {active < 3 ? (
                <Button
                    mt="sm"
                    color={"green"}
                    onClick={nextStep}
                    rightIcon={<IconChevronRight/>}
                    disabled={!formValues.isValid()}
                >
                    Nächster Schritt
                </Button>
            ) : (
                active === 3 ? (
                        <Button
                            mt="sm"
                            rightIcon={<IconCheck/>}
                            onClick={() => {
                                if (formValues.validate().hasErrors) return
                                createAccountMutation
                                    .mutateAsync()
                                    .then(() => {
                                        setActive(active + 1)
                                    })
                            }
                            }
                            disabled={
                                !formValues.isValid()
                            }
                            loading={createAccountMutation.isLoading}
                        >
                            Registrieren
                        </Button>
                    )
                    : null
            )}
        </Group>
    </>
}