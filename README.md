<!-- {{Top}} -->
# UserWrappr
[![Build Status](https://travis-ci.org/FullScreenShenanigans/UserWrappr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/UserWrappr)
[![NPM version](https://badge.fury.io/js/userwrappr.svg)](http://badge.fury.io/js/userwrappr)

Creates configurable HTML displays over fixed size contents.
<!-- {{/Top}} -->

## Usage

```typescript
(code samples and such)
```

### Menu Initializer

External libraries including MobX and React are delay-loaded to preserve optimal performance.
UserWrappr scripts that depend on them are therefore also delay-loaded.
`menuInitializer` specifies the RequireJS path to load those scripts.

### Menu Schemas

...

## Details

UserWrappr prioritizes creating the contents as soon as possible.
When you call `createDisplay`, the following happen in order:

1. View libraries (MobX+React) _start_ to load.
2. The usable area's size is calculated.
3. Contents are created in the usable area.
4. Once view libraries are loaded, menus for them are created in the usable area.

### `Display`

#### Sizing Strategy

A Display will fill your content and menu to its provided size schema, relative to the visible browser window.
Creation of the display area follows this strategy:

1. The visible window size is measured.
2. The container size is calculated from the window size and provided size schema.
3. Basic menu controls is created within the container.
4. The remaining container size is calculated, and contents created within.

Later, a full menu will be created and bound to the menu controls.

<!-- {{Development}} -->
## Development

See [Documentation/Development](https://github.com/FullScreenShenanigans/Documentation).


<!-- {{/Development}} -->
