document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  let dragged;

  // Force rectangular layout: 5 columns x 3 rows
  function setGridSize() {
    const rows = 3;
    const cols = 5;
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  }

  function makeDraggable(el) {
    el.draggable = true;
    el.addEventListener("dragstart", e => {
      dragged = el;
      e.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    el.addEventListener("drop", e => {
      e.preventDefault();
      if (dragged !== el) {
        const temp = document.createElement("div");
        board.insertBefore(temp, el);
        board.insertBefore(el, dragged);
        board.insertBefore(dragged, temp);
        board.removeChild(temp);
      }
    });
  }

  // Load puzzle pieces
  const pieces = [
    "puzzle2_A.jpg","puzzle2_B.jpg","puzzle2_C.jpg",
    "puzzle2_D.jpg","puzzle2_E.jpg","puzzle2_F.jpg",
    "puzzle2_G.jpg","puzzle2_H.jpg","puzzle2_I.jpg",
    "puzzle2_J.jpg","puzzle2_K.jpg","puzzle2_L.jpg",
    "puzzle2_M.jpg"
  ];

  setGridSize();

  pieces.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("piece");
    makeDraggable(img);
    board.appendChild(img);
  });

  // Fill blanks if grid has more slots than pieces
  const totalSlots = 5 * 3; // 15
  for (let i = pieces.length; i < totalSlots; i++) {
    const blank = document.createElement("div");
    blank.classList.add("piece");
    board.appendChild(blank);
  }
});
