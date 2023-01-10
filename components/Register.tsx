import {useState} from "react";
import {
    FaCheck,
    FaChevronLeft,
    FaChevronRight,
    FaHandshake,
    FaInfo,
    FaPen,
    FaRulerCombined,
    FaUser
} from "react-icons/all";
import {ActionIcon, Button, Checkbox, Divider, Group, PasswordInput, Stepper, Textarea, TextInput} from "@mantine/core";

export default function Register({close}: { close: () => void }) {
    const [active, setActive] = useState(1);
    const countSteps = 3;
    const nextStep = () => setActive((current) => (current < countSteps ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return <>

        <Stepper active={active} onStepClick={setActive} breakpoint={"sm"}>
            <Stepper.Step icon={<FaUser/>}>
                <TextInput withAsterisk label="Anmeldename" placeholder="Anmeldename" mb={"sm"}/>
                <TextInput label="Telefonnummer" placeholder="Telefonnummer" mb={"sm"}/>
                <TextInput withAsterisk label="E-Mail" placeholder="E-Mail" mb={"sm"}/>
            </Stepper.Step>

            <Stepper.Step icon={<FaInfo/>}>
                <PasswordInput withAsterisk label="Passwort" placeholder="Passwort" mb={"sm"}/>
                <PasswordInput withAsterisk label="Passwort wiederholen" placeholder="Passwort wiederholen" mb={"sm"}/>
            </Stepper.Step>

            <Stepper.Step icon={<FaPen/>}>
                <Textarea label="Über dich" placeholder="Erzähle anderen etwas über dich" mb={"sm"} minRows={4}/>
            </Stepper.Step>

            <Stepper.Completed>
                <Checkbox.Group
                    label="Ich möchte ..."
                    mb={"sm"}
                >
                    <Checkbox value="buy" label="kaufen"/>
                    <Checkbox value="sell" label="verkaufen"/>
                </Checkbox.Group>

                <Divider mb={"sm"}/>

                <Checkbox required label="Ich akzeptiere die AGB" mb={"sm"}/>
                <Checkbox label="Ich möchte per Email über neue Angebote oder Chat Nachrichten benachrichtigt werden"
                          mb={"sm"}/>
            </Stepper.Completed>
        </Stepper>

        <Group position={"apart"} mt="sm">
            {active > 0 &&
                <ActionIcon
                    size={"lg"}
                    variant="default"
                    onClick={prevStep}
                >
                    <FaChevronLeft/>
                </ActionIcon>
            }
            {active < countSteps ? (
                <Button
                    onClick={nextStep}
                    rightIcon={<FaChevronRight/>}
                >
                    Nächster Schritt
                </Button>
            ) : (

                <Button
                    rightIcon={<FaCheck/>}
                    onClick={() => close()}
                >
                    Registrieren
                </Button>

            )}
        </Group>

    </>
}