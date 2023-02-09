import {useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Link, RichTextEditor} from '@mantine/tiptap';

import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {Color} from '@tiptap/extension-color';
import {TextStyle} from "@tiptap/extension-text-style";
import {Box, Input, InputWrapperProps, useMantineTheme} from "@mantine/core";
import React from "react";
import {Placeholder} from "@tiptap/extension-placeholder";

export default function TextEditor(
    {placeholder, value, onChange, minHeight, error, features, ...props}: {
        onChange: (value: string) => void
        value: string
        minHeight?: number,
        features?: {
            basicFormatting?: boolean,
            header?: boolean,
            blockquote?: boolean,
            hr?: boolean,
            bulletList?: boolean,
            orderedList?: boolean,
            link?: boolean,
            align?: boolean
            color?: boolean
        }
    } & Omit<InputWrapperProps, "children" | "onChange">
) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Highlight,
            TextAlign.configure({types: ['heading', 'paragraph']}),
            Color,
            TextStyle,
            Placeholder.configure({placeholder: placeholder ?? "Vor langer Zeit in einer Weit entfernten Galaxis ..."})
        ],
        onUpdate: ({editor}) => onChange(editor.getHTML()),
        content: value,
    })

    const theme = useMantineTheme()

    return (
        <Input.Wrapper
            styles={{
                error: {
                    marginTop: 3
                }
            }}
            {...props}
            error={error}
        >
            <Box mt={6}>
                <RichTextEditor
                    editor={editor}
                    styles={{
                        content: {
                            fontSize: theme.fontSizes.sm,
                            minHeight: minHeight ?? 100,
                        },
                        root: {
                            borderColor: error ? theme.colors.red[5] : theme.colors.gray[3],
                        }
                    }}
                >
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        {(features?.basicFormatting ?? true) && <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold/>
                            <RichTextEditor.Italic/>
                            <RichTextEditor.Underline/>
                            <RichTextEditor.Strikethrough/>
                            <RichTextEditor.Highlight/>
                            <RichTextEditor.Code/>
                            <RichTextEditor.ClearFormatting/>
                        </RichTextEditor.ControlsGroup>}

                        {(features?.header ?? true) && <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1/>
                            <RichTextEditor.H2/>
                            <RichTextEditor.H3/>
                            <RichTextEditor.H4/>
                        </RichTextEditor.ControlsGroup>}

                        <RichTextEditor.ControlsGroup>
                            {(features?.blockquote ?? true) && <RichTextEditor.Blockquote/>}
                            {(features?.hr ?? true) && <RichTextEditor.Hr/>}
                            {(features?.bulletList ?? true) && <RichTextEditor.BulletList/>}
                            {(features?.orderedList ?? true) && <RichTextEditor.OrderedList/>}
                        </RichTextEditor.ControlsGroup>

                        {(features?.link ?? true) && <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link/>
                            <RichTextEditor.Unlink/>
                        </RichTextEditor.ControlsGroup>}

                        {(features?.align ?? true) && <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft/>
                            <RichTextEditor.AlignCenter/>
                            <RichTextEditor.AlignJustify/>
                            <RichTextEditor.AlignRight/>
                        </RichTextEditor.ControlsGroup>}

                        {(features?.color ?? true) && <RichTextEditor.ControlsGroup>
                            <RichTextEditor.ColorPicker
                                colors={[
                                    '#25262b',
                                    '#868e96',
                                    '#fa5252',
                                    '#e64980',
                                    '#be4bdb',
                                    '#7950f2',
                                    '#4c6ef5',
                                    '#228be6',
                                    '#15aabf',
                                    '#12b886',
                                    '#40c057',
                                    '#82c91e',
                                    '#fab005',
                                    '#fd7e14',
                                ]}
                            />
                            <RichTextEditor.UnsetColor/>
                        </RichTextEditor.ControlsGroup>}
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content/>
                </RichTextEditor>
            </Box>
        </Input.Wrapper>
    )
}
