const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PixelCanvasV2", function () {
  let canvas, owner, painter;

  beforeEach(async function () {
    [owner, painter] = await ethers.getSigners();
    const PixelCanvasV2 = await ethers.getContractFactory("PixelCanvasV2");
    canvas = await PixelCanvasV2.deploy();
  });

  it("should start with zero pixels placed", async function () {
    expect(await canvas.totalPixelsPlaced()).to.equal(0);
  });

  it("should allow placing a pixel", async function () {
    await canvas.connect(painter).placePixel(10, 20, 255, 0, 128);
    expect(await canvas.totalPixelsPlaced()).to.equal(1);
  });

  it("should store pixel data correctly", async function () {
    await canvas.connect(painter).placePixel(5, 5, 100, 200, 50);
    const p = await canvas.getPixel(5, 5);
    expect(p.r).to.equal(100);
    expect(p.g).to.equal(200);
    expect(p.b).to.equal(50);
    expect(p.painter).to.equal(painter.address);
  });

  it("should reject out of bounds", async function () {
    await expect(canvas.placePixel(100, 0, 0, 0, 0)).to.be.revertedWith("Out of bounds");
  });

  it("should track user pixel count", async function () {
    await canvas.connect(painter).placePixel(1, 1, 0, 0, 0);
    await canvas.connect(painter).placePixel(2, 2, 0, 0, 0);
    expect(await canvas.getUserPixelCount(painter.address)).to.equal(2);
  });

  it("should allow owner to freeze canvas", async function () {
    await canvas.setCanvasFrozen(true);
    await expect(canvas.connect(painter).placePixel(0, 0, 0, 0, 0)).to.be.revertedWith("Canvas is frozen");
  });
});
