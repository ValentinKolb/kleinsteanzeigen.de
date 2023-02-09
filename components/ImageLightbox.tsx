import {useDisclosure} from "@mantine/hooks";
import {ActionIcon, Box, Image, Modal, Skeleton, UnstyledButton, useMantineTheme} from "@mantine/core";
import React, {useState} from "react";
import {IconChevronLeft, IconChevronRight, IconPhoto, IconX} from "@tabler/icons-react";
import {useAutoAnimate} from "@formkit/auto-animate/react";

const ImageLightbox = ({src, alt, loading}: { src: string | string[], alt: string, loading?: boolean }) => {

    const [opened, {open, close}] = useDisclosure(false);
    const theme = useMantineTheme()

    const [autoAnimateRef] = useAutoAnimate()
    const slideshow = Array.isArray(src)

    const [active, setActive] = useState(0)

    const next = () => {
        setActive((active + 1) % src.length)
    }
    const prev = () => {
        setActive((active - 1 + src.length) % src.length)
    }

    const minSwipeDistance = 30
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    return <>
        <Modal
            opened={opened}
            onClose={close}
            overlayProps={{
                color: theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }}
            padding={0}
            withCloseButton={false}
            size={"xl"}
            transitionProps={{transition: 'fade', duration: 200}}
        >
            <Box
                sx={{
                    position: "relative"
                }}
            >
                <Image
                    src={slideshow ? src[active] : src}
                    alt={alt}
                    withPlaceholder
                    fit={"cover"}
                    radius={"sm"}
                    sx={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                    }}
                />
                <ActionIcon
                    aria-label={"Schließen"}
                    size={"md"}
                    radius={"sm"}
                    onClick={close}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                    }}
                >
                    <IconX/>
                </ActionIcon>
            </Box>
        </Modal>

        <Box
            sx={(theme) => ({
                height: "100%",
                width: "100%",
                position: "relative",
                overflow: "hidden",
            })}
        >
            {loading ? <>
                    <Skeleton
                        sx={(theme) => ({
                            objectFit: "contain",
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                        })}
                    />
                    <Box
                        sx={(theme) => ({
                            objectFit: "contain",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: theme.colors.gray[5]
                        })}
                    >
                        <IconPhoto
                            stroke={1}
                            size={50}
                        />
                    </Box>
                </> :
                <>
                    <Box
                        sx={(theme) => ({
                            height: "110%",
                            width: "110%",
                            top: "-5%",
                            left: "-5%",
                            backgroundImage: `url('${slideshow ? src[active] : src}')`,
                            backgroundSize: "cover",
                            filter: "blur(20px)",
                            position: "absolute",

                        })}
                    />
                    <Box
                        onTouchStart={(e) => {
                            setTouchEnd(null)
                            setTouchStart(e.targetTouches[0].clientX)
                        }}
                        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                        onTouchEnd={() => {
                            if (!touchStart || !touchEnd) return
                            const distance = touchStart - touchEnd
                            if (distance > minSwipeDistance) prev()
                            if (distance < -minSwipeDistance) next()
                        }}
                        ref={autoAnimateRef}
                        sx={(theme) => ({
                            height: "100%",
                            width: "100%",
                        })}
                    >
                        <Box
                            key={slideshow ? src[active] : src}
                            component={"img"}
                            src={slideshow ? src[active] : src}
                            alt={alt}
                            sx={(theme) => ({
                                objectFit: "contain",
                                position: "absolute",
                                height: "100%",
                                width: "100%",
                                cursor: "zoom-in",
                            })}
                            onClick={() => !loading && open()}
                        />
                    </Box>

                    {slideshow && <>
                        <ActionIcon
                            variant={"light"}
                            aria-label={"Vorheriges Bild"}
                            onClick={prev}
                            sx={(theme) => ({
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                left: 10,
                                transition: "transform 0.1s ease-out",
                                "&:active": {
                                    transform: "scale(0.95) translateY(-50%)"
                                }
                            })}
                        >
                            <IconChevronLeft/>
                        </ActionIcon>
                        <ActionIcon
                            variant={"light"}
                            aria-label={"Nächstes Bild"}
                            onClick={next}
                            sx={(theme) => ({
                                cursor: "pointer",
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                right: 10,
                                transition: "transform 0.1s ease-out",
                                "&:active": {
                                    transform: "scale(0.95) translateY(-50%)"
                                }
                            })}
                        >
                            <IconChevronRight/>
                        </ActionIcon>
                        <Box
                            sx={(theme) => ({
                                width: "100%",
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)",
                                bottom: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                gap: theme.spacing.xs,
                                padding: theme.spacing.xs,
                            })}
                        >
                            {src.map((_, index) => (
                                <UnstyledButton
                                    key={index}
                                    aria-label={"Zu Bild " + (index + 1)}
                                    onClick={() => setActive(index)}
                                    sx={(theme) => ({
                                        cursor: "pointer",
                                        transition: "transform 0.1s ease-out",
                                        "&:hover": {
                                            opacity: "30%"
                                        },
                                        "&:active": {
                                            transform: "scale(0.95) translateY(5%)"
                                        },
                                        flexGrow: 1,
                                        maxWidth: theme.spacing.xl,
                                        height: theme.spacing.xs,
                                        borderRadius: theme.radius.sm,
                                        border: "2px solid " + theme.colors.gray[2],
                                        backgroundColor: index == active ? theme.colors.gray[5] : "transparent",
                                    })}
                                >
                                </UnstyledButton>
                            ))}
                        </Box>
                    </>}
                </>
            }
        </Box>
    </>
}

export default ImageLightbox