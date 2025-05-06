const themeToggleButton = document.getElementById('switch-theme');
const popupMenu = document.getElementById('popup-menu');
const popupCloseButton = popupMenu.querySelector('.popup-close');
const optionsButton = document.querySelector('.options');
const popoverMenu = document.getElementById('popover-menu');
const popoverArrow = popoverMenu.querySelector('.popover-arrow');

function showPopoverMenu() {
    const rect = optionsButton.getBoundingClientRect();
    popoverMenu.style.display = 'block';
    requestAnimationFrame(() => {
        // Calculate transform-origin to zoom from the icon
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const popoverWidth = popoverMenu.offsetWidth;
        let popoverLeft = rect.left + scrollX - popoverWidth / 2 + rect.width / 2;
        popoverMenu.style.top = `${rect.bottom + scrollY + 8}px`;

        // Ensure the popover stays within the viewport horizontally
        const viewportWidth = window.innerWidth;
        if (popoverLeft < 8) {
        popoverLeft = 8; // Minimum margin from the left edge
        } else if (popoverLeft + popoverWidth > viewportWidth - 8) {
        popoverLeft = viewportWidth - popoverWidth - 8; // Minimum margin from the right edge
        }
        popoverMenu.style.left = `${popoverLeft}px`;

        // Set transform-origin to the icon's center relative to the popover
        const iconCenterX = rect.left + rect.width / 2 + scrollX;
        const popoverOriginX = iconCenterX - popoverLeft;
        popoverMenu.style.transformOrigin = `${popoverOriginX}px 0`;

        // Position the arrow to point to the center of the button
        const arrowWidth = popoverArrow.offsetWidth;
        const buttonCenter = rect.left + rect.width / 2;
        const popoverLeftEdge = popoverLeft;
        let arrowLeft = buttonCenter - popoverLeftEdge - arrowWidth / 2;
        arrowLeft = Math.max(8, Math.min(arrowLeft, popoverWidth - arrowWidth - 8));
        popoverArrow.style.left = `${arrowLeft}px`;

        popoverMenu.classList.add('show');
    });
}

function hidePopoverMenu() {
    popoverMenu.classList.remove('show');
    setTimeout(() => {
        popoverMenu.style.display = 'none';
    }, 250);
}

optionsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popoverMenu.classList.contains('show')) {
        hidePopoverMenu();
    } else {
        showPopoverMenu();
    }
});

document.addEventListener('click', (e) => {
    if (!popoverMenu.contains(e.target) && e.target !== optionsButton) {
        hidePopoverMenu();
    }
});

window.addEventListener('resize', hidePopoverMenu);
window.addEventListener('scroll', hidePopoverMenu);

themeToggleButton.addEventListener('click', () => {
    if (document.documentElement.hasAttribute('data-theme')) {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
});

const popoverOptions = popoverMenu.querySelectorAll('.popover-option');

popoverOptions.forEach(option => {
    option.addEventListener('click', () => {
        hidePopoverMenu();
    });
});

const navButtons = document.querySelectorAll('.nav-button');
const pages = {
    home: document.getElementById('page-home'),
    search: document.getElementById('page-search'),
    showcase: document.getElementById('page-showcase')
};
let currentPage = 'home';

function showPage(page) {
    if (page === currentPage) return;
    const prev = pages[currentPage];
    const next = pages[page];
    if (!next) return;

    // Remove all exit classes from all pages
    Object.values(pages).forEach(p => p.classList.remove('exit-left', 'exit-right', 'active'));

    const prevOrder = pageOrder(currentPage);
    const nextOrder = pageOrder(page);

    if (nextOrder > prevOrder) {
        // Forward: current slides left, next slides in from right
        prev.classList.add('exit-left');
        next.style.transform = 'translateX(100%)';
        setTimeout(() => {
            next.classList.add('active');
            next.style.transform = '';
        }, 10);
    } else {
        // Backward: current slides right, next slides in from left
        prev.classList.add('exit-right');
        next.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            next.classList.add('active');
            next.style.transform = '';
        }, 10);
    }

    setTimeout(() => {
        prev.classList.remove('exit-left', 'exit-right');
    }, 440);

    // Scroll to top of content and window
    const content = document.querySelector('.content');
    if (content) content.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });

    currentPage = page;
}

function pageOrder(page) {
    return ['home', 'search', 'showcase'].indexOf(page);
}
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const nav = btn.getAttribute('data-nav');
        showPage(nav);
    });
});