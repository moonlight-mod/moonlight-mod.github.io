---
title: Contributing to mappings
description: How to register your own mappings and contribute upstream
sidebar:
  order: 4
---

[The mappings repository](https://github.com/moonlight-mod/mappings) contains a collection of known Webpack modules with human-readable names. It finds Webpack modules and creates an alias to them, as well as remapping exports.

## Remapping in your own extension

In `index.ts` (not in a Webpack module), you can register extra exports on an existing module using the [moonmap](https://github.com/moonlight-mod/moonmap) global:

```ts
moonlight.moonmap.addExport("discord/components/common/index", "AIconButRenamed", {
  type: ModuleExportType.Constant,
  find: "AIcon"
});
```

If you're registering your own module, you'll need to find the Webpack module ID. You can do this in a Webpack module using [Spacepack](/ext-dev/api#spacepack):

```ts
moonlight.moonmap.addModule(spacepack.findByCode(/* ... */)[0].id, "discord/my/custom/module");
```

## Contributing upstream

Create a file in `src/mappings` with the path equal to the module name. Then, use the `register` function from `src/registry.ts` to load it:

```ts
register((moonmap) => {
  const name = "discord/my/custom/module";
  moonmap.register({
    name,
    find: /* ... */,
    process({ id }) {
      moonmap.addModule(id, name);

      // Custom exports, if you wish

      return true;
    }
  });
});
```

If you're creating a type for the module (you should!), export a type named `Exports` as the default export. The name is required!

```ts
type Exports = {
  /* ... */
};
export default Exports;
```

When adding new types to a mapping:

- Add its path and a name to `generate.js`
  - Name should be the last part of the path except in cases where it breaks syntax (e.g. `highlight.js` -> `HighlightJS`)
  - Mappings for CSS class names should replace `.css` with `CSS`
- `node generate.js types --write` to generate the new type index
- Format with Prettier
- `node generate.js declares "@moonlight-mod/wp/" > ../moonlight/packages/types/src/mappings.d.ts` to update import statements in moonlight
  - You don't have to do this unless you're a moonlight core developer

## Finding names

Names in the mappings repo are a combination of:

- Guessing
- Strings in the relevant module (e.g. a Flux store name)
- Code identified from a third party library (e.g. React internal names)
- Strings in the mobile app
  - Use [hermes-dec](https://github.com/P1sec/hermes-dec) on `assets/index.android.bundle`. You can download the mobile app [using this tool](https://switchboard.marsh.zone/).

If you're stuck figuring out what something is, feel free to ask! Community members may be able to help make an educated guess.

## Embedding into other client mods

After setting up moonmap and LunAST, call the load function before Webpack initializes:

```ts
import loadMappings from "@moonlight-mod/mappings";
loadMappings(moonmap, lunast);
```
