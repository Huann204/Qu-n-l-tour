//button menu for mobile version
const innerButtonMenu = document.querySelector('header.inner-button-menu');
const siderOverlay = document.querySelector('.sider-overlay');
const sider = document.querySelector('.sider');

innerButtonMenu.addEventListener('click', () => {
    sider.classList.toggle('active');
    siderOverlay.classList.toggle('active');
});

siderOverlay.addEventListener('click', () => {
    sider.classList.remove('active');
    siderOverlay.classList.remove('active');
});