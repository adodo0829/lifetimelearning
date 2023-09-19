//  async
function loadingImageTexture() {
  textureList.forEach((t) => {
    PIXI.Texture.fromLoader(t.url, "", t.key);
  });
  MapManager.textures = PIXI.utils.TextureCache;
}

//   async

function loadingUrlImgTexture(gridMapList) {
  this.loadUrlImgNum = 0;
  this.urlImgNum = gridMapList.size;
  gridMapList.forEach((t) => {
    let url = t.gridMapUrl;
    url ? this.imgUrlToBase64(url, t.subMapID) : (this.loadUrlImgNum += 1);
  });
  MapManager.textures = PIXI.utils.TextureCache;
}

//   async
function imgUrlToBase64(imgUrl, imgKey) {
  let base64Url = "";
  let image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.src = imgUrl;

  const that = this;
  image.onload = function () {
    //image.onload为异步加载
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    base64Url = canvas.toDataURL("image/jpeg", 1);
    PIXI.Texture.fromLoader(base64Url, "", imgKey);
    that.loadUrlImgNum += 1;
  };
}
