const columns = document.querySelectorAll('.column');

function adjustOpacityOnScroll() {
    const viewportWidth = window.innerWidth;
    const viewportCenter = viewportWidth / 2;
    const scrollPosition = window.scrollX;
    const maxScroll = document.documentElement.scrollWidth - window.innerWidth;

    columns.forEach((column, index) => {
        const rect = column.getBoundingClientRect();
        
        // Check if we're at the start or end of scroll
        const atStart = scrollPosition <= 0;
        const atEnd = scrollPosition >= maxScroll - 10; // Small buffer
        
        if (rect.left < viewportWidth && rect.right > 0) {
            const columnCenter = rect.left + rect.width / 2;
            const distanceFromCenter = Math.abs(columnCenter - viewportCenter);
            const maxDistance = viewportWidth / 2;
            
            let opacity = 1 - (distanceFromCenter / maxDistance);
            
            // Keep first columns bright when at start
            if (atStart && index <= 1) {
                opacity = 1;
            }
            
            // Keep last columns bright when at end
            if (atEnd && index >= columns.length - 2) {
                opacity = 1;
            }
            
            column.style.opacity = Math.max(0.1, opacity).toFixed(2);
        } else {
            column.style.opacity = "0.1";
        }
    });
}

let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            adjustOpacityOnScroll();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener("scroll", onScroll);
adjustOpacityOnScroll();

// Hover image functionality
const hoverTriggers = document.querySelectorAll('.hover-trigger');
const hoverImage = document.getElementById('hoverImage');
const hoverImg = hoverImage.querySelector('img');

hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        const imageName = trigger.getAttribute('data-image');
        if (imageName) {
            // Construct path to local images folder
            hoverImg.src = imageName;
            hoverImage.classList.add('active');
        }
    });

    trigger.addEventListener('mouseleave', () => {
        hoverImage.classList.remove('active');
    });
});
function goHome() {
    window.location.href = 'index.html';  
}
