const video = document.getElementById("video");

let draggedPiece;


navigator.mediaDevices.getUserMedia({
video: true
})
.then(stream => {
video.srcObject = stream;
});

const captureBtn = document.getElementById("capture");
const canvas = document.getElementById("canvas");

captureBtn.addEventListener("click", () => {


const ctx = canvas.getContext("2d");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

ctx.save();

ctx.scale(-1, 1);

ctx.drawImage(
    video,
    -canvas.width,
    0,
    canvas.width,
    canvas.height
);

ctx.restore();

const container = document.getElementById("puzzle-container");
container.innerHTML = "";

for(let row = 0; row < 3; row++){
    for(let col = 0; col < 3; col++){

        const piece = document.createElement("canvas");
        piece.dataset.row = row;
piece.dataset.col = col;

        piece.classList.add("piece");
        piece.draggable = true;

        piece.width = 200;
        piece.height = 150;

        const pctx = piece.getContext("2d");

        pctx.drawImage(
            canvas,
            col * (canvas.width / 3),
            row * (canvas.height / 3),
            canvas.width / 3,
            canvas.height / 3,
            0,
            0,
            200,
            150
        );

piece.addEventListener("dragstart", () => {
    draggedPiece = piece;
});

        piece.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        piece.addEventListener("drop", (e) => {
            e.preventDefault();

            if(draggedPiece && draggedPiece !== piece){

               const parent = piece.parentNode;

const draggedNext = draggedPiece.nextSibling;
const pieceNext = piece.nextSibling;

parent.insertBefore(draggedPiece, pieceNext);
parent.insertBefore(piece, draggedNext);
checkWin();


            }
        });

        container.appendChild(piece);
    }
}
const pieces = Array.from(container.children);

pieces.sort(() => Math.random() - 0.5);

container.innerHTML = "";

pieces.forEach(piece => {
    container.appendChild(piece);
});
});
function checkWin() {

    const pieces = document.querySelectorAll(".piece");

    let solved = true;

    pieces.forEach((piece, index) => {

        const row = Math.floor(index / 3);
        const col = index % 3;

        if (
            row != piece.dataset.row ||
            col != piece.dataset.col
        ) {
            solved = false;
        }

    });

    if (solved) {

    document.getElementById("puzzle-container").innerHTML = "";

    const solvedImg = document.createElement("img");

    solvedImg.src = canvas.toDataURL();

    solvedImg.style.width = "600px";
    solvedImg.style.border = "5px solid gold";
    solvedImg.style.borderRadius = "20px";

    document.getElementById("puzzle-container").appendChild(solvedImg);

    document.body.innerHTML += `
    <div id="winMessage">
        🎉 PUZZLE SOLVED! 🎉
    </div>
    `;

}
}
