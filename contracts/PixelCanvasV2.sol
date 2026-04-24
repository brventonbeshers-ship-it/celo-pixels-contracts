// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PixelCanvasV2 {
    uint256 public constant CANVAS_WIDTH = 100;
    uint256 public constant CANVAS_HEIGHT = 100;
    uint256 public constant PIXEL_COST = 0.001 ether;

    address public owner;
    uint256 public totalPixelsPlaced;
    bool public canvasFrozen;

    struct Pixel {
        address painter;
        uint8 r;
        uint8 g;
        uint8 b;
        uint256 timestamp;
    }

    mapping(uint256 => mapping(uint256 => Pixel)) public canvas;
    mapping(address => uint256) public userPixelCount;

    event PixelPlaced(address indexed painter, uint256 x, uint256 y, uint8 r, uint8 g, uint8 b);
    event CanvasFrozen(bool frozen);

    modifier onlyOwner() { require(msg.sender == owner, "Not authorized"); _; }
    modifier whenNotFrozen() { require(!canvasFrozen, "Canvas is frozen"); _; }

    constructor() { owner = msg.sender; }

    function placePixel(uint256 x, uint256 y, uint8 r, uint8 g, uint8 b) external whenNotFrozen {
        require(x < CANVAS_WIDTH && y < CANVAS_HEIGHT, "Out of bounds");
        canvas[x][y] = Pixel(msg.sender, r, g, b, block.timestamp);
        userPixelCount[msg.sender]++;
        totalPixelsPlaced++;
        emit PixelPlaced(msg.sender, x, y, r, g, b);
    }

    function getPixel(uint256 x, uint256 y) external view returns (address painter, uint8 r, uint8 g, uint8 b, uint256 timestamp) {
        Pixel memory p = canvas[x][y];
        return (p.painter, p.r, p.g, p.b, p.timestamp);
    }

    function getUserPixelCount(address user) external view returns (uint256) { return userPixelCount[user]; }
    function setCanvasFrozen(bool _frozen) external onlyOwner { canvasFrozen = _frozen; emit CanvasFrozen(_frozen); }
}
