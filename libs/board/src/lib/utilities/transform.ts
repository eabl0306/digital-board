import { Container, PointData } from "pixi.js";

export function getGlobalRotation(element: Container): number {
  if (element.parent) {
    return element.rotation + getGlobalRotation(element.parent);
  }

  return element.rotation;
}

export function calculateRotatePosition(parent: PointData, child: PointData, rotate: number): PointData {
    const distanceX = child.x - parent.x;
    const distanceY = child.y - parent.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const angle = Math.atan2(distanceY, distanceX) + rotate;

    return {
        x: parent.x + distance * Math.cos(angle),
        y: parent.y + distance * Math.sin(angle),
    }
}