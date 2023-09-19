import { chunk } from "lodash";
import { Resolution, Settings } from "@/constants/settings";
import { MapEvent, SelectMode } from "@/constants/enums";
import { isPointInPolygon, IsPointInRect, getAreaInfo } from "../utils";

const cursorF = require("../images/cursors/forbid.png");
const cursorFPod = require("../images/cursors/forbid-pod.png");

export class EventSystem {
  #startPoint = [];
  #endPoint = [];
  #mousePoint = [];
  #clickFlag = false; // 点击
  #dragFlag = false; // 拖拽
  #drawFlag = false; // 绘制
  #suspendFlag = false; // 中断

  constructor(canvasDom, mapManager, eventBus) {
    this.canvasDom = canvasDom;
    this.mapManager = mapManager;
    this.eventBus = eventBus;
    this.selectMode = SelectMode.MULTIPLE;
    this.time = 0;
    this.angle = 0;
    this.mapPx = 0;
    this.mapPy = 0;
    this.attachNode = null;
    this.init();
  }

  init() {
    this.canvasDom.addEventListener("click", this.clickHandler.bind(this));
    this.canvasDom.addEventListener(
      "mousewheel",
      this.mousewheelHandler.bind(this)
    );
    this.canvasDom.addEventListener(
      "mousedown",
      this.mousedownHandler.bind(this)
    );
    this.canvasDom.addEventListener(
      "mousemove",
      this.mousemoveHandler.bind(this)
    );
    this.canvasDom.addEventListener("mouseup", this.mouseupHandler.bind(this));
    // window.addEventListener('resize', debounce(this.resizeHandler.bind(this), 100));
  }

  destroy() {
    this.canvasDom.removeEventListener("click", this.clickHandler.bind(this));
    this.canvasDom.removeEventListener(
      "mousewheel",
      this.mousewheelHandler.bind(this)
    );
    this.canvasDom.removeEventListener(
      "mousedown",
      this.mousedownHandler.bind(this)
    );
    this.canvasDom.removeEventListener(
      "mousemove",
      this.mousemoveHandler.bind(this)
    );
    this.canvasDom.removeEventListener(
      "mouseup",
      this.mouseupHandler.bind(this)
    );
    // window.removeEventListener('resize', debounce(this.resizeHandler.bind(this), 100));
    this.resetSelectMode();
  }

  get renderer() {
    return this.mapManager.getEngine();
  }
  get rootLayer() {
    return this.mapManager.rootLayer;
  }
  get nodeLayer() {
    return this.mapManager.nodeLayer;
  }
  get podLayer() {
    return this.mapManager.podLayer;
  }
  get deviceLayer() {
    return this.mapManager.deviceLayer;
  }
  get edgeLayer() {
    return this.mapManager.edgeLayer;
  }
  get forbidLayer() {
    return this.mapManager.forbidLayer;
  }
  get areaLayer() {
    return this.mapManager.areaLayer;
  }
  get palletLineLayer() {
    return this.mapManager.palletLineLayer;
  }
  get markLayer() {
    return this.mapManager.markLayer;
  }
  get drawerLayer() {
    return this.mapManager.drawerLayer;
  }

  setEventSuspend(flag) {
    this.#suspendFlag = flag;
  }

  setSelectMode(mode) {
    this.selectMode = mode;
    this.changeMouseStyleByMode(mode);
  }
  resetSelectMode() {
    this.selectMode = SelectMode.MULTIPLE;
    this.changeMouseStyleByMode(SelectMode.MULTIPLE);

    this.#startPoint = [];
    this.#endPoint = [];
    this.#mousePoint = [];
    this.#clickFlag = false; // 点击
    this.#dragFlag = false; // 拖拽
    this.#drawFlag = false; // 绘制
    this.#suspendFlag = false; // 中断
    this.attachNode = null;
  }

  changeMouseStyleByMode(mode) {
    switch (mode) {
      case SelectMode.MULTIPLE:
        this.canvasDom.style.cursor = "default";
        break;
      case SelectMode.NODE:
        this.canvasDom.style.cursor = "pointer";
        break;
      case SelectMode.FORBID:
        this.canvasDom.style.cursor = `url(${cursorF}), pointer`;
        break;
      case SelectMode.FORBID_POD:
        this.canvasDom.style.cursor = `url(${cursorFPod}), pointer`;
        break;
      default:
        this.canvasDom.style.cursor = "default";
        break;
    }
  }

  mousewheelHandler(event) {
    if (this.selectMode === SelectMode.RELOCATE) return;
    if (this.selectMode === SelectMode.ATTACH) return;

    let currTime = performance.now();
    const gap = currTime - this.time;
    if (gap < 50) return;

    const currScale = this.rootLayer.scale;
    const RATE = 0.004;
    const step = event.wheelDelta > 0 ? RATE : -Math.abs(RATE);
    if (currScale.x + step >= RATE) {
      currScale.x += step;
      currScale.y += step;
      if (currScale.x < Settings.MIN_SCALE) {
        this.rootLayer.scale.x = Settings.MIN_SCALE;
        this.rootLayer.scale.y = Settings.MIN_SCALE;
        return;
      } else if (currScale.x > Settings.MAX_SCALE) {
        this.rootLayer.scale.x = Settings.MAX_SCALE;
        this.rootLayer.scale.y = Settings.MAX_SCALE;
        return;
      } else {
        // (min, max) render
        this.eventBus.emit(MapEvent.ZOOM, this.rootLayer.scale.x);
        this.renderer.render(this.rootLayer);
        let renderTime = performance.now();
        this.time = renderTime;
      }
    }
  }

  mousedownHandler(e) {
    document.oncontextmenu = (evt) => {
      evt.preventDefault();
    };
    const RIGHT = 2;
    if (e.button === RIGHT) {
      console.log("触发了右键事件");
      return;
    }

    const x = e.offsetX;
    const y = e.offsetY;
    this.#mousePoint[0] = x;
    this.#mousePoint[1] = y;

    // ============== 重定位模式 ================
    if (this.selectMode === SelectMode.RELOCATE) {
      this.relocateMouseDownHandler(x, y);
      return;
    }
    // ============== 吸附模式 ================
    if (this.selectMode === SelectMode.ATTACH) return;

    this.#dragFlag = true;
    this.#clickFlag = true;
  }

  mousemoveHandler(e) {
    // ============== 重定位模式 ================
    if (this.selectMode === SelectMode.RELOCATE) {
      this.relocateMouseMoveHandler(e);
      return;
    }

    // ============== 吸附模式 ================
    if (this.selectMode === SelectMode.ATTACH) {
      this.attachMouseMoveHandler(e);
      return;
    }

    // ====== 平移模式 ========
    this.#clickFlag = false;

    if (this.#dragFlag) {
      let currTime = performance.now();
      const gap = currTime - this.time;
      if (gap < 50) return;
      this.canvasDom.style.cursor = "move";
      const x = e.offsetX;
      const y = e.offsetY;
      const dx = x - this.#mousePoint[0];
      const dy = y - this.#mousePoint[1];
      this.rootLayer.position.x += dx;
      this.rootLayer.position.y += dy;
      this.#mousePoint[0] = x;
      this.#mousePoint[1] = y;
      this.renderer.render(this.rootLayer);
      let renderTime = performance.now();
      this.time = renderTime;
    }
  }

  mouseupHandler() {
    this.#dragFlag = false;
    this.changeMouseStyleByMode(this.selectMode);
  }

  // resizeHandler() {
  //   console.log('---- resize window ----');
  // }

  clickHandler(e) {
    const { offsetX, offsetY } = e;
    const point = {
      x: offsetX,
      y: offsetY,
    };
    let [node, pod, devices, edge, forbid, area, palletLine, mark] = [
      {},
      {},
      [],
      {},
      {},
      {},
      {},
      {},
    ];

    const nodeSprites = this.nodeLayer.children || [];
    const podSprites = this.podLayer.children;
    const deviceSprites = this.deviceLayer.children;
    const edgeSprites = this.edgeLayer.children;
    const forbidSprites = this.forbidLayer.children;
    const areaSprites = this.areaLayer.children;
    const palletLineSprites = this.palletLineLayer.children;
    const markSprites = this.markLayer.children;

    if (this.selectMode === SelectMode.RELOCATE) return;
    // ============== 吸附模式 ================

    if (this.selectMode === SelectMode.ATTACH) {
      // 吸附模式要选择node点进行
      this.handleAttachClick(nodeSprites, point);
      return;
    }

    // ============== 选择模式 ================
    if (!this.#clickFlag) return;

    if (forbidSprites.length) {
      for (let i = 0; i < forbidSprites.length; i++) {
        const forbidSprite = forbidSprites[i];
        const vArray = forbidSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);

        if (flag) {
          forbid = forbidSprite.extra;
          break;
        }
      }
    }

    if (nodeSprites.length) {
      for (let i = 0; i < nodeSprites.length; i++) {
        const nodeSprite = nodeSprites[i];
        const vArray = nodeSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          node = nodeSprite.extra;
          break;
        }
      }
    }

    if (podSprites.length) {
      for (let i = 0; i < podSprites.length; i++) {
        const podSprite = podSprites[i];
        const vArray = podSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          pod = podSprite.extra;
          break;
        }
      }
    }

    if (deviceSprites.length) {
      for (let i = 0; i < deviceSprites.length; i++) {
        const deviceSprite = deviceSprites[i];
        const vArray = deviceSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          devices.push(deviceSprite.extra);
        }
      }
    }

    if (edgeSprites.length) {
      for (let i = 0; i < edgeSprites.length; i++) {
        const edgeSprite = edgeSprites[i];
        let polygonPointArray = [];
        if (edgeSprite.vertexData) {
          const vArray = edgeSprite.vertexData;
          polygonPointArray = chunk(vArray, 2).map((item) => {
            return {
              x: Math.ceil(item[0]),
              y: Math.ceil(item[1]),
            };
          });
        } else {
          const vertexData = [];
          const points = edgeSprite._geometry.points;
          const chunkPoints = chunk(points, 2).map((item) => {
            return {
              x: Math.ceil(item[0]),
              y: Math.ceil(item[1]),
            };
          });
          chunkPoints.forEach((point, i) => {
            if (i % 3 === 0) {
              // 每隔三组点位取一个坐标点，模糊准确，减少计算量
              const { x, y } = edgeSprite.toGlobal(point);
              vertexData.push(x, y);
              polygonPointArray.push({
                x: Math.ceil(x),
                y: Math.ceil(y),
              });
            }
          });
          // 缓存计算结果，避免下次重复计算顶点坐标信息
          edgeSprite.vertexData = vertexData;
        }

        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          edge = edgeSprite.extra;
          break;
        }
      }
    }

    if (areaSprites.length) {
      for (let i = 0; i < areaSprites.length; i++) {
        const areaSprite = areaSprites[i];
        const vArray = areaSprite.vertexData;

        const usedArray = vArray.slice(0, 8);

        const polygonPointArray = chunk(usedArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });

        const { minX, maxX, minY, maxY } = getAreaInfo(polygonPointArray);

        const flag = IsPointInRect(point, minX, maxX, minY, maxY);

        if (flag) {
          area = areaSprite.extra;
          break;
        }
      }
    }

    if (palletLineSprites.length) {
      for (let i = 0; i < palletLineSprites.length; i++) {
        const palletLineSprite = palletLineSprites[i];
        const vArray = palletLineSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          palletLine = palletLineSprite.extra;
          break;
        }
      }
    }

    if (markSprites.length) {
      for (let i = 0; i < markSprites.length; i++) {
        const markSprite = markSprites[i];
        const vArray = markSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          mark = markSprite.extra;
          break;
        }
      }
    }

    const clickData = {
      point,
      node,
      pod,
      devices,
      edge,
      forbid,
      area,
      palletLine,
      mark,
    };

    this.eventBus.emit(MapEvent.CLICK, clickData);
  }

  relocateMouseDownHandler(x, y) {
    if (!this.#drawFlag) {
      this.#startPoint[0] = x;
      this.#startPoint[1] = y;
      this.eventBus.emit(MapEvent.START_RELOCATE, {
        x,
        y,
      });
    } else {
      if (!this.#suspendFlag) {
        this.eventBus.emit(MapEvent.CONFIRM_RELOCATE, {
          mode: SelectMode.RELOCATE,
          px: this.mapPx * Resolution,
          py: -this.mapPy * Resolution,
          angle: this.angle,
        });
      }
    }
  }
  relocateMouseMoveHandler(e) {
    if (this.#suspendFlag) {
      return;
    }
    let currTime = performance.now();
    const gap = currTime - this.time;
    if (gap < 50) return;
    const x = e.offsetX;
    const y = e.offsetY;
    this.#endPoint[0] = x;
    this.#endPoint[1] = y;
    if (this.#startPoint.length) {
      this.mapManager.removeDrawerLayer();
      this.mapManager.addDrawPoint(this.#startPoint[0], this.#startPoint[1]);
      const { angle, mapPx, mapPy } = this.mapManager.addAngleLine(
        this.#startPoint,
        this.#endPoint
      );
      this.angle = angle;
      this.mapPx = mapPx;
      this.mapPy = mapPy;
      this.mapManager.renderMap();
      this.#drawFlag = true;
      this.time = performance.now();
    }
  }

  handleAttachClick(nodeSprites, point) {
    let node;
    if (!this.#drawFlag) {
      for (let i = 0; i < nodeSprites.length; i++) {
        const nodeSprite = nodeSprites[i];
        const vArray = nodeSprite.vertexData;
        const polygonPointArray = chunk(vArray, 2).map((item) => {
          return {
            x: Math.ceil(item[0]),
            y: Math.ceil(item[1]),
          };
        });
        const flag = isPointInPolygon(point, polygonPointArray);
        if (flag) {
          node = nodeSprite.extra;
          break;
        }
      }

      this.attachNode = node;
      this.eventBus.emit(MapEvent.START_ATTACH, node);
      if (node) {
        this.#drawFlag = true;
      }
    } else {
      if (!this.#suspendFlag) {
        this.eventBus.emit(MapEvent.CONFIRM_ATTACH, {
          mode: SelectMode.ATTACH,
          px: this.attachNode.px,
          py: this.attachNode.py,
          pz: this.attachNode.pz,
          mapID: this.attachNode.mapID,
          subMapID: this.attachNode.subMapID,
          angle: this.angle,
        });
      }
    }
  }

  attachMouseMoveHandler(e) {
    if (this.#suspendFlag) {
      return;
    }
    let currTime = performance.now();
    const gap = currTime - this.time;
    if (gap < 50) return;
    const x = e.offsetX;
    const y = e.offsetY;
    this.#endPoint[0] = x;
    this.#endPoint[1] = y;
    if (this.attachNode) {
      this.mapManager.removeDrawerLayer();
      this.mapManager.addAttachPoint(this.attachNode);
      const { angle, mapPx, mapPy } = this.mapManager.addAngleLine(
        [this.attachNode.rx / Resolution, this.attachNode.ry / Resolution],
        this.#endPoint,
        false,
        true
      );
      this.angle = angle;
      this.mapPx = mapPx;
      this.mapPy = mapPy;
      this.mapManager.renderMap();
      this.#drawFlag = true;
      this.time = performance.now();
    }
  }
}
