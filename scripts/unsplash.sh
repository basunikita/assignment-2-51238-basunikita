#!/usr/bin/env bash
# Find and download free Unsplash photos for the mood boards.
#   scripts/unsplash.sh search "<query>"
#       Lists free photos (never Unsplash+): id | size | photographer | description
#   scripts/unsplash.sh get <mood> <photo-id> <file-name>
#       Saves public/mood-boards/<mood>/<file-name>.jpg, 1000 px wide, and prints
#       the entry to paste into app/mood-boards/<mood>/photos.ts
set -euo pipefail

api="https://unsplash.com/napi"

case "${1:-}" in
  search)
    query=$(node -p 'encodeURIComponent(process.argv[1])' "$2")
    curl -sSf "$api/search/photos?query=$query&per_page=30" | node -e '
      let body = "";
      process.stdin.on("data", (chunk) => (body += chunk)).on("end", () => {
        for (const photo of JSON.parse(body).results) {
          if (photo.premium || photo.plus) continue;
          console.log([photo.id, `${photo.width}x${photo.height}`, photo.user.name, photo.alt_description].join(" | "));
        }
      });'
    ;;
  get)
    mood=$2 id=$3 name=$4
    dir="public/mood-boards/$mood"
    mkdir -p "$dir"
    info=$(curl -sSf "$api/photos/$id")
    raw=$(node -e '
      const photo = JSON.parse(process.argv[1]);
      if (photo.premium || photo.plus) { console.error("Unsplash+ photo: not free to use"); process.exit(1); }
      console.log(photo.urls.raw);' "$info")
    curl -sSf -o "$dir/$name.jpg" "$raw&w=1000&q=70&fm=jpg&fit=max"
    width=$(sips -g pixelWidth "$dir/$name.jpg" | awk '/pixelWidth/ { print $2 }')
    height=$(sips -g pixelHeight "$dir/$name.jpg" | awk '/pixelHeight/ { print $2 }')
    node -e '
      const [photo, src, name, width, height] = [JSON.parse(process.argv[1]), ...process.argv.slice(2)];
      const key = name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
      const entry = {
        kind: "photo", src, width: Number(width), height: Number(height),
        alt: photo.alt_description ?? "", photographer: photo.user.name, photoUrl: photo.links.html,
      };
      const fields = Object.entries(entry).map(([field, value]) => `${field}: ${JSON.stringify(value)}`);
      console.log(`  ${key}: { ${fields.join(", ")} },`);' "$info" "/mood-boards/$mood/$name.jpg" "$name" "$width" "$height"
    ;;
  *)
    echo "usage: $0 search <query> | get <mood> <photo-id> <file-name>" >&2
    exit 2
    ;;
esac
