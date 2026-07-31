import AppKit
import Foundation

guard CommandLine.arguments.count == 4 else {
    fputs("Uso: make_title TEXTO COLOR_HEX SALIDA_PNG\n", stderr)
    exit(2)
}

let text = CommandLine.arguments[1]
let colorText = CommandLine.arguments[2]
    .replacingOccurrences(of: "0x", with: "")
    .replacingOccurrences(of: "#", with: "")
let outputURL = URL(fileURLWithPath: CommandLine.arguments[3])

guard let rgb = UInt64(colorText, radix: 16) else {
    fputs("Color hexadecimal no válido\n", stderr)
    exit(2)
}

let accent = NSColor(
    red: CGFloat((rgb >> 16) & 0xFF) / 255.0,
    green: CGFloat((rgb >> 8) & 0xFF) / 255.0,
    blue: CGFloat(rgb & 0xFF) / 255.0,
    alpha: 0.94
)

let width = 1080
let height = 230
guard let bitmap = NSBitmapImageRep(
    bitmapDataPlanes: nil,
    pixelsWide: width,
    pixelsHigh: height,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .deviceRGB,
    bytesPerRow: 0,
    bitsPerPixel: 0
) else {
    exit(3)
}

NSGraphicsContext.saveGraphicsState()
guard let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
    exit(3)
}
NSGraphicsContext.current = context
context.imageInterpolation = .high

NSColor(calibratedWhite: 0.0, alpha: 0.38).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: width, height: height)).fill()

var fontSize: CGFloat = 59
var font = NSFont.systemFont(ofSize: fontSize, weight: .heavy)
let paragraph = NSMutableParagraphStyle()
paragraph.alignment = .center
paragraph.lineBreakMode = .byClipping

func textSize(for font: NSFont) -> NSSize {
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .paragraphStyle: paragraph
    ]
    return (text as NSString).size(withAttributes: attrs)
}

var measured = textSize(for: font)
while measured.width > 930 && fontSize > 38 {
    fontSize -= 1
    font = NSFont.systemFont(ofSize: fontSize, weight: .heavy)
    measured = textSize(for: font)
}

let boxWidth = min(CGFloat(width - 70), measured.width + 62)
let boxHeight = max(CGFloat(96), measured.height + 38)
let boxRect = NSRect(
    x: (CGFloat(width) - boxWidth) / 2,
    y: (CGFloat(height) - boxHeight) / 2,
    width: boxWidth,
    height: boxHeight
)

accent.setFill()
NSBezierPath(roundedRect: boxRect, xRadius: 22, yRadius: 22).fill()

let shadow = NSShadow()
shadow.shadowColor = NSColor.black.withAlphaComponent(0.72)
shadow.shadowBlurRadius = 7
shadow.shadowOffset = NSSize(width: 0, height: -3)

let attributes: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: NSColor.white,
    .paragraphStyle: paragraph,
    .shadow: shadow
]
let textRect = NSRect(
    x: 25,
    y: (CGFloat(height) - measured.height) / 2 - 2,
    width: CGFloat(width - 50),
    height: measured.height + 8
)
(text as NSString).draw(in: textRect, withAttributes: attributes)

context.flushGraphics()
NSGraphicsContext.restoreGraphicsState()

guard let png = bitmap.representation(using: .png, properties: [:]) else {
    exit(4)
}
try png.write(to: outputURL)
