class MatrixStack {
    constructor(modelViewMatrix) {
        this.modelViewMatrix = modelViewMatrix;
        this.modelViewMatrixStack = [];
    }
    pushModelViewMatrix() {
        var copyToPush = this.modelViewMatrix.slice(0);
        this.modelViewMatrixStack.push(copyToPush);
    }

    popModelViewMatrix() {
        if (this.modelViewMatrixStack.length == 0) {
            throw "矩阵栈为空！";
        }
        this.modelViewMatrix = this.modelViewMatrixStack.pop();
    }
}