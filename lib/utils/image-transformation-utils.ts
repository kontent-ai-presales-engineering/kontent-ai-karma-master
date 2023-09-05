import { ImageUrlTransformationBuilder } from "@kontent-ai/delivery-sdk"

export enum AspectRatio {
    Ultrawide = 'n21_9',
    Wide = 'n16_9',
    Standard = 'n4_3',
    Square = 'n1_1',
    Original = 'original',
    OpenGraph = 'opengraph',
}

export function getResizedImageUrl(imageUrl: string, imageWidth: number, imageAspectRatio: AspectRatio, targetMaxWidth: number = 1600) {
    const { width, height } = getDimensionsForAspectRatio(imageWidth, imageAspectRatio, targetMaxWidth)
    return new ImageUrlTransformationBuilder(imageUrl)
        .withAutomaticFormat()
        .withWidth(width)
        .withHeight(height)
}

export function getDimensionsForAspectRatio(width: number, aspectRatio: AspectRatio, targetMaxWidth: number) {
    const adjustedWidth = width < targetMaxWidth ? width : targetMaxWidth

    let heightMultiplier = 0
    switch (aspectRatio) {
        case AspectRatio.Ultrawide: // 21:9 = 9/21 = 0.4286
            heightMultiplier = 0.4286
            break;
        case AspectRatio.OpenGraph:
            heightMultiplier = 0.52356 // 1.91:1 = 1/1.91 = 0.52356
            break;
        case AspectRatio.Wide: // 16:9 = 9/16 = 0.5265
            heightMultiplier = 0.5265
            break;
        case AspectRatio.Standard: // 4:3 = 3/4 = 0.75
            heightMultiplier = 0.75
            break;
        case AspectRatio.Square: // 1:1 = 1/1 = 1
            heightMultiplier = 1
            break;
        default:
            break;
    }

    const height = Math.round(heightMultiplier > 0 ? adjustedWidth * heightMultiplier : 0)

    return { width: adjustedWidth, height }

}