const matrixBoardA= document.getElementById("matrixBoardA")
const matrixBoardB= document.getElementById("matrixBoardB")
const resultMatrix = document.getElementById("resultMatrix")
var boardA = []
var boardB = []
var resultArr = []
var result = 0
let isCustomActive = false
let activeSizeElement1 = null
let activeSizeElement2 = null

function createBoardArray(type,colsize,rowsize){
    type === 0 ? boardA = [] : boardB = [] 
    for(let col = 0; col < colsize; col++){
        const rowArr = []
        for(let row = 0; row < rowsize; row++){
            rowArr.push(0)                
        }
        type === 0 ? boardA.push(rowArr) : boardB.push(rowArr)
    }
}
function drawBoard(array,type){
    const clearParent = type === 2 ? resultMatrix : (type === 0 ? matrixBoardA : matrixBoardB)
    removeAllChildNodes(clearParent)
    array.forEach((row,rowIndex)=>{
        row.forEach((value,colIndex)=>{
            const valueBox = document.createElement("div")
            const valueInput = document.createElement("input")
            valueBox.className = "valuebox"
            valueInput.className = "valueinput"
            valueBox.style.height =  180 / array.length  + "px"
            valueBox.style.width =  180 / array[0].length  + "px"
            valueInput.value = value
            valueInput.placeholder = 0
         
            
            valueInput.id = ( type===0 ? "a" : "b" ) + rowIndex + colIndex

            valueInput.addEventListener("click",(event)=>{
                event.target.value = ""
            })
            valueInput.addEventListener("change",(event)=>{
                
                event.target.value =  checkDecimal(event.target.value)
                event.target.value =  checkValueIsNum(event.target)
                if(event.target.id.charAt(0)==="a"){
                    boardA[Number(event.target.id.charAt(1))][Number(event.target.id.charAt(2))] = Number(event.target.value)
                }else if(event.target.id.charAt(0)==="b"){
                    boardB[Number(event.target.id.charAt(1))][Number(event.target.id.charAt(2))] = Number(event.target.value)

                }
            })

            valueBox.appendChild(valueInput)
            type === 2 ? 
            resultMatrix.appendChild(valueBox) : 
            (type === 0 ? matrixBoardA.appendChild(valueBox) : matrixBoardB.appendChild(valueBox))
        })
    })
}
function checkDecimal(value){
    const decimalCorrection = value.replace(/,/g, '.')
    return decimalCorrection 
}
function checkValueIsNum(node){
    if(isNaN(Number(node.value))){
        errorHandler("input",0)
        node.classList.add("inputerror")
        setTimeout(()=>{
            node.classList.remove("inputerror")
        },1000)
        return 0
    }else{
        return node.value
    }
}
function removeAllChildNodes(parent) {
    if(!parent.firstChild) return
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}   
function addition(){
    if(errorHandler("addition")) return
    resultArr = []
    boardB.forEach((row,rowIndex)=>{
        const newRow = []
        row.forEach((element,colIndex)=>{
            newRow.push(element+boardA[rowIndex][colIndex])
        })
        resultArr.push(newRow)
    })
   createSolution(0,"addition")
}
function subtraction(){
    if(errorHandler("addition")) return
    resultArr = []
    boardA.forEach((row,rowIndex)=>{
        const newRow = []
        row.forEach((element,colIndex)=>{
            newRow.push(element-boardB[rowIndex][colIndex])
        })
        resultArr.push(newRow)
   })
   createSolution(0,"subtraction");
}
function multiplication(){
    if(errorHandler("multiplication")) return
    resultArr = []
    const columns = boardA.length
    const rows = boardA[0].length 
    boardA.forEach((row)=>{
        const newRow = []
        for(let col = 0; col < boardB[0].length; col++){
            var element = 0
            for(let elem = 0; elem < row.length; elem++){
                element = element + row[elem]*boardB[elem][col] 
            }
            newRow.push(element)
        }
        resultArr.push(newRow)
    })
    createSolution(0,"multiplication")
} 

function transpoze(type){
    resultArr = []
    const board = type === 0 ? boardA : boardB
    const transpozedArr = []
    for(let row = 0; row < board[0].length; row++){
        const newRow = []
        for(let col = 0; col < board.length; col++){
            newRow.push(board[col][row])
        }
        transpozedArr.push(newRow)
    } 
    resultArr = transpozedArr
    createSolution(0,"transpoze")
}      
function determinant(type){
    if(errorHandler("determinant",type)) return
    const board = type === 0 ? boardA : boardB
    var cofactorArr = []

    function findCofactors(matrix){
        const newCofArr = []
        function isEven(n){
            return n % 2 === 0;
        }
        for(let size = 0; size < ( Array.isArray(matrix) ?  matrix.length : matrix.c.length ) ; size++){
            const fakeBoard = Array.isArray(matrix) ? matrix.map(row => row.slice()) : matrix.c.map(row => row.slice())
            const coefficient = isEven(fakeBoard[0].indexOf(fakeBoard[0][size])) ? fakeBoard[0][size] : - fakeBoard[0][size]
            const newArr = fakeBoard.map((val) => {
                return val.slice(0, size).concat(val.slice(size + 1));
            });
            const cofactor = newArr.slice(1)
            newCofArr.push({a:( matrix.a ? matrix.a * coefficient : coefficient ),c:cofactor})
        }
         newCofArr.forEach((array)=>{
             if(array.c ? array.c.length > 3 : array.length > 3){
                 findCofactors(array)
             }else{
                 cofactorArr.push(array)
                
             }
         })

    }
    
    if(board.length === 1){
        result = board[0]
    }else
    if(board.length === 2){
        result = board[0][0]*board[1][1]-board[0][1]*board[1][0]
    }else
    if(board.length === 3){
        result = determinant3x3(board)
    }else 
    if(board.length > 3){
        findCofactors(board)
        cofactorArr.forEach((item)=>{
            result += item.a * determinant3x3(item.c)
         })
         
    }
    console.log(result);
    createSolution(1,"Determinant is")
}
function determinant3x3(matrix){
    var a11 = matrix[0][0];
    var a12 = matrix[0][1];
    var a13 = matrix[0][2];
    var a21 = matrix[1][0];
    var a22 = matrix[1][1];
    var a23 = matrix[1][2];
    var a31 = matrix[2][0];
    var a32 = matrix[2][1];
    var a33 = matrix[2][2];

    var det = a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);

    return det;
}

function scalarMultiplication(type){
    const inputValue = type === 0 ? document.getElementById("scalarInputA") : document.getElementById("scalarInputB")
    const board = type === 0 ? boardA : boardB
    const newBoard = []
    board.forEach((row)=>{
        const newRow = []
        row.forEach((element)=>{
            element = element * inputValue.value
            newRow.push(element)
        })
        newBoard.push(newRow)
    })
    resultArr = newBoard
    createSolution(0,"scalar multiplication")
}

function openCustom(type){
    if(isCustomActive){
        return
    }
    const button = type === 0 ? document.getElementById("custom1") : document.getElementById("custom2")
    button.classList.add("customon")
    button.innerText = ""
    const colInput = document.createElement("input")
    colInput.type = "number"
    colInput.addEventListener("input",()=>{
        var inputValue = colInput.value

        if(inputValue <= 0){
            colInput.value = 1
        }else if(inputValue > 10) {
            colInput.value = 10
        }
        
    })

    const colText = document.createElement("div")
    colText.innerText = "Col"

    const rowInput = document.createElement("input")
    const rowText = document.createElement("div")
    rowText.innerText = "Row"

    rowInput.addEventListener("input",()=>{
        var inputValue = rowInput.value

        if(inputValue < 0){
            rowInput.value = 1
        }else if(inputValue > 10) {
            rowInput.value = 10
        }
        
    })

    const createButton = document.createElement("button")
    createButton.style.zIndex = 1
    createButton.addEventListener("click",(event)=>{
        createCustomBoard(event.target.parentNode.id);
    })
    
    createButton.innerText = "create"

    button.appendChild(colText)
    button.appendChild(colInput)
    button.appendChild(rowText)
    button.appendChild(rowInput)
    button.appendChild(createButton)
    isCustomActive = true
   
}
function createCustomBoard(type){
    const side = document.getElementById(type)
    var rowValue = side.querySelectorAll("input")[0].value
    var colValue = side.querySelectorAll("input")[1].value
    if(rowValue === ""){
        rowValue = 3
        errorHandler("emptyinput")
    }
    if(colValue === ""){
        colValue = 3
        errorHandler("emptyinput")
    }
    createBoardArray(type === "custom1" ? 0 : 1 ,colValue,rowValue)
    drawBoard(type === "custom1" ? boardA : boardB, type === "custom1" ? 0 :1)
    closeCustom()

}
function closeCustom(){
    const button1 = document.getElementById("custom1")
    const button2 = document.getElementById("custom2")
    removeAllChildNodes(button1)
    removeAllChildNodes(button2)
    button1.classList.remove("customon")
    button2.classList.remove("customon")
    button1.innerText = "custom"
    button2.innerText = "custom"
    setTimeout(()=>{
        isCustomActive = false
    },500)
}
function createSolution(type,operation){
    const solutionArea = document.getElementById("solutionArea")
    const solutionMessage = document.getElementById("solutionMessage")
    solutionArea.className = "solutionAreaDefault"
    console.log(result ,"ene");
    
    if(type === 0){
        drawBoard(resultArr,2)
        resultMatrix.className = "resultMatrixOn"
        solutionArea.className = "solutionAreaType1"
        solutionMessage.innerText = operation
        
    }else 
    if(type === 1){
        removeAllChildNodes(resultMatrix)
        resultMatrix.className = "resultMatrixOff"
        solutionArea.className = "solutionAreaType2"
        solutionMessage.innerText = operation + " " + result
        
    }
}

function sizeButtonAdjustment(){
    const sizeButtons1 = document.getElementById("size1").querySelectorAll("div")
    const sizeButtons2 = document.getElementById("size2").querySelectorAll("div")

    activeSizeElement1 = sizeButtons1[1]
    activeSizeElement1.classList.add("sizeButtonActive")
    sizeButtons1.forEach((div)=>{
        div.addEventListener("click",(event)=>{
            if(activeSizeElement1 !== event.target){
                activeSizeElement1.classList.remove("sizeButtonActive")
            }
            if(div.id==="custom1") return
            activeSizeElement1 = div
            activeSizeElement1.classList.add("sizeButtonActive")
        })
    })

    activeSizeElement2 = sizeButtons2[1]
    activeSizeElement2.classList.add("sizeButtonActive")
    sizeButtons2.forEach((div)=>{
        div.addEventListener("click",(event)=>{
            if(activeSizeElement2 !== event.target){
                activeSizeElement2.classList.remove("sizeButtonActive")
            }
            if(div.id === "custom2") return
            activeSizeElement2 = div
            activeSizeElement2.classList.add("sizeButtonActive")
        })
    })
}

function inverse(type){
    resultArr = []
    const board = type === 0 ? boardA : boardB
    
    const rows = board.length;
    const cols = board[0].length;
    
    const inverseMatrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
        inverseMatrix[i] = new Array(cols);
    }
    
    const identityMatrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
        identityMatrix[i] = new Array(cols).fill(0);
        identityMatrix[i][i] = 1;
    }

    for (let k = 0; k < rows; k++) {
        const factor = 1 / board[k][k];
        for (let j = 0; j < cols; j++) {
        board[k][j] *= factor;
        identityMatrix[k][j] *= factor;
    }
    
    for (let i = 0; i < rows; i++) {
        if (i !== k) {
            const temp = board[i][k];
            for (let j = 0; j < cols; j++) {
                board[i][j] -= board[k][j] * temp;
                identityMatrix[i][j] -= identityMatrix[k][j] * temp;
            }
        }
    }
}
resultArr = identityMatrix
if(errorHandler("inverse",type)) return
    createSolution(0,"inverse")
    
}

function errorHandler(operation,type){
    const board = type === 0 ? boardA : boardB
    const error1 = "Determinant can only be calculated for square matrices.Please provide a square matrix for determinant calculation."
    const error2 = "Inverse can only be calculated for square matrices.Please provide a square matrix for inverse calculation."
    const error3 = "The inverse of a matrix with a determinant of 0 does not exist.Please provide a non-singular (invertible) matrix for inverse calculation."
    const error4 = "Matrix addition and subtraction requires matrices of the same dimensions.Please provide matrices with equal dimensions for addition and subtraction."
    const error5 = "Matrix multiplication requires the number of columns in the first matrix to be equal to the number of rows in the second matrix.Please provide matrices that satisfy the column and row compatibility for multiplication."
    const error6 = "Invalid input. Please enter a valid numerical value."
    const error7 = "Incomplete dimensions. Please provide values for both row and column dimensions to create a new board."



    function isArraySquare(board){
       return board.length === board[0].length ? true : false
    }
    function isArraysSameSize(){
      return  boardA.length === boardB.length && boardA[0].length === boardB[0].length ? true : false
    }
    function forMultiply(){
        return boardA[0].length === boardB.length ? true : false
    }
    function openErrorModal(errorType){
        const modal = document.getElementById("modal")
        const errorMessage = document.getElementById("errorMessage")
        modal.style.display = "flex"
        modal.style.opacity = "1"
        setTimeout(()=>{
            modal.style.opacity = "0"
        },3000)
        setTimeout(()=>{
            modal.style.display = "none"
        },4000)
        errorMessage.innerText = errorType
    }


    if(operation === "determinant" && !isArraySquare(board)){
        openErrorModal(error1)
       return true
    } else
    if(operation === "inverse"){
        if(!isArraySquare(board)){
            openErrorModal(error2)
            return true
        }else if(isNaN(resultArr[0][0]) || !isFinite(resultArr[0][0])){
            openErrorModal(error3)
            return true
        }
    } else
    if(operation === "addition" && !isArraysSameSize()){
        openErrorModal(error4)
        return true
    } else
    if(operation === "multiplication" && !forMultiply()){
        openErrorModal(error5)
        return true
    } else
    if(operation === "input"){
        openErrorModal(error6)
        return true
    } else
    if(operation === "emptyinput"){
        openErrorModal(error7)
        return true
    }
    
    return false

}

createBoardArray(0,3,3)
drawBoard(boardA,0)
createBoardArray(1,3,3)
drawBoard(boardB,1)
sizeButtonAdjustment()

