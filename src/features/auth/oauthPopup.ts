export function openOAuthPopup(url: string, name = 'oauth', width = 520, height = 640) {
    const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
    const dualScreenTop  = window.screenTop  ?? window.screenY ?? 0;

    const w = window.innerWidth  || document.documentElement.clientWidth  || screen.width;
    const h = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const left = w / 2 - width / 2 + dualScreenLeft;
    const top  = h / 2 - height / 2 + dualScreenTop;

    const features = `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`;
    const popup = window.open(url, name, features);
    if (!popup) throw new Error('Popup blocked');

    popup.focus?.();
    return popup;
}