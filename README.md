<!-- {{Top}} -->
# UserWrappr
[![Build Status](https://travis-ci.org/FullScreenShenanigans/UserWrappr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/UserWrappr)
[![NPM version](https://badge.fury.io/js/userwrappr.svg)](http://badge.fury.io/js/userwrappr)

Creates configurable HTML displays over fixed size contents.
<!-- {{/Top}} -->

UserWrappr adds two things on top of HTML contents:

1. Sizing of the game area within the available window space
2. Delayed creation of game menus from readable schemas

## Usage

```typescript
const userWrapper = new UserWrapper({
    container: document.querySelector("#app"),
    createContents: (size: IAbsoluteSizeSchema): void => {
        const game = new MyGame(size);
        return game.canvas;
    }
})
```

### Required Parameters

#### `container`

Containing HTML element to create the contents within.

#### `createContents`

Callback that creates the contents.
Takes in a `size` object with `height` and `width` as numbers of pixels, and returns HTML contents of that size.

## Details

UserWrappr prioritizes creating the contents as soon as possible.
When you call `createDisplay`, the following happen in order:

1. View libraries (MobX+React) _start_ to load.
2. The usable area's size is calculated.
3. Contents are created in the usable area.
4. Once view libraries are loaded, menus for them are created in the usable area.

### Sizing Strategy

The container with your content and menus will fill as per its provided size schema, relative to the visible browser window.
Creation of the display area follows this strategy:

1. The visible window size is measured.
2. The container size is calculated from the window size and provided size schema.
3. Basic menu controls are created within the container.
4. The remaining container size is calculated, and contents created within.

Later, a full menu will be created and bound to the menu controls.

<!-- {{Development}} -->
## Development

See [Documentation/Development](https://github.com/FullScreenShenanigans/Documentation).


<!-- {{/Development}} -->
