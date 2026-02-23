export const server = (done) => {

  let rules = [];

  try {
    // читаем .htaccess из папки сборки
    const htaccessPath = path.join(app.path.build.html, ".htaccess");
    if (fs.existsSync(htaccessPath)) {
      const htaccessContent = fs.readFileSync(htaccessPath, "utf8");

      // простая фильтрация — оставляем только RewriteRule и RewriteCond
      rules = htaccessContent
        .split("\n")
        .filter(line => line.trim() && !line.startsWith("#"))
        .map(line => line.trim());

      console.log("[BrowserSync] Загружены правила из .htaccess:", rules);
    }
  } catch (err) {
    console.warn("[BrowserSync] Ошибка чтения .htaccess:", err);
  }


  app.plugins.browsersync.init({
    server: {
      baseDir: `${app.path.build.html}`,
      middleware: [app.plugins.modRewrite([
        '^/en/?$ /en.html [L]',                // конкретно для /en
        '^/([\\w-]+)/index/?$ /$1/index.html [L]', // если есть папки с index.html
      ])]
    },
    notify: false,
    port: 3000,
  });
}