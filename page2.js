const layers = document.querySelectorAll('.image-layer');
const totalLayers = layers.length;

function updateImages() {
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const scrollProgress = scrollPercentage * totalLayers;
    
    layers.forEach((layer, index) => {
        if (index === 0) {
            // First image stays at its default size
            return;
        }
        
        // Calculate how much this layer should be zoomed based on scroll
        const layerProgress = scrollProgress - index;
        
        if (layerProgress <= 0) {
            // Not scrolled to this image yet - invisible
            layer.style.opacity = '0';
            layer.style.transform = 'scale(0.2)';
        } else if (layerProgress >= 1) {
            // Fully scrolled past this image - fully zoomed
            layer.style.opacity = '1';
            layer.style.transform = 'scale(1)';
        } else {
            // In between - gradually zoom based on scroll position
            layer.style.opacity = '1';
            const scale = 0.2 + (layerProgress * 0.8); // Goes from 0.2 to 1.0
            layer.style.transform = `scale(${scale})`;
        }
    });
}
function goHome() {
    window.location.href = 'index.html';  
}

window.addEventListener('scroll', updateImages);
updateImages();