---
title: Project structure
sidebar:
  order: 2
---

moonlight's project structure can be overwhelming to learn for new contributors. This document will go over how each component of moonlight interacts with one another.

## Package manager

moonlight is split into a [pnpm workspace](https://pnpm.io/workspaces), with multiple packages inside of it. The minimum version required is pnpm 10.

Each package contains a `package.json` and a `tsconfig.json`. Most packages will simply reference the `tsconfig.json` at the root of the project, but packages like [`types`](#types) need their own independent copy.

## Build system

moonlight uses [esbuild](https://esbuild.github.io) as its build system. The build script (`build.mjs`) is a single file which handles building [each stage](#load-stages) of moonlight, as well as each [core extension](#core-extensions).

This build script is separate to [our esbuild-config repository](https://github.com/moonlight-mod/esbuild-config), which is used by third-party developers in their own extensions. A future goal is to use the esbuild-config repository in moonlight itself ([see open issue](https://github.com/moonlight-mod/moonlight/issues/222)). Even though they do not share code, the implementation is similar, so flaws like [needing dev server restarts](/ext-dev/pitfalls#restarting-dev-mode-is-required-in-some-scenarios) apply to moonlight itself as well.

esbuild's plugin API is very simple, and as such, moonlight's build script contains [a lot of hacks to get desired behavior](https://github.com/moonlight-mod/moonlight/blob/c01adbed21f7d7963f1ccb3038c8550fcd6343f0/build.mjs#L170-L175). In the future, moonlight and the [extension template](https://github.com/moonlight-mod/create-extension) may switch to another build system, but there are no plans to switch from esbuild at this time.

## Core

moonlight uses a lot of shared code across the project. Each [load stage](#load-stages) is usually a single file, while most of the implementation resides inside of the core package. This allows us to share APIs and reuse code across every environment.

moonlight makes heavy use of esbuild's [drop labels](https://esbuild.github.io/api/#drop-labels) feature. By wrapping certain code in [one of the defined drop labels](https://github.com/moonlight-mod/moonlight/blob/c01adbed21f7d7963f1ccb3038c8550fcd6343f0/build.mjs#L84-L92), it will not be included in the other environments. This allows a function to have a different implementation depending on the environment it is called in, which is helpful when using APIs only available natively (like filesystem access).

moonlight also relies on esbuild's [tree shaking](https://esbuild.github.io/api/#tree-shaking) feature. The core code is bundled separately for each environment, meaning that it is duplicated in each output file. If tree shaking did not exist, the entire core package would be bundled three times, which wastes a lot of space. Because of this, be mindful of what you import when working with the core package, and consider separating code out into different files if required.

[Core extensions](#core-extensions) also have access to the core package, but be careful when you use it, especially when importing functions and classes. Functions from the core package are usually wrapped in the moonlight globals (e.g. `moonlight.getLogger`), which lets you call them without bundling the entire implementation into your extension. If you were to import the `Logger` class directly, you would duplicate the implementation into your extension's build output, even if it's already implemented in moonlight itself.

## Types

The types package is different than the other packages in moonlight, because it is designed for public use in extensions. Because it is published to npm, it cannot share any configuration from the rest of the workspace, so it uses a standalone `tsconfig.json`.

The types package does not contain any runtime code, and so there is no build step, because there is no JavaScript to emit. However, enums imported from the types package will be duplicated into the build output of extensions that use them, because [enums are transformed into objects at compile time](https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime).

The types package contains many things:

- Types for moonlight's core, including extension manifests and extension exports
- Types for all core extensions
- Types for Webpack internals
- A custom Webpack require type and [module declarations](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)
- Global variables and constants added by moonlight

To enable type safety for importing core extensions, the types package has [a Webpack require type](https://github.com/moonlight-mod/moonlight/blob/c01adbed21f7d7963f1ccb3038c8550fcd6343f0/packages/types/src/discord/require.ts) and [module declarations](https://github.com/moonlight-mod/moonlight/blob/c01adbed21f7d7963f1ccb3038c8550fcd6343f0/packages/types/src/globals.ts) that specify each core extension module. There is also a similar system for [the mappings repository](https://github.com/moonlight-mod/moonlight/blob/c01adbed21f7d7963f1ccb3038c8550fcd6343f0/packages/types/src/mappings.d.ts), which is automatically generated by a script. These custom types allow you to import or require a Webpack module and still have types for them, playing a key role in making TypeScript with moonlight feasible.

The types package is published alongside moonlight releases, but some moonlight releases do not modify the types package, so it may be skipped. The types package can be updated for many reasons, usually updating the core extensions or mappings version, and so breaking changes happen often. Even though breaking changes to Discord internals are unavoidable with client updates, avoid making breaking changes to moonlight's own types, or moving them around in a way that could break existing imports of them.

## Core extensions

Core extensions are extensions built into moonlight. They cannot be uninstalled, but they can be disabled. A few core extensions are enabled by default when the config is created for the first time. An extension is a good fit for a core extension if it's a library or development tool, but actual features or tweaks should usually be distributed on a extension repository instead. This isn't a hard rule, though, so feel free to ask if you're considering making a core extension!

The biggest core extension is [Moonbase](https://github.com/moonlight-mod/moonlight/tree/main/packages/core-extensions/src/moonbase), which is responsible for installing and updating extensions, updating moonlight itself, and providing a UI to manage everything. Unlike other client mods, Moonbase is just implemented as another extension, and can be disabled if the user wants. The core does not contain any functionality for installing/updating extensions or updating moonlight, and it is instead implemented inside of Moonbase.

## Load stages

moonlight's loading process is split across several "stages" in order to execute code on the web environment. These stages are the same environments that [extensions can run in](/ext-dev/cookbook#extension-entrypoints). Other client mods usually load in a similar fashion, but moonlight takes advantage of this process, letting extensions load every step of the way.

These stages are split into three files, one for each environment. Each stage will set up moonlight, send data between other stages, and load the next stage. As mentioned in the link in the previous paragraph, these match to Electron's process model, but we give them our own names due to legacy reasons.

moonlight's core is asynchronous. This unlocks a lot of potential for how the core APIs can be designed, but it also means that various tricks are required to make Discord load asynchronously, and it may cause issues when trying to load moonlight alongside another client mod.

### Injector

A patched Discord client will replace the entrypoint script with its own, which simply loads the injector and calls the `inject` function. Because the entrypoint is replaced, the injector must manually load the original entrypoint to start the client. For integration into other client mods, the `inject` function can be passed an optional configuration object, which lets you disable some patches the injector makes.

An important note about the injector is that it runs in the Electron main process. This means that it has full access to Node.js APIs, but it is also only called once per client start. While the later stages will be reran when the page is refreshed, a full client restart is required for any changes to the host environment. Keep this in mind when working on changes to the injector.

The order of function calls in the injector is carefully maintained, taking care that everything is available when it's required. The first thing the injector will do is create the `moonlightNodeSandboxed` global variable, which provides the filesystem abstractions required for loading extensions and the config file. Without this, the client would crash attempting to read the config file, as it expects the filesystem abstraction to be initialized very early.

After the config is loaded, the logger is initialized to match the config's logger level, and then the extensions are loaded. moonlight splits extension loading into separate phases:

- `getExtensions` scans for all extensions present in the filesystem
- `loadExtensions` "processes" the extensions, checking compatability and dependency resolution
- `loadProcessedExtensions` actually executes the code of the extensions

The extension loading system is designed this way so that it can be partially completed before the global object is created, and so that each stage returns its results directly. While this could have been designed as one giant "scan and load all extensions" function, composing each call together into individual steps makes it clear how the loading process works, and makes it easier to share across all environments.

After the extensions are processed, the `moonlightHost` global is created. All environments have a unique global object that exposes some common functions (e.g. interacting with the config) and misc information (e.g. the loaded extensions, the moonlight version). These globals must exist by the time the extensions are executed.

The extensions with a host environment are loaded at this stage, using an event system to wait for their dependencies to be available. The injector also patches Discord's update mechanism to persist moonlight across updates, and patches Electron to inject custom code when the window is created. When Discord's original entrypoint is executed from the injector, it will use our patched browser window, letting us control Discord even after the `inject` function returns.

The patched browser window will set the preload script to point to [node-preload](#node-preload), allowing us to advance into the second stage. It will also subscribe to some Electron network events, patching headers and blocking requests when needed, but also re-emitting requests through the `moonlightHost` global. There can only be one subscriber to these Electron APIs at a time, so re-emitting requests is crucial for letting multiple extensions listen at once.

### Node preload

The injector saved the location of the original preload script and replaced it with ours. Instead of loading immediately, the preload script will wait for an event through [Electron's IPC system](https://www.electronjs.org/docs/latest/tutorial/ipc). This is a part of the system to make moonlight loading truly asynchronous, and it is very unique compared to other client mods.

Back in the injector, it is blocking network requests to Discord's JavaScript files, preventing them from loading. When all of the scripts are blocked, it then loads the preload script. This avoids a race condition where Discord starts up faster than moonlight can. Like how the injector only loads Discord after moonlight is done, the web requests are blocked to make Discord's initial load fail, and then the web scripts are manually loaded after the preload script is done executing.

The preload script follows a very similar pattern to the injector, but it loads the Node environment of each extension. Note how it reads the config and scans the extensions a second time - this is because the injector only runs once, but this runs on every page refresh, so it makes sure the data is always up to date (e.g. when you update the config or install a new extension).

An interesting detail about the Node environment is that its global is exposed into the web environment. The Node environment does filesystem operations like loading extensions or writing config files, wrapped so that the web environment can access it. It is very important to be careful about what passes through the global, especially filesystem access. The `moonlightNodeSandboxed` global is not bridged to the web environment, because the web environment having full filesystem access is a major security issue.

After loading the extensions, the preload script will activate the loaded extensions' custom network rules (like CORS bypasses or blocking certain URLs). Because the preload script cannot access the Electron network APIs, it sends it back to the injector where the event subscription is still active.

Before finally executing the original preload script and replaying the web scripts, it will also load [web-preload](#web-preload) inside of the web environment. Remember that web-preload is executing *during* node-preload, as compared to node-preload executing after the injector.

### Web preload

The web preload script isn't actually a preload script of its own, just the web portion of the preload section. (Yes, it's a confusing name.)

After it loads, instead of loading automatically, it will create a `window._moonlightWebLoad` function that can be invoked manually. It is designed this way to have better [browser support](#browser).

After the load function is called, it will delete the global function so it can't loaded twice, and then begin loading much like the other two stages. The `moonlight` global contains re-exports of functions in `moonlightNode` for ease of use, as well as some new values for patching.

At this point, the script will initialize [LunAST, moonmap, and mappings](#other-dependencies). These libraries are all bundled into the web preload script, making it the largest entrypoint in the load process. Because the mappings package is bundled into this environment, a moonlight update is required when the mappings get updated.

Since the web environment does not have filesystem access, it cannot read the config file or scan for extensions on its own. It instead reads from `moonlightNode`, and uses the Node environment's processed extensions data to skip to the execution phase of loading extensions. The exports of these extensions contain various things that must be registered (patches, Webpack modules, custom styles).

Finally, it installs the Webpack patcher, and loads all of the registered styles. The Webpack patcher is the most important part of moonlight, allowing for extensions to patch code and inject custom modules. The patcher creates the Webpack chunk global before Discord's source code can define it, allowing it to intercept when Webpack chunks are loaded. When a chunk is loaded, several things happen:

- The `ChunkLoad` event is dispatched through the `moonlight` global.
- Each patch is ran against the modules in the chunk, and if it matches, the module's function is patched and replaced.
- Pending Webpack modules check for when all of their dependencies are loaded. When ready, they are injected into the chunk.
- Modules are passed through the processors registered in moonmap. When a module is matched, a remapped module is injected into the chunk, proxying the original module with a constant name.
- Modules are passed through the processors registered in LunAST. When a module is matched, the module is patched by turning the AST into a function string.

Note that the patcher is registered immediately, but it only begins patching modules when Discord's code actually runs. After the load function returns, node-preload will rerun Discord's code, and then the now initialized patcher will begin patching modules.

At this point, every part of Discord has started loading, with moonlight having loaded right before it. Assuming nothing is broken, modules will be patched and injected as new chunks come in. Even though all of the stages have now finished executing, they're still working in the background, patching network requests and Webpack modules.

## Browser

The browser extension blocks requests similarly to how the desktop client does, but using the web request APIs inside of background scripts instead. It supports both Manifest V2 and Manifest V3, taking advantage of declarative network requsts for Manifest V3.

Because of various limitations, the browser extension does not support developing extensions or custom extension repositories. It does support the official repository, though, using [ZenFS](https://github.com/zen-fs/core) as a virtual filesystem and having an explicit CORS bypass in the extension manifest.

The browser entrypoint imports web-preload at the start of the file, so the `window._moonlightWebLoad` function is defined. It then defines a `window._moonlightBrowserInit` function, which the background scripts will call when they are done blocking the scripts.

The browser extension only has support for the web environment, but it must mimic the behavior of passing data from the Node environment. To solve this, the browser entrypoint effectively pretends to be node-preload, creating a virtual filesystem and adding it to the `moonlightNodeSandboxed` global. To mimic how `moonlightNode` is forwarded into the web environment, it makes a mock `moonlightNode` and puts the processed extensions into it.

The [build system](#build-system) bundles the core extensions into a JSON object, and defines a global variable containing that JSON object as a string. This JSON object is treated like a filesystem, where the key is the path and the value is the contents of the file. After registering the core extensions from this object, it loads the user installed extensions from the virtual filesystem.

Because there is no Node environment, no extensions are actually loaded into the `moonlightNode` global. It simply exists as a small wrapper around the filesystem. Extensions that use the Node environment must either handle this case where the natives are not loaded, or specify that they are not compatible with the browser extension in the manifest.

After processing the extensions, it calls the `window._moonlightWebLoad` function, starting web-preload and loading the extensions and Webpack patcher. After the function returns, the background script reloads the scripts like the desktop client does, and the client starts like normal.

## Other dependencies

moonlight uses some other packages that are not in the workspace, like [LunAST](https://github.com/moonlight-mod/lunast), [moonmap](https://github.com/moonlight-mod/moonmap), and [mappings](https://github.com/moonlight-mod/mappings). These packages do *not* use esbuild, and instead use [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html), because they do not need any special config and are published on npm.

Sometimes, you may need to modify one of these libraries, and test them in a local copy of moonlight. This is a known pain point of working with moonlight, and there are several ways to accomplish this:

- Use [pnpm link](https://pnpm.io/cli/link) or [the link script](/dev/helper-scripts#linkjs). Several developers have reported weird desyncs after linking packages, so exercise caution when using these.
- Edit the `package.json` of the desired package(s) to use the `file:` protocol.

Remember to undo your changes when you're done linking the other library, and make sure that `pnpm-lock.yaml` hasn't been changed by your testing.
