import BLOCKS from './blocks.js';

//DOM
const playGround = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-over");
const scoreCount = document.querySelector(".score");
const restartBtn = document.querySelector(".game-over > button");

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const movingItem = {
    type: "",
    direction: 1,
    top: 0,
    left: 0,
}

init();

//function
function init(){
    tempMovingItem = { ...movingItem };
    for(let i=0; i<GAME_ROWS; i++){
        prependNewLine();
    };
    generateNewBlock();
};
function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j<GAME_COLS; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    };
    li.prepend(ul);
    playGround.prepend(li)
};
function renderBlocks(moveType = ""){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    });
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playGround.childNodes[y] ? playGround.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving");
        }else{
            tempMovingItem = { ...movingItem };
            if(moveType === "retry"){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(() => {
                renderBlocks("retry");
                if(moveType === "top"){
                    seizeBlock();
                }
            },0);
            return true;
        };
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
};
function showGameoverText(){
    gameText.style.display = 'block';
};
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkMatch();
};
function checkMatch(){
    const childNodes = playGround.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")){
                matched = false;
            };
        });
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreCount.innerHTML = score;
        };
    });

    generateNewBlock();
};
function generateNewBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1);
    },duration);

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random()*blockArray.length);

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
};
function checkEmpty(target){
        if(!target || target.classList.contains("seized")){
            return false;
        };
        return true;
};
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
};
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
};

//event handler
document.addEventListener("keydown",e => {
    switch (e.keyCode){
        case 39:
            moveBlock("left",1);
            break;
        case 37:
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top",1);
            break;
        case 32:
            changeDirection();
        default:
            break;
    }
});
restartBtn.addEventListener("click", () => {
    window.location.reload();
});