const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const sourceSvg = "src/favicon.svg"; // Исходный SVG
const outputPath = "dist"; // Корневая папка для фавиконок

// Размеры фавиконок
const sizes = [16, 32, 48, 72, 96, 144, 192, 512];

// Создаёт PNG из SVG в указанном размере
async function createPngIcons() {
  try {
    console.log("🔄 Генерация PNG фавиконок...");
    for (const size of sizes) {
      await sharp(sourceSvg)
        .resize(size, size)
        .toFile(path.join(outputPath, `favicon-${size}x${size}.png`));
    }
    console.log("✅ PNG фавиконки созданы!");
  } catch (error) {
    console.error("❌ Ошибка создания PNG фавиконок:", error);
  }
}

// Создаёт ICO для старых браузеров
async function createIco() {
  try {
    console.log("🔄 Генерация favicon.ico...");
    await sharp(sourceSvg)
      .resize(48, 48)
      .toFile(path.join(outputPath, "favicon.ico"));
    console.log("✅ favicon.ico создан!");
  } catch (error) {
    console.error("❌ Ошибка создания favicon.ico:", error);
  }
}

// Создаёт Apple Touch Icon
async function createAppleIcon() {
  try {
    console.log("🔄 Генерация Apple Touch Icon...");
    await sharp(sourceSvg)
      .resize(180, 180)
      .toFile(path.join(outputPath, "apple-touch-icon.png"));
    console.log("✅ Apple Touch Icon создан!");
  } catch (error) {
    console.error("❌ Ошибка создания Apple Touch Icon:", error);
  }
}

// Создаёт site.webmanifest
async function createManifest() {
  const manifest = {
    name: "Междунароная логистика и ВЭД под ключ",
    short_name: "АзияТрансРейл (АТР)",
    icons: sizes.map((size) => ({
      src: `/favicon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  };

  try {
    console.log("🔄 Генерация site.webmanifest...");
    await fs.writeFile(
      path.join(outputPath, "site.webmanifest"),
      JSON.stringify(manifest, null, 2)
    );
    console.log("✅ site.webmanifest создан!");
  } catch (error) {
    console.error("❌ Ошибка создания site.webmanifest:", error);
  }
}

// Запуск всех функций
(async function generateFavicons() {
  await fs.ensureDir(outputPath);
  await createPngIcons();
  await createIco();
  await createAppleIcon();
  await createManifest();
})();