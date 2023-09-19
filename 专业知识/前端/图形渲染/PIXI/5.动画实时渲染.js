import RenderManager from "../render";
import Float from "../utils/float";
import { DeviceType, DisplayMode } from "@/constants/enums";
import { Resolution } from "@/constants/settings";
import { drawDevice } from "../render/devices/init";

const DIR = {
  move: 0, // 移动
  rotate: 1, // 旋转
};

// 按浏览器更新频率, 每一个节点之间大概要补60个点,这里我们取30
// 固定动画范围可以在30 - 60帧, 都不影响流畅性, 后面可以考虑优化成动态帧, 动态帧估计会卡顿现象
const FPS = 30;

class Ticker {
  constructor(mapContext) {
    this.mapContext = mapContext;
  }

  get currMapMode() {
    return this.mapContext.dataManager.displayMode;
  }

  get currMapFloor() {
    return this.mapContext.dataManager.displayRegion.floor;
  }

  get currMapSubMapIDs() {
    return this.mapContext.dataManager.displayRegion.subMapIDs;
  }

  /**
   * 每一帧动画
   * @param {需要更新的运动设备} device
   * @param {deviceLayer} deviceLayer
   */
  tick(device, deviceLayer) {
    // 小车当前位置
    let {
      px,
      py,
      rotation,
      id,
      mapID,
      subMapID,
      active,
      deviceType,
      showType,
      floor,
    } = device;
    const currFrame = device.frameQueue[0];
    const nextFrame = device.frameQueue[1];

    if (this.currMapMode === DisplayMode.WAREHOUSE) {
      // 整仓下小车换层场景
      if (currFrame.subMapID !== nextFrame.subMapID) {
        device.frameQueue.shift();
        device.subMapID = nextFrame.subMapID;
        device.mapID = nextFrame.mapID;
        device.floor = nextFrame.floor;
        return;
      }
    } else {
      // 分层下小车换层场景
      const toFloor = nextFrame.floor;
      const fromFloor = currFrame.floor;

      const otherToOther =
        fromFloor !== this.currMapFloor && toFloor !== this.currMapFloor;
      const otherToCurr =
        fromFloor !== this.currMapFloor && toFloor === this.currMapFloor;
      const currToOther =
        fromFloor === this.currMapFloor && toFloor !== this.currMapFloor;
      // const currToCurr = fromFloor === this.currMapFloor && toFloor === this.currMapFloor;

      if (currToOther) {
        // console.log('currToOther', device.id, nextFrame, currFrame);
        // remove sprite & remove frameQueue & update data
        const idx = this.getSpriteIndex(deviceLayer, id);
        if (idx !== -1) {
          this.removeRobotSprite(deviceLayer, idx);
          // console.log('rrrr', this.mapContext);
          this.mapContext.renderMap();
        }
        device.subMapID = nextFrame.subMapID;
        device.mapID = nextFrame.mapID;
        device.floor = nextFrame.floor;
        device.px = nextFrame.px;
        device.py = nextFrame.py;
        device.frameQueue.shift();
        return;
      } else if (otherToOther) {
        // console.log('otherToOther', device.id, nextFrame, currFrame);
        // remove frameQueue & update data
        device.subMapID = nextFrame.subMapID;
        device.mapID = nextFrame.mapID;
        device.floor = nextFrame.floor;
        device.px = nextFrame.px;
        device.py = nextFrame.py;
        device.frameQueue.shift();
        return;
      } else if (otherToCurr) {
        console.log("otherToCurr", device.id, nextFrame, currFrame);
        device.subMapID = nextFrame.subMapID;
        device.mapID = nextFrame.mapID;
        device.floor = nextFrame.floor;
        device.px = nextFrame.px;
        device.py = nextFrame.py;
        device.frameQueue.shift();

        if (this.currMapSubMapIDs.includes(nextFrame.subMapID)) {
          this.addRobotToMap(device, deviceLayer, this.mapContext);
          this.mapContext.renderMap();
          return;
        }
        return;
      }
    }

    const robotSprit = this.getRobotSprite(deviceLayer, id);
    if (!robotSprit) return;

    // 本次需要移动的路程和轴向
    const distanceX = nextFrame.px - currFrame.px;
    const distanceY = nextFrame.py - currFrame.py;
    const distanceR = nextFrame.rotation - currFrame.rotation;
    const currDir = this.getCurrDirect(distanceX, distanceY);
    // 当前这一帧移动后要到达的目的点
    let currTargetPostion;
    let currTargetRotation;

    // x轴移动
    if (currDir === DIR.move) {
      currTargetPostion = this.getTargetPosition(
        px,
        distanceX,
        py,
        distanceY,
        FPS
      );
      const { x, y } = this.getCurrframeMoved(currFrame, currTargetPostion);
      if (this.isNotArrived(distanceX, x, distanceY, y)) {
        device.px = currTargetPostion.offsetX;
        device.py = currTargetPostion.offsetY;
      } else {
        device.px = nextFrame.px;
        device.py = nextFrame.py;
        device.frameQueue.shift();
      }
      // 旋转动画
    } else if (currDir === DIR.rotate) {
      if (deviceType === DeviceType.PS || deviceType === DeviceType.EV) {
        device.rotation = nextFrame.rotation;
        device.frameQueue.shift();
      } else {
        currTargetRotation = this.getTargetR(rotation, distanceR, FPS);
        let currRotatedR = this.getCurrFrameRotated(
          currFrame.rotation,
          currTargetRotation
        );
        if (this.isNotArrivedR(distanceR, currRotatedR)) {
          device.rotation = currTargetRotation;
        } else {
          device.rotation = nextFrame.rotation;
          device.frameQueue.shift();
        }
      }
    }

    const mapConf = this.mapContext.dataManager.getMapConf().get(mapID);
    if (!mapConf) {
      return;
    }
    const subMapConf = mapConf.subConf.get(subMapID);
    if (!subMapConf) {
      return;
    }

    // 每一次ticker完成后 绘制一次
    let rx = mapConf.offsetX + subMapConf.subOffsetX + device.px;
    let ry = mapConf.offsetY + subMapConf.subOffsetY + device.py;

    let [vx, vy] = [rx / Resolution, ry / Resolution];

    robotSprit.position.set(vx, -vy);
    robotSprit.rotation = device.rotation;
    robotSprit.extra = {
      ...robotSprit.extra,
      px: device.px,
      py: device.py,
      rx: vx,
      ry: -vy,
    };

    // 移动中的高亮设备
    if (active) {
      RenderManager.renderActiveDevice(
        robotSprit,
        this.mapContext.maskLayer,
        id,
        deviceType,
        showType,
        vx,
        vy,
        null,
        {},
        this.mapContext.textures,
        floor
      );
    }
  }

  getTargetPosition(currX, dx, currY, dy, dt) {
    const offsetX = Float.Add(currX, Float.Div(dx, dt));
    const offsetY = Float.Add(currY, Float.Div(dy, dt));
    return {
      offsetX,
      offsetY,
    };
  }

  getTargetR(currR, dr, dt) {
    return Float.Add(currR, Float.Div(dr, dt));
  }

  getCurrDirect(dx, dy) {
    const xAxis = Math.abs(dx) !== 0;
    const yAxis = Math.abs(dy) !== 0;

    if (xAxis || yAxis) {
      return DIR.move;
    } else {
      return DIR.rotate;
    }
  }

  // 当前帧走过的距离
  getCurrframeMoved(frameStartPos, nowPos) {
    const { px, py } = frameStartPos;
    const { offsetX, offsetY } = nowPos;
    return {
      x: Math.abs(Float.Sub(px, offsetX)),
      y: Math.abs(Float.Sub(py, offsetY)),
    };
  }

  // 当前帧旋转过的角度
  getCurrFrameRotated(frameStartRotation, nowRotation) {
    return Math.abs(Float.Sub(nowRotation, frameStartRotation));
  }

  isNotArrived(totalX, movedX, totalY, movedY) {
    return Math.abs(totalX) > movedX || Math.abs(totalY) > movedY;
  }

  isNotArrivedR(totalR, movedR) {
    return Math.abs(totalR) > movedR;
  }

  getRobotSprite(deviceLayer, id) {
    let robotSprit;
    for (let i = 0; i < deviceLayer.children.length; i++) {
      const element = deviceLayer.children[i];
      const { extra } = element;
      if (extra.id === id) {
        robotSprit = element;
        break;
      }
    }
    return robotSprit;
  }

  getSpriteIndex(deviceLayer, id) {
    let idx = -1;
    for (let i = 0; i < deviceLayer.children.length; i++) {
      const element = deviceLayer.children[i];
      const { extra } = element;
      if (extra.id === id) {
        idx = i;
        break;
      }
    }
    return idx;
  }

  removeRobotSprite(deviceLayer, index) {
    let rmChild = deviceLayer.removeChildAt(index);
    console.log("rm robot", rmChild);
    rmChild.destroy({
      children: true,
      texture: false,
      baseTexture: false,
    });

    if (this.mapContext.maskLayer.children.length) {
      let rmChilds = this.mapContext.maskLayer.removeChildren();
      rmChilds.forEach((sprite) => {
        sprite.destroy();
      });
    }
  }

  addRobotToMap(device, deviceLayer, mapContext) {
    console.log("add device:", device, deviceLayer, mapContext);
    drawDevice(
      deviceLayer,
      device,
      mapContext.dataManager.mapConf,
      mapContext.textures,
      mapContext.maskLayer
    );
  }
}

export default Ticker;

// 渲染
function autoRender() {
  if (!this.dataManager.isWarehouseMode) {
    if (!this.dataManager.displayRegion.mapID) return;
  }

  if (this.rafID) window.cancelAnimationFrame(this.rafID);
  if (!this.autoMode) return;
  this.rafID = window.requestAnimationFrame(() => this.processTick());
}

function processTick() {
  if (!this) return;

  this.renderMap();
  if (this.showFPS) fps.frame();

  const devicesMap = this.dataManager.getDevices();
  devicesMap.forEach((device) => {
    if (device && device.frameQueue && device.frameQueue.length > 1) {
      this.ticker.tick(device, this.deviceLayer);
    }
    if (device && device.showType === FE_DEVICE.EV) {
      this.updateEvFloor(device, this.deviceLayer);
    }
  });

  this.autoRender();
}

function renderMap() {
  if (!this.getEngine()) {
    console.warn("map engine is not ready!");
    return;
  }

  this.getEngine().render(this.rootLayer);

  if (!this.ticker) {
    this.ticker = new Ticker(this);
  }
}
