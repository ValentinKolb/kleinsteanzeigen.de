import React, {forwardRef, useState} from "react";
import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Checkbox, Divider,
    Group,
    Image,
    Input,
    MultiSelect,
    NumberInput,
    NumberInputProps, SimpleGrid,
    Spoiler,
    Stack,
    Stepper,
    Table,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import {
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
    IconCurrencyEuro,
    IconGavel,
    IconHome,
    IconHomeOff,
    IconLink, IconLocation, IconMap,
    IconMoodSad,
    IconPackage,
    IconPackageOff,
    IconPencil,
    IconPhoto, IconPin,
    IconRuler,
    IconX
} from "@tabler/icons-react"
import {PocketbaseError, usePB} from "../lib/pocketbase";
import {useMutation, useQuery} from "react-query";
import {CategoryModel} from "../models";
import TextEditor from "./TextEditor";
import {useForm} from "@mantine/form";
import ImageSelect from "./ImageSelect";
import {useAutoAnimate} from '@formkit/auto-animate/react'
import HTML from "./HTML";
import StrengthMeter from "./StrengthMeter";
import {z} from "zod";
import Message from "./Message";
import CategorySelect from "./CategorySelect";
import LocationInput, {GeoLocation} from "./LocationInput";
import TextWithIcon from "./TextWithIcon";
import {removeEmptyTagsFromHtmlString} from "../lib/util";
import Link from "next/link";


const SizeInput = (props: NumberInputProps) => (
    <NumberInput
        min={0}
        step={0.5}
        precision={1}
        sx={{maxWidth: "120px"}}
        parser={(value) => value!.replace(/(\s?cm)|(,*)/g, '')}
        formatter={(value) =>
            !Number.isNaN(parseFloat(value!))
                ? `${value} cm`
                : ''
        }
        {...props}
    />
)


function PhotoPreview({file, removeFile, size}: { file: File, removeFile?: () => void, size?: number }) {
    const [preview, setPreview] = useState<string | null>(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        setPreview(reader.result as string)
    }

    return (
        <Box sx={(theme) => ({
            height: size ?? 100,
            width: size ?? 100,
            position: "relative",
            borderRadius: theme.radius.md,
            "&:hover": {
                boxShadow: theme.shadows.lg
            }
        })}>
            <Image height={size ?? 100} src={preview} alt={`Vorschau für ${file.name}`} withPlaceholder radius="md"/>
            {removeFile && <ActionIcon
                size={"xs"}
                sx={(theme) => ({
                    backgroundColor: "white",
                    position: "absolute",
                    top: 5,
                    right: 5
                })}
                aria-label={"Löschen"}
                color={"red"}
                onClick={() => removeFile()}
            >
                <IconX/>
            </ActionIcon>}
        </Box>
    )
}

export default function InserateProductDialog({close}: { close: () => void }) {

    const {pb, user} = usePB()

    const [autoAnimateRef] = useAutoAnimate(/* optional config */)

    const [active, setActive] = useState(0)

    const formValues = useForm({
        initialValues: {
            seller: user?.id,
            name: '',
            height: null as number | null,
            width: null as number | null,
            depth: null as number | null,
            weight: null as number | null,
            shipping: false,
            pickup: false,
            categories: [] as string [],
            description: '',
            included: '',
            files: [] as File[],
            price: 0,
            location: null as GeoLocation | null,
        },
        validate: (values) => {
            switch (active) {
                case 0:
                    return {
                        seller: values.seller === undefined ? "Bitte melde dich an" : null,
                        name: z.string().min(3).max(80).safeParse(values.name).success ? null : "Der Name muss zwischen 3 und 80 Zeichen lang sein",
                        shipping: values.pickup === false && values.shipping === false ? "Wähle mindestens eine Versandart aus" : null,
                        pickup: values.shipping === false && values.pickup === false ? "Wähle wähle mindestens eine Versandart aus" : null,
                        categories: 1 <= values.categories.length && values.categories.length <= 3 ? null : "Wähle zwischen 1 und 3 Kategorien aus.",
                        location: location !== null ? null : "Wähle einen Standort aus"
                    }

                case 1:
                    return {
                        description: z.string().min(20).max(10_000).safeParse(values.description).success ? null : "Die Beschreibung muss zwischen 20 und 10.000 Zeichen lang sein",
                        included: z.string().max(500).safeParse(values.included).success ? null : "Der Lieferumfang darf höchstens 500 Zeichen lang sein",
                    }

                case 2:
                    return {
                        files: z.array(z.object({
                            name: z.string(),
                            size: z.number()
                        })).min(1).max(10).safeParse(values.files).success ? null : "Wähle zwischen 1 und 10 Fotos aus",
                    }

                case 3:
                    return {
                        price: z.number().min(0).safeParse(values.price).success ? null : "Der Preis muss mindestens 0 € sein"

                    }
                default:
                    return {}
            }

        },
        validateInputOnChange: true
    })

    const categoriesQuery = useQuery(
        {
            queryKey: ["categories"],
            queryFn: async () => await pb
                .collection("categories")
                .getFullList<CategoryModel>({
                    sort: "name"
                })
        }
    )

    const nextStep = () =>
        setActive((current) => {
            if (formValues.validate().hasErrors) {
                return current;
            }
            return current < 4 ? current + 1 : current;
        })

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

    const createProductMutation = useMutation<any, PocketbaseError>({
        mutationFn: async () => {
            const values = formValues.values
            const data = new FormData()
            data.append("seller", values.seller!.toString())
            data.append("name", values.name)
            data.append("shipping", values.shipping.toString())
            data.append("pickup", values.pickup.toString())
            values.categories.forEach((cat) => data.append("categories", cat))
            data.append("description", removeEmptyTagsFromHtmlString(values.description))
            data.append("included", removeEmptyTagsFromHtmlString(values.included))
            values.files.forEach((file) => data.append("images", file))
            data.append("price", values.price.toString())

            data.append("location_name", values.location!.name)
            data.append("location_lat", values.location!.lat.toString())
            data.append("location_lon", values.location!.lon.toString())

            return await pb.collection("products").create(data)
        }
    })

    if (!user) {
        return <>
            <Stack
                my={"md"}
                spacing={"lg"}
                align={"center"}
            >
                <Title order={1} mb={"sm"}
                       variant={"gradient"}
                       gradient={{
                           from: "green",
                           to: "yellow",
                       }}
                >
                    Bitte logge dich ein
                </Title>

                <IconMoodSad size={200} color={"green"}/>

                <Text size={"lg"}
                      variant={"gradient"}
                      gradient={{
                          from: "green",
                          to: "yellow",
                      }}
                >
                    Damit du ein Produkt einstellen kannst, musst du ein Konto bei uns haben.
                </Text>

                <Button
                    rightIcon={<IconX/>}
                    color={"green"}
                    onClick={() => close()}
                >
                    Fenster schließen
                </Button>
            </Stack>
        </>
    }

    return <>
        <Stepper active={active} onStepClick={setActive} color={"green"}>
            <Stepper.Step allowStepClick={false} allowStepSelect={false} icon={<IconRuler/>}>

                <Title color={"green"} order={3}>Produktname</Title>

                <TextInput
                    data-autofocus
                    placeholder={"Produktname"}
                    description={"Wie soll dein Produkt heißen?"}
                    mb={"sm"}
                    {...formValues.getInputProps('name')}
                />

                <SimpleGrid breakpoints={[
                    {minWidth: 'xs', cols: 1},
                    {minWidth: 'sm', cols: 2},
                ]} spacing={"md"}>
                    <Box>
                        <Title color={"green"} order={4}>Preis</Title>

                        <NumberInput
                            description={"Steigere das Kaufinteresse durch eine Angabe"}
                            data-autofocus
                            placeholder={"Lasse es frei über VB"}
                            min={0}
                            step={5}
                            mb={"sm"}
                            parser={(value) => value!.replace(/(VB)|(\s?€)|(,*)/g, '')}
                            formatter={(value) =>
                                !Number.isNaN(parseFloat(value!))
                                    ? value === "0" ? "VB" : `${value} €`
                                    : 'VB'
                            }
                            {...formValues.getInputProps('price')}
                        />
                    </Box>

                    <Box>
                        <Title color={"green"} order={4}>Standort</Title>
                        <LocationInput
                            description={"Wo befindet sich das Produkt?"} mb={"sm"}
                            onChange={(value) => formValues.setFieldValue("location", value)}
                        />
                    </Box>

                </SimpleGrid>

                <Title color={"green"} order={4}>Kategorie</Title>
                <CategorySelect
                    mb={"sm"}
                    {...formValues.getInputProps('categories')}
                />

                <Title color={"green"} order={4} mb={"sm"}>Versandoptionen</Title>

                <Checkbox
                    label={"Versand"}
                    description={"Ich kann das Produkt auf Wunsch versenden"}
                    mb={"sm"}
                    {...formValues.getInputProps('shipping', {type: "checkbox"})}
                />
                <Checkbox
                    label={"Abholung"}
                    description={"Auf Wunsch kann das Produkt abgeholt werden"}
                    {...formValues.getInputProps("pickup", {type: "checkbox"})}
                />
            </Stepper.Step>

            <Stepper.Step allowStepClick={false} allowStepSelect={false}
                          icon={<IconPencil/>}>

                <Title color={"green"} order={3}>Beschreibung</Title>

                <TextEditor
                    data-autofocus
                    description={"Beschreibe dein Produkt so gut wie möglich."}
                    placeholder={"Was möchtest du verkaufen ..."}
                    mb={"sm"}
                    minHeight={200}
                    {...formValues.getInputProps('description')}
                />

                <Title color={"green"} order={4}>Lieferumfang</Title>

                <TextEditor
                    placeholder={"... und was ist alles dabei?"}
                    description={"Was gehört alles dazu?"}

                    features={{
                        basicFormatting: true,
                        header: false,
                        blockquote: false,
                        hr: false,
                        bulletList: true,
                        orderedList: false,
                        link: false,
                        align: false,
                        color: false
                    }}

                    {...formValues.getInputProps('included')}
                />
            </Stepper.Step>

            <Stepper.Step allowStepClick={false} allowStepSelect={false} icon={<IconPhoto/>}>
                <ImageSelect
                    fileCount={formValues.values.files.length}
                    maxFileCount={8}
                    mb={"sm"}
                    error={formValues.errors.files}
                    onChange={(files) => formValues.setFieldValue("files", [...formValues.values.files, ...files]
                        .filter((file, index, self) => index === self.findIndex((f) => f.name === file.name))
                        .slice(-8))}
                />

                <StrengthMeter
                    strength={formValues.values.files.length * 12.5}
                    enabled={formValues.values.files.length > 0}
                />

                {formValues.values.files.length > 0 &&
                    <Group mt={"sm"} ref={autoAnimateRef}>
                        {formValues.values.files.map((file, index) => (
                            <PhotoPreview
                                key={file.name + file.webkitRelativePath} file={file}
                                removeFile={() => formValues.removeListItem("files", index)}
                            />
                        ))}
                    </Group>
                }
            </Stepper.Step>

            <Stepper.Step allowStepClick={false} allowStepSelect={false}
                          icon={<IconGavel/>}>


                <Title color={"green"} order={3} mb={"sm"}>Übersicht für {formValues.values.name}</Title>

                <Stack>


                    <TextWithIcon Icon={IconMap} truncate color={"dimmed"}>
                        {formValues.values.location?.name}
                    </TextWithIcon>

                    <Group>
                        {formValues.values.files.map((file, index) => (
                            <PhotoPreview
                                size={50}
                                key={file.name + file.webkitRelativePath} file={file}
                            />
                        ))}
                    </Group>

                    <Divider/>

                    <Title color={"gray"} order={5}>Versand</Title>

                    <Group>
                        <Badge
                            color={formValues.values.shipping ? "green" : "yellow"}
                            leftSection={formValues.values.shipping ? <IconPackage size={14}/> :
                                <IconPackageOff size={14}/>}
                        >
                            {formValues.values.shipping ? "Versand möglich" : "Kein Versand"}
                        </Badge>
                        <Badge
                            color={formValues.values.pickup ? "green" : "yellow"}
                            leftSection={formValues.values.pickup ? <IconHome size={14}/> :
                                <IconHomeOff size={14}/>}
                        >
                            {formValues.values.pickup ? "Abholung möglich" : "Keine Abholung"}
                        </Badge>
                    </Group>

                    {removeEmptyTagsFromHtmlString(formValues.values.included) &&

                        <Spoiler maxHeight={40} showLabel="Alles anzeigen" hideLabel="Ausblenden">
                            <HTML sx={(theme) => ({
                                fontSize: theme.fontSizes.sm,
                            })} html={formValues.values.included}/>
                        </Spoiler>}
                    <Divider/>

                    <Title color={"gray"} order={5}>Kategorien</Title>

                    <Group>
                        {
                            formValues.values.categories.map((id) => {
                                const category = categoriesQuery.data?.find(v => v.id === id)
                                return <Badge key={id} color={"gray"}>{category?.name}</Badge>
                            })
                        }
                    </Group>

                    <Divider/>

                    <Title color={"gray"} order={5}>Beschreibung</Title>

                    <Spoiler maxHeight={40} showLabel="Alles anzeigen" hideLabel="Ausblenden">
                        <HTML sx={(theme) => ({
                            fontSize: theme.fontSizes.sm,
                        })} html={formValues.values.description}/>
                    </Spoiler>

                </Stack>

                {createProductMutation.isError && <PocketbaseError error={createProductMutation.error}/>}

            </Stepper.Step>

            <Stepper.Completed>
                <Message
                    label={"Produkt inseriert"}
                    description={"Anzeige ist raus"}
                    Icon={IconGavel}
                    Action={() => <Button
                        component={Link}
                        leftIcon={<IconLink/>}
                        color={"green"}
                        href={`/product/${createProductMutation.data?.id}`}
                    >
                        Zum Produkt
                    </Button>}
                />
            </Stepper.Completed>
        </Stepper>

        <Group position={"apart"} mt="sm">
            {active > 0 && active <= 3 &&
                <ActionIcon
                    size={"lg"}
                    variant="default"
                    onClick={prevStep}
                >
                    <IconChevronLeft/>
                </ActionIcon>
            }
            {active < 3 ? (
                <Button
                    onClick={nextStep}
                    rightIcon={<IconChevronRight/>}
                    disabled={!formValues.isValid()}
                >
                    Nächster Schritt
                </Button>
            ) : active === 3 ? (
                <Button
                    loading={createProductMutation.isLoading}
                    leftIcon={<IconCheck/>}
                    onClick={() => createProductMutation.mutateAsync().then(() => setActive(curr => curr + 1))}
                >
                    Inserieren
                </Button>
            ) : null}
        </Group>
    </>
}