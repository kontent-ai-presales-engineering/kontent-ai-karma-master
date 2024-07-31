/**
 * Generated by '@kontent-ai/model-generator@6.5.1'
 */
export const contentTypes = {
    /**
     *    Web Spotlight Root
     */
    web_spotlight_root: {
        codename: 'web_spotlight_root',
        id: '70a78305-2ef2-4f5d-9677-b01866e2f472',
        externalId: undefined,
        name: '💡 Web Spotlight Root',
        elements: {
            /**
             * Content (rich_text)
             */
            content: {
                codename: 'content',
                id: 'cfacf602-c3a9-44d5-bafd-aea5af865ab9',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'rich_text'
            },

            /**
             * Hide (multiple_choice)
             */
            hide: {
                codename: 'hide',
                id: 'cc38fd0e-0bbd-4b00-a011-5c09fd885b97',
                externalId: undefined,
                name: 'Hide',
                required: false,
                type: 'multiple_choice',
                options: {
                    header: {
                        name: 'Header',
                        id: '245c5644-65e0-45bd-8c42-62da674d42b9',
                        codename: 'header',
                        externalId: undefined
                    },
                    footer: {
                        name: 'Footer',
                        id: 'cbd464ba-b0f3-4125-9366-9cf8587edbfb',
                        codename: 'footer',
                        externalId: undefined
                    }
                }
            },

            /**
             * Logo (asset)
             */
            logo: {
                codename: 'logo',
                id: '5d7a0146-b986-4587-bf5c-3ba3111aa441',
                externalId: undefined,
                name: 'Logo',
                required: false,
                type: 'asset'
            },

            /**
             * Subpages (subpages)
             */
            subpages: {
                codename: 'subpages',
                id: '68783b8a-a680-4d5e-aed1-5e136815f4ef',
                externalId: undefined,
                name: 'Subpages',
                required: false,
                type: 'subpages'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: 'f66fd9c8-1894-4223-979a-0b829cb0ece2',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            },

            /**
             * URL (url_slug)
             */
            url: {
                codename: 'url',
                id: '48a58dda-a112-443d-853c-d99d3012944d',
                externalId: undefined,
                name: 'URL',
                required: false,
                type: 'url_slug'
            }
        }
    },

    /**
     * Call to Action
     */
    call_to_action: {
        codename: 'call_to_action',
        id: '068970e2-e5ba-44be-8bc4-66acb19547f1',
        externalId: undefined,
        name: 'Call to Action',
        elements: {
            /**
             * Item Target (modular_content)
             */
            item_target: {
                codename: 'item_target',
                id: '513c3019-0fbc-4e4c-9ef5-bc37b7f70dee',
                externalId: undefined,
                name: 'Item Target',
                required: false,
                type: 'modular_content'
            },

            /**
             * Manual Target (text)
             */
            manual_target: {
                codename: 'manual_target',
                id: '03b11077-1053-44dd-8047-c1119d0b393a',
                externalId: undefined,
                name: 'Manual Target',
                required: false,
                type: 'text'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: 'f23fb051-8fdb-4067-b02b-5b4313ceaa06',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Carousel
     */
    carousel: {
        codename: 'carousel',
        id: 'd3157a0b-928c-4c69-b3d5-8816e9e8e406',
        externalId: undefined,
        name: 'Carousel',
        elements: {
            /**
             * Elements (modular_content)
             */
            elements: {
                codename: 'elements',
                id: '0c889cf7-b807-4a92-80bc-c0e500d8f1b5',
                externalId: undefined,
                name: 'Elements',
                required: false,
                type: 'modular_content'
            }
        }
    },

    /**
     * Content Chunk
     */
    content_chunk: {
        codename: 'content_chunk',
        id: 'feaac754-fe8a-499d-af52-a7db0bb65499',
        externalId: undefined,
        name: 'Content Chunk',
        elements: {
            /**
             * Background color (custom)
             */
            background_color: {
                codename: 'background_color',
                id: '4a482be5-17a9-4438-b1b4-9f7f1f3aafc1',
                externalId: undefined,
                name: 'Background color',
                required: false,
                type: 'custom'
            },

            /**
             * Content (rich_text)
             */
            content: {
                codename: 'content',
                id: '243ad7ec-37bf-4152-a858-1a2cbdb144be',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'rich_text'
            },

            /**
             * Text alignment (multiple_choice)
             */
            text_alignment: {
                codename: 'text_alignment',
                id: '99643538-9d24-4948-85e0-82bd4a5f31e0',
                externalId: undefined,
                name: 'Text alignment',
                required: false,
                type: 'multiple_choice',
                options: {
                    left: {
                        name: 'Left',
                        id: '9a516772-e683-4647-be7a-43f90f2b4afa',
                        codename: 'left',
                        externalId: undefined
                    },
                    right: {
                        name: 'Right',
                        id: 'ea514b0d-1671-4dc4-afbe-2f49ef054785',
                        codename: 'right',
                        externalId: undefined
                    },
                    center: {
                        name: 'Center',
                        id: 'e55b1470-8842-4e8f-9007-78c9217dbce4',
                        codename: 'center',
                        externalId: undefined
                    }
                }
            }
        }
    },

    /**
     * FAQ
     */
    faq: {
        codename: 'faq',
        id: '44e0a36e-2ff4-4e53-85da-21efc87e58e7',
        externalId: undefined,
        name: 'FAQ',
        elements: {
            /**
             * Answer (rich_text)
             */
            answer: {
                codename: 'answer',
                id: '7f90c20c-375e-4826-b3aa-de7e38d98b42',
                externalId: undefined,
                name: 'Answer',
                required: false,
                type: 'rich_text'
            },

            /**
             * Question (text)
             */
            question: {
                codename: 'question',
                id: '68930750-475f-4793-8c74-30688769fc50',
                externalId: undefined,
                name: 'Question',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Hero Unit
     */
    hero_unit: {
        codename: 'hero_unit',
        id: '0a455385-90a1-4ccc-88af-ce9abd6c07a4',
        externalId: undefined,
        name: 'Hero Unit',
        elements: {
            /**
             * Background image (asset)
             */
            background_image: {
                codename: 'background_image',
                id: '8e3aa740-0f46-4827-bd01-6752557b37dd',
                externalId: undefined,
                name: 'Background image',
                required: false,
                type: 'asset'
            },

            /**
             * Call to Action (modular_content)
             */
            call_to_action: {
                codename: 'call_to_action',
                id: 'dfd3a2da-b0a2-49af-8c25-f96fb47bbff7',
                externalId: undefined,
                name: 'Call to Action',
                required: false,
                type: 'modular_content'
            },

            /**
             * Content (rich_text)
             */
            content: {
                codename: 'content',
                id: '99ebe8aa-7069-431f-b258-05900a9c11d6',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'rich_text'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: 'dbf21840-7f55-4f14-a926-05ee07a98118',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Image Container
     */
    image_container: {
        codename: 'image_container',
        id: '6ebb749b-5eaf-44f6-8a5e-268921144349',
        externalId: undefined,
        name: 'Image Container',
        elements: {
            /**
             * Content (rich_text)
             */
            content: {
                codename: 'content',
                id: 'fb8a6471-ce6b-446b-8034-19c921ee5683',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'rich_text'
            },

            /**
             * Heading (text)
             */
            heading: {
                codename: 'heading',
                id: '9cd23f04-c571-4ebd-86e0-11f3ad6503d7',
                externalId: undefined,
                name: 'Heading',
                required: false,
                type: 'text'
            },

            /**
             * Image (asset)
             */
            image: {
                codename: 'image',
                id: '569f29a5-57c5-49ef-a120-5f4931d34acf',
                externalId: undefined,
                name: 'Image',
                required: false,
                type: 'asset'
            },

            /**
             * Image location (multiple_choice)
             */
            image_location: {
                codename: 'image_location',
                id: 'a537365b-e81b-4f70-b34b-de4f63e26815',
                externalId: undefined,
                name: 'Image location',
                required: false,
                type: 'multiple_choice',
                options: {
                    left: {
                        name: 'Left',
                        id: '47851e45-3208-4cdd-a090-61231fbf90b5',
                        codename: 'left',
                        externalId: undefined
                    },
                    right: {
                        name: 'Right',
                        id: 'ae997d79-0bf5-4c44-b7f0-205c1b7e1212',
                        codename: 'right',
                        externalId: undefined
                    }
                }
            }
        }
    },

    /**
     * Milestone
     */
    milestone: {
        codename: 'milestone',
        id: '1df5b589-13e7-4331-bbdd-761bd6255cdc',
        externalId: undefined,
        name: 'Milestone',
        elements: {
            /**
             * Icon  optional  (asset)
             */
            icon__optional_: {
                codename: 'icon__optional_',
                id: '4b497516-12f3-4bd2-a3fb-bc4120fb808e',
                externalId: undefined,
                name: 'Icon (optional)',
                required: false,
                type: 'asset'
            },

            /**
             * Subtitle (text)
             */
            subtitle: {
                codename: 'subtitle',
                id: '9e57f001-a7da-467a-a194-a58ddfc28628',
                externalId: undefined,
                name: 'Subtitle',
                required: true,
                type: 'text'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: '1c5cdfbb-69c4-4b9b-83c8-8992d5407c2d',
                externalId: undefined,
                name: 'Title',
                required: true,
                type: 'text'
            }
        }
    },

    /**
     * Milestone Listing
     */
    milestone_listing: {
        codename: 'milestone_listing',
        id: '477fe0bd-c927-4e31-a3f2-f14c17dc2c38',
        externalId: undefined,
        name: 'Milestone Listing',
        elements: {
            /**
             * Milestones (modular_content)
             */
            grid_items: {
                codename: 'grid_items',
                id: '8351781d-29fc-40e3-8224-ce65c22f29f6',
                externalId: undefined,
                name: 'Milestones',
                required: false,
                type: 'modular_content'
            }
        }
    },

    /**
     * Page
     */
    page: {
        codename: 'page',
        id: '5aab1bd3-9433-40d2-8e0f-cbda835ec5fd',
        externalId: undefined,
        name: 'Page',
        elements: {
            /**
             * Content (rich_text)
             */
            content: {
                codename: 'content',
                id: '756bc39a-7d70-4faa-9116-eeacd689ff4f',
                externalId: undefined,
                name: 'Content',
                required: false,
                type: 'rich_text'
            },

            /**
             * Hide (multiple_choice)
             */
            hide: {
                codename: 'hide',
                id: 'eb5a5ebb-18f1-40bb-9be9-25cc615de657',
                externalId: undefined,
                name: 'Hide',
                required: false,
                type: 'multiple_choice',
                options: {
                    header: {
                        name: 'Header',
                        id: 'e284d8d6-e5da-4fb0-ab94-5b458ef9189a',
                        codename: 'header',
                        externalId: undefined
                    },
                    footer: {
                        name: 'Footer',
                        id: 'c40e9bfa-abf3-4ffa-8afd-bae09ef0b88e',
                        codename: 'footer',
                        externalId: undefined
                    }
                }
            },

            /**
             * Subpages (subpages)
             */
            subpages: {
                codename: 'subpages',
                id: '890cb2c8-fc22-4744-8965-0e8bfe284c62',
                externalId: undefined,
                name: 'Subpages',
                required: false,
                type: 'subpages'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: '93218af9-0226-422a-b1a0-27ad0058dcf4',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            },

            /**
             * URL (url_slug)
             */
            url: {
                codename: 'url',
                id: 'a1f23c97-017d-4764-bc39-82050166b371',
                externalId: undefined,
                name: 'URL',
                required: false,
                type: 'url_slug'
            }
        }
    },

    /**
     * Panel
     */
    _panel: {
        codename: '_panel',
        id: 'cd495da0-4247-4456-8d83-288a777f6c23',
        externalId: undefined,
        name: 'Panel',
        elements: {
            /**
             * Blurb (text)
             */
            blurb: {
                codename: 'blurb',
                id: '972b7b5b-348d-4983-be0b-084f53bd8f6a',
                externalId: undefined,
                name: 'Blurb',
                required: false,
                type: 'text'
            },

            /**
             * Heading (text)
             */
            heading: {
                codename: 'heading',
                id: '83ec6bbc-0271-416b-9dad-188c825b39a9',
                externalId: undefined,
                name: 'Heading',
                required: false,
                type: 'text'
            },

            /**
             * Image (asset)
             */
            image: {
                codename: 'image',
                id: '0c947609-33fc-49d4-8d89-fea08403a503',
                externalId: undefined,
                name: 'Image',
                required: false,
                type: 'asset'
            },

            /**
             * Link (text)
             */
            link: {
                codename: 'link',
                id: '168fecf2-6821-49e9-9e92-9abfc462a61e',
                externalId: undefined,
                name: 'Link',
                required: false,
                type: 'text'
            }
        }
    },

    /**
     * Panel Listing
     */
    panel_listing: {
        codename: 'panel_listing',
        id: '507ad995-6abb-48a7-b3cf-df8fe45ff8ff',
        externalId: undefined,
        name: 'Panel Listing',
        elements: {
            /**
             * Heading (text)
             */
            heading: {
                codename: 'heading',
                id: '825bd606-122b-425e-8403-4beb79181ada',
                externalId: undefined,
                name: 'Heading',
                required: false,
                type: 'text'
            },

            /**
             * Orientation (multiple_choice)
             */
            orientation: {
                codename: 'orientation',
                id: '085d12ae-8b7e-4086-87fa-89b47ec442d0',
                externalId: undefined,
                name: 'Orientation',
                required: true,
                type: 'multiple_choice',
                options: {
                    horizontal: {
                        name: 'Horizontal',
                        id: '0ea8fb7b-6103-4bce-aa56-21a4ee08e79c',
                        codename: 'horizontal',
                        externalId: undefined
                    },
                    vertical: {
                        name: 'Vertical',
                        id: '19ada33a-d0e1-4491-b356-1c62e725dca6',
                        codename: 'vertical',
                        externalId: undefined
                    }
                }
            },

            /**
             * Panels (modular_content)
             */
            panels: {
                codename: 'panels',
                id: 'f77bc4f3-3619-4b19-a32b-f2e282f48e11',
                externalId: undefined,
                name: 'Panels',
                required: false,
                type: 'modular_content'
            }
        }
    },

    /**
     * YouTube Embed
     */
    youtube_embed: {
        codename: 'youtube_embed',
        id: '269c7ce3-1d74-41cd-bd35-2d5530aab4b3',
        externalId: undefined,
        name: 'YouTube Embed',
        elements: {
            /**
             * Autoplay (multiple_choice)
             */
            autoplay: {
                codename: 'autoplay',
                id: 'd59de605-0b0a-4e6f-9758-236a8cda250f',
                externalId: undefined,
                name: 'Autoplay',
                required: false,
                type: 'multiple_choice',
                options: {
                    yes: {
                        name: 'Yes',
                        id: '5f576ac4-7842-48ab-864b-d98ea5420ea9',
                        codename: 'yes',
                        externalId: undefined
                    },
                    no: {
                        name: 'No',
                        id: '324d11dd-f0ac-4a0b-9074-1d6068fec86d',
                        codename: 'no',
                        externalId: undefined
                    }
                }
            },

            /**
             * Body (rich_text)
             */
            body: {
                codename: 'body',
                id: 'a2b286f6-be90-4ba4-83b7-fd217b1cecfb',
                externalId: undefined,
                name: 'Body',
                required: false,
                type: 'rich_text'
            },

            /**
             * End time (number)
             *
             * Time in seconds, so if you want to end the video at 1:30 you fill in 90
             */
            end_time: {
                codename: 'end_time',
                id: '7b78f5bf-8fe1-4fb2-ac57-32f9058862c7',
                externalId: undefined,
                name: 'End time',
                required: false,
                type: 'number'
            },

            /**
             * Image (asset)
             */
            image: {
                codename: 'image',
                id: '22365200-26af-4dd7-a41b-23f2807dca56',
                externalId: undefined,
                name: 'Image',
                required: false,
                type: 'asset'
            },

            /**
             * Start time (number)
             *
             * Time in seconds, so if you want to end the video at 1:30 you fill in 90
             */
            start_time: {
                codename: 'start_time',
                id: '54a9d1b9-98bb-4e62-8b7c-f3a55d82f701',
                externalId: undefined,
                name: 'Start time',
                required: false,
                type: 'number'
            },

            /**
             * Title (text)
             */
            title: {
                codename: 'title',
                id: 'e5b3b337-e250-47a6-a5f7-7dfd8cccd6fd',
                externalId: undefined,
                name: 'Title',
                required: false,
                type: 'text'
            },

            /**
             * YouTube (custom)
             */
            youtube: {
                codename: 'youtube',
                id: '216caf7c-b592-4517-ae81-54fa69fa2d1f',
                externalId: undefined,
                name: 'YouTube',
                required: true,
                type: 'custom'
            }
        }
    }
} as const;
