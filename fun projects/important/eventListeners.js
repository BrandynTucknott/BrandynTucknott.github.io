background_changer_button.addEventListener('click', () =>
{
    let text = 'copy this?';
    navigator.clipboard.writeText(text);
});

background_color_changer_interval = setInterval(() =>
{
    let body = document.getElementsByTagName('body')[0];
    let r = 0;
    let g = 0;
    let b = 0;
}, 10);