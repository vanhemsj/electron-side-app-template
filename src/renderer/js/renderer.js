const mainContainer = document.body;
const expandButton = document.getElementById('expand-button');
const collapseButton = document.getElementById('collapse-button');
const closeButton = document.getElementById('close-button');
const reloadButton = document.getElementById('reload-button');
let dragStartPosition = null;
let hasDragged = false;

/**
 * Toggles the window between expanded and collapsed states.
 */
function toggleWindow() {
    const isExpanding = mainContainer.classList.contains('collapsing');
    mainContainer.className = `main-container ${isExpanding ? 'expanding' : 'collapsing'}`;
    window.electronAPI.toggleWindowSize();
}

/**
 * Handles the mouse up event to toggle window state or finalize drag actions.
 * @param {MouseEvent} event - The mouse up event object.
 */
function handleMouseUp(event) {
    if (dragStartPosition && !hasDragged) {
        toggleWindow();
    }
    dragStartPosition = null;
    hasDragged = false;
    event.preventDefault();
}

/**
 * Sets up event listeners for window interactions including drag, expand, collapse, close, and reload.
 */
function setupEventListeners() {
    expandButton.addEventListener('mousedown', (event) => {
        dragStartPosition = { x: event.screenX, y: event.screenY };
        hasDragged = false;
        event.preventDefault();
    });

    document.addEventListener('mousemove', (event) => {
        if (dragStartPosition) {
            const dx = event.screenX - dragStartPosition.x;
            const dy = event.screenY - dragStartPosition.y;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                window.electronAPI.moveWindow(dx, dy);
                dragStartPosition = { x: event.screenX, y: event.screenY };
                hasDragged = true;
            }
        }
    });

    document.addEventListener('mouseup', handleMouseUp);
    collapseButton.addEventListener('click', toggleWindow);
    closeButton.addEventListener('click', window.electronAPI.closeApp);
    reloadButton.addEventListener('click', () => window.location.reload());
    window.addEventListener('resize', updateSlidingContainerWidth);
}

/**
 * Updates the width of the sliding container on window resize to maintain layout.
 */
function updateSlidingContainerWidth() {
    const slidingContainer = document.querySelector('.sliding-container');
    slidingContainer.style.width = `${window.innerWidth - 50}px`;
    setTimeout(() => {
        slidingContainer.style.transition = 'transform 0.5s ease-out';
        slidingContainer.style.transform = 'translateX(0)';
    }, 100);
}

// Initial setup calls.
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateSlidingContainerWidth();
});

ipcRenderer.on('toggle-window', () => {
    expandButton.click();
});
