import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import path from 'path'

const dir = 'public/images'
const files = readdirSync(dir).filter((f) => f.endsWith('.png'))

for (const file of files) {
    const inputPath = path.join(dir, file)
    const outputPath = path.join(dir, file.replace('.png', '.webp'))
    const beforeKb = Math.round(statSync(inputPath).size / 1024)

    await sharp(inputPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath)

    const afterKb = Math.round(statSync(outputPath).size / 1024)
    console.log(`${file}: ${beforeKb}KB -> ${path.basename(outputPath)}: ${afterKb}KB (${Math.round((1 - afterKb / beforeKb) * 100)}% küçüldü)`)
}
