document.querySelectorAll('.puzzle img, .extra-piece img').forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);

        const label = document.createElement('span');
        label.innerText = item.alt;
        label.style.position = 'absolute';
        label.style.background = '#fff';
        label.style.border = '1px solid #000';
        label.style.padding = '2px';
        label.id = 'drag-label';
        document.body.appendChild(label);
    });
});

document.addEventListener('dragover', e => {
    e.preventDefault();
    const label = document.getElementById('drag-label');
    if (label) {
        label.style.left = e.pageX + 'px';
        label.style.top = e.pageY + 'px';
    }
});

document.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const draggedElement = document.getElementById(id);
    const dropTarget = e.target;

    if (dropTarget.tagName === 'IMG') {
        const tempSrc = dropTarget.src;
        dropTarget.src = draggedElement.src;
        draggedElement.src = tempSrc;
    }

    const label = document.getElementById('drag-label');
    if (label) label.remove();
});
