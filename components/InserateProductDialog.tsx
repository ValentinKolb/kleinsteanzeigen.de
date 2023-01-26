import {useState} from "react";
import {
    Group,
    Stepper,
    Button,
    ActionIcon,
    TextInput,
    MultiSelect,
    Textarea,
    Box,
    Skeleton,
    Input,
    Text, Stack, Center, Title, Table, Modal, NumberInput, Badge, List
} from "@mantine/core";
import Dropzone, {DropzoneState} from "react-dropzone";
import {IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {Carousel} from "@mantine/carousel";
import {
    IconChevronLeft,
    IconChevronRight,
    IconEye, IconHeartHandshake,
    IconPencil,
    IconPhoto,
    IconRuler,
    IconTrash,
    IconUpload
} from "@tabler/icons";

export default function InserateProductDialog({close}: { close: () => void }) {

    const [active, setActive] = useState(1);
    const countSteps = 4;
    const nextStep = () => setActive((current) => (current < countSteps ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


    return <>

        <Stepper active={active} onStepClick={setActive} breakpoint={"sm"}>
            <Stepper.Step description="Start" icon={<IconRuler/>}>
                <TextInput
                    label={"Produktname"}
                    placeholder={"Produktname"}
                    description={"Wie soll dein Produkt heißen?"}
                />
                <MultiSelect data={["Technik", "Haushalt", "Kleidung", "Sonstiges"]}
                             label={"Kategorie"}
                             placeholder={"Kategorie"}
                             description={"In welche Kategorien passen zu deinem Produkt?"}
                             searchable
                             mb={"sm"}
                />


                <Input.Wrapper label="Abmessung" description="Wie groß ist das Produkt (in cm)?" mb={"sm"}>
                    <Group mt={5} position={"apart"}>

                        <NumberInput placeholder={"Höhe"} min={0} sx={{maxWidth: "120px"}}/>

                        <Text>X</Text>

                        <NumberInput placeholder={"Breite"} min={0} sx={{maxWidth: "120px"}}/>

                        <Text>X</Text>

                        <NumberInput placeholder={"Tiefe"} min={0} sx={{maxWidth: "120px"}}/>

                    </Group>
                </Input.Wrapper>


                <NumberInput label={"Gewicht"} description={"Wie schwer ist das Produkt?"}
                             placeholder={"In Gramm"} mb={"sm"}
                />

                <MultiSelect data={["Versand möglich", "Abholung möglich"]} label={"Versand"}
                             placeholder={"Versandarten"} description={"Wie wird das Produkt ausgeliefert?"} mb={"sm"}
                />


            </Stepper.Step>


            <Stepper.Step description="Beschreibung" icon={<IconPencil/>}>

                <Textarea
                    label={"Beschreibung"}
                    placeholder={"Beschreibung"}
                    description={"Beschreibe dein Produkt. Du kannst Markdown benutzten."}
                    minRows={10}
                    mb={"sm"}
                />

                <Textarea
                    label={"Lieferumfang"}
                    placeholder={"- Produkt\n- Zubehör"}
                    description={"Was gehört alles dazu? Du kannst Markdown benutzten."}
                    minRows={3}
                />
            </Stepper.Step>
            <Stepper.Step description="Bilder" icon={<IconPhoto/>}>

                <Box mb={"sm"}>

                    <Dropzone
                        maxSize={3 * 1024 ** 2}

                    >
                        {(state: DropzoneState) => <>

                            <Stack
                                align="center"
                                spacing="xl"
                                justify={"center"}
                                sx={(theme) => ({
                                    border: `1px dashed ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                    minHeight: 200,
                                    boxShadow: theme.shadows.sm,
                                })}
                            >

                                <IconUpload size={30}/>

                                <Text size="xl" inline>
                                    Bilder hochladen
                                </Text>
                                <Text size="sm" color="dimmed" mt={7}>
                                    Es können bis zu 8 Bilder hochgeladen werden (je 5mb).
                                </Text>
                            </Stack>
                        </>}

                    </Dropzone>
                </Box>


                <Group
                >

                    {Array.from({length: 5}).map((_, index) => (

                        <Box pos={"relative"} key={index}>

                            <Box sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                zIndex: 1,
                                height: "100%",
                                width: "100%",
                            }}>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    <ActionIcon variant={"transparent"}>
                                        <IconTrash size={10}/>
                                    </ActionIcon>
                                </Box>
                            </Box>

                            <Skeleton
                                height={90}
                                width={90}
                                radius="sm"
                            />
                        </Box>
                    ))}

                </Group>


            </Stepper.Step>

            <Stepper.Step description={"Übersicht"} icon={<IconEye/>}>

                <Table>
                    <tbody>
                    <tr>
                        <td>Produktname</td>
                        <td>Lorem Ipsum</td>
                    </tr>
                    <tr>
                        <td>Kategorie</td>
                        <td><Badge>Technik</Badge></td>
                    </tr>
                    <tr>
                        <td>Abmessung</td>
                        <td><Badge>10</Badge> x <Badge>20</Badge> x <Badge>30</Badge> <Badge color={"gray"}>cm</Badge>
                        </td>
                    </tr>
                    <tr>
                        <td>Gewicht</td>
                        <td><Badge>42</Badge><Badge color={"gray"}>kg</Badge></td>
                    </tr>
                    <tr>
                        <td>Versand</td>
                        <td>Lorem Ipsum</td>
                    </tr>
                    <tr>
                        <td>Lieferumfang</td>
                        <td><List size={"sm"}>
                            <List.Item>Lorem Ipsum</List.Item>
                            <List.Item>Lorem Ipsum</List.Item>
                        </List></td>
                    </tr>
                    <tr>
                        <td>Beschreibung</td>
                        <td>Lorem ipsum dolor ...</td>
                    </tr>
                    <tr>
                        <td>Bilder</td>
                        <td>

                            <Carousel withIndicators loop>
                                {Array(4).fill(0).map((_, i) => (
                                    <Carousel.Slide key={i}>
                                        <Box pos={"relative"}>

                                            <Box sx={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                zIndex: 1,
                                                height: "100%",
                                                width: "100%",
                                            }}>
                                                <Center
                                                    h={"100%"}
                                                    w={"100%"}
                                                >
                                                    <IconPhoto/>
                                                </Center>
                                            </Box>

                                            <Skeleton
                                                mih={"100px"}
                                                w={"100%"}
                                                radius="sm"
                                            />
                                        </Box>
                                    </Carousel.Slide>))}
                            </Carousel>

                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Stepper.Step>

            <Stepper.Completed>
                <Center h={300}>
                    <Text mb={"sm"}>
                        Möchtest du das Produkt wirklich inserieren?
                    </Text>
                </Center>

            </Stepper.Completed>
        </Stepper>

        <Group position={"apart"} mt="sm">
            {active > 0 &&
                <ActionIcon
                    size={"lg"}
                    variant="default"
                    onClick={prevStep}
                >
                    <IconChevronLeft/>
                </ActionIcon>
            }
            {active < countSteps ? (
                <Button
                    onClick={nextStep}
                    rightIcon={<IconChevronRight/>}
                >
                    Nächster Schritt
                </Button>
            ) : (

                <Button
                    rightIcon={<IconHeartHandshake/>}
                    onClick={() => close()}
                >
                    Inserieren
                </Button>

            )}
        </Group>
    </>
}