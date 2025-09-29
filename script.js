const filenames = [
  "puzzle2_A.jpg","puzzle2_B.jpg","puzzle2_C.jpg","puzzle2_D.jpg",
  "puzzle2_E.jpg","puzzle2_F.jpg","puzzle2_G.jpg","puzzle2_H.jpg",
  "puzzle2_I.jpg","puzzle2_J.jpg","puzzle2_K.jpg","puzzle2_L.jpg","puzzle2_M.jpg"
];
const imagePathPrefix = "images/"; // put the jpgs in ./images/

const board = document.getElementById('board');
const dragLabel = document.getElementById('dragLabel');
const shuffleBtn = document.getElementById('shuffleBtn');
const solveBtn = document.getElementById('solveBtn');
const showSolutionBtn = document.getElementById('showSolution');

let tiles = []; 
let solvedOrder = []; 
let cols = 0;

function initTiles(){
  tiles = filenames.map((f,i)=>({id: 't'+i, filename:f}));
  solvedOrder = tiles.map(t=>t.id);
  setGridSize(tiles.length);
  renderBoard(tiles);
}

function setGridSize(n){
  const c = Math.ceil(Math.sqrt(n));
  cols = c;
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

function renderBoard(arr){
  board.innerHTML = '';
  arr.forEach((tile, idx)=>{
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.draggable = true;
    cell.dataset.id = tile.id;
    const img = document.createElement('img');
    img.src = imagePathPrefix + tile.filename;
    img.alt = tile.filename;
    cell.appendChild(img);

    cell.addEventListener('dragstart', onDragStart);
    cell.addEventListener('dragover', e=>e.preventDefault());
    cell.addEventListener('dragenter', onDragEnter);
    cell.addEventListener('dragleave', e=>e.currentTarget.classList.remove('over'));
    cell.addEventListener('drop', onDrop);
    cell.addEventListener('dragend', cleanupDragState);
    cell.addEventListener('pointerdown', onPointerDown);

    board.appendChild(cell);
  });
}

let draggingId = null;

function onDragStart(e){
  const el = e.currentTarget;
  draggingId = el.dataset.id;
  el.classList.add('dragging');
  dragLabel.style.display = 'block';
  dragLabel.textContent = el.querySelector('img').alt;
  if(e.dataTransfer){
    e.dataTransfer.setData('text/plain', draggingId);
    const img = new Image(); 
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    e.dataTransfer.setDragImage(img,0,0);
  }
}

function onDragEnter(e){
  const el = e.currentTarget;
  if(el.dataset.id !== draggingId) el.classList.add('over');
}

function onDrop(e){
  e.preventDefault();
  const target = e.currentTarget;
  const sourceId = draggingId || e.dataTransfer.getData('text/plain');
  const targetId = target.dataset.id;
  if(!sourceId || sourceId === targetId) return;
  swapTilesById(sourceId, targetId);
  cleanupDragState();
}

function cleanupDragState(){
  draggingId = null;
  dragLabel.style.display = 'none';
  document.querySelectorAll('.cell.dragging, .cell.over').forEach(el=>{
    el.classList.remove('dragging','over');
  });
}

function swapTilesById(idA, idB){
  const idxA = tiles.findIndex(t=>t.id===idA);
  const idxB = tiles.findIndex(t=>t.id===idB);
  if(idxA<0||idxB<0) return;
  [tiles[idxA], tiles[idxB]] = [tiles[idxB], tiles[idxA]];
  renderBoard(tiles);
}

// Pointer fallback
let pointerDrag=null;
function onPointerDown(e){
  if(e.pointerType === 'mouse' && e.button!==0) return;
  const el = e.currentTarget;
  el.setPointerCapture(e.pointerId);
  pointerDrag={id:el.dataset.id};
  el.classList.add('dragging');
  dragLabel.style.display='block';
  dragLabel.textContent=el.querySelector('img').alt;
  function move(ev){dragLabel.style.left=ev.clientX+'px';dragLabel.style.top=ev.clientY+'px';}
  function up(ev){
    el.releasePointerCapture(e.pointerId);
    document.removeEventListener('pointermove',move);
    document.removeEventListener('pointerup',up);
    const under=document.elementFromPoint(ev.clientX,ev.clientY);
    const target=under&&under.closest&&under.closest('.cell');
    if(target&&target.dataset.id!==pointerDrag.id){
      swapTilesById(pointerDrag.id,target.dataset.id);
    }
    el.classList.remove('dragging');dragLabel.style.display='none';pointerDrag=null;
  }
  document.addEventListener('pointermove',move);
  document.addEventListener('pointerup',up);
}

document.addEventListener('dragover', e=>{
  dragLabel.style.left=e.clientX+'px';dragLabel.style.top=e.clientY+'px';
});

function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

shuffleBtn.addEventListener('click',()=>{
  shuffleArray(tiles);renderBoard(tiles);
});

solveBtn.addEventListener('click',()=>{
  tiles = solvedOrder.map(id=>{
    const idx = parseInt(id.replace('t',''));
    return {id:id, filename:filenames[idx]};
  });
  renderBoard(tiles);
});

let overlay=null;
showSolutionBtn.addEventListener('click',()=>{
  if(overlay){overlay.remove();overlay=null;showSolutionBtn.textContent='Show solution (overlay)';return;}
  overlay=document.createElement('div');
  overlay.style.position='absolute';
  overlay.style.left=board.getBoundingClientRect().left+'px';
  overlay.style.top=board.getBoundingClientRect().top+'px';
  overlay.style.zIndex=900;overlay.style.pointerEvents='none';
  overlay.style.display='grid';
  const c=Math.ceil(Math.sqrt(filenames.length));
  overlay.style.gridTemplateColumns=`repeat(${c},1fr)`;
  overlay.style.width=board.offsetWidth+'px';
  overlay.style.opacity='0.9';
  filenames.forEach(fn=>{
    const d=document.createElement('div');
    const im=document.createElement('img');
    im.src=imagePathPrefix+fn;
    im.style.width='100%';im.style.height='100%';im.style.objectFit='cover';
    d.appendChild(im);overlay.appendChild(d);
  });
  document.body.appendChild(overlay);
  showSolutionBtn.textContent='Hide solution overlay';
});

initTiles();
