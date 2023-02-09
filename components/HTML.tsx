import {TypographyStylesProvider, TypographyStylesProviderProps} from "@mantine/core";

export default function HTML({html, ...props}: { html: string } & Omit<TypographyStylesProviderProps, "children">) {
    return (
        <TypographyStylesProvider {...props}>
            <div dangerouslySetInnerHTML={{__html: html}}/>
        </TypographyStylesProvider>
    )
}