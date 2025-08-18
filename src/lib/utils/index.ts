export function setupFavicon() {
  const env = import.meta.env.VITE_ENV_NAME;
  const faviconMap: Record<string, string> = {
    jojo: '/jojo_logo.png',
    jojoup: '/jojo_logo.png'
  };

  const faviconUrl = faviconMap[env] || faviconMap['default'];

  // 删除现有的favicon
  const existingIcons = document.querySelectorAll("link[rel*='icon']");
  existingIcons.forEach((icon) => icon.remove());

  // 创建新的favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = faviconUrl;
  document.head.appendChild(link);
}

export default {
  setupFavicon
};
