# RE-CA-LL App Icons

## Icon Design

The app uses a simple, recognizable "R" logo on a blue background (#2563eb - primary brand color).

## Files

- `icon.svg` - Vector source (512x512) ✅
- `icon-192.png` - Small icon (192x192) - for PWA ⏳
- `icon-512.png` - Large icon (512x512) - for PWA splash screen ⏳

## How to Generate PNG Icons

### Option 1: Online Converter (Easiest)
1. Go to https://svgtopng.com or https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Set output size:
   - First conversion: 192x192 → save as `icon-192.png`
   - Second conversion: 512x512 → save as `icon-512.png`
4. Download and place in this folder

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first (brew install imagemagick on macOS)
cd app/public/icons

# Generate 192x192
magick icon.svg -resize 192x192 icon-192.png

# Generate 512x512
magick icon.svg -resize 512x512 icon-512.png
```

### Option 3: Using Inkscape (GUI)
1. Open `icon.svg` in Inkscape
2. File → Export PNG Image
3. Set width/height to 192, export as `icon-192.png`
4. Repeat with 512x512 for `icon-512.png`

### Option 4: Using Node.js (Automated)
```bash
npm install -g sharp-cli

# Generate both sizes
npx sharp -i icon.svg -o icon-192.png resize 192 192
npx sharp -i icon.svg -o icon-512.png resize 512 512
```

## Current Status

✅ SVG source created
⏳ PNG files need to be generated (use one of the methods above)

## Design Notes

- **Color**: #2563eb (Blue 600) - matches primary brand color
- **Shape**: Rounded square (128px radius on 512px canvas)
- **Letter**: "R" for RE-CA-LL
- **Font**: System sans-serif, bold, white
- **Size**: 320px font size, centered

## Testing PWA Icons

After generating the PNG files:
1. Build the app: `npm run build`
2. Preview: `npm run preview`
3. Open in browser and test "Add to Home Screen"
4. Check icon appears correctly on device home screen

## Fallback

The app will still work without PNG icons - browsers will use the favicon or a default icon. However, for the best PWA experience, generate the PNG icons using one of the methods above.
