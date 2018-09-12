# New data presentation for Kancolle Phase 2

Note: all of above are not yet implemented.

## Plugin directory

- `p-state.json`: persistent state of this plugin.
- `goal-table-<admiral id>.json`: could be many of them,
  and each one represents a different player
- `exp-records-<admiral id>.json`: exp gain for the "dynamic" mode.

## Data structures

### `GoalTable` structure

- an Object whose keys are roster ids and values `Goal`s

### `Goal` structure

- an Object of the following shape:

    ```
    {
      rosterId: <number>,
      goalLevel: <number>,
      method: <Method>,
    }
    ```

### `Method` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `dynamic`, it represents a dynamic leveling method,
  which means it'll be computed based on exp gain of the ship.
  no other property is required or expected for now.


    ```
    {
      type: "dynamic",
    }
    ```

- when `type` is `ref`, it represents a reference to an existing leveling method
  from leveling template. Note that this type is only allowed for `Goal`,
  and all methods from leveling template should never have a "ref" type.

    ```
    {
      type: "ref",
      templateId: <string>,
    }
    ```

    `templateId` is one of `main` / `stypes-<int>`

- when `type` is `sortie`, it represents a standard sortie in which
  base exp can be customized:

    ```
    {
      type: "sortie",
      id: <number>,
      desc: <string>,
      flagship: "yes" / "no" / "maybe",
      mvp: "yes" / "no" / "maybe",
      rank: <see note above>,
      baseExp: <ExpValue>,
    }
    ```

    in which `desc` is a simple description that user can change to their likings

- when `type` is `custom`:

    ```
    {
      type: "custom",
      id: <number>,
      desc: <string>,
      exp: <ExpValue>,
    }
    ```

## `ExpValue` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `single`

    ```
    {
      type: "single",
      value: <a number indicating exp>,
    }
    ```

- when `type` is `range`

    ```
    {
      type: "range",
      min: <a number indicating exp>,
      max: <a number indicating exp>,
    }
    ```

    it is mandantary that `min` < `max`,
    and a check should be performed
    before putting this structure into redux store.


## `AllTemplates` structure

- an Object of following structure:

    ```
    {
      stypes: <Array<Template>>,
      main: <Template>,
    }
    ```

    when we want to flatten the list, `main` always goes last
    to allow it to be the final fallback should all other template not match.

- in future we might have a `mstId: Array<Template>`,
  this allows setting leveling method for specific ships,
  which always goes first (as it's more specific than a ship type)

## `Template` structure

- an Object at least has the following shape:

    ```
    {
      type: <string>,
      method: <Method>,
      id: 'main' or <int>
    }
    ```

- when `type` is `main`

    ```
    {
      type: "main",
      id: "main",
      method: <Method>,
    }
    ```

    Note: as the name has suggested, main template is always enabled,
    and unconditionally matches every ship type.
    Also it's `id` is always `main`.

- when `type` is `custom-stypes`

    ```
    {
      type: "custom-stypes",
      method: <Method>,
      desc: <string>,
      enabled: <boolean>,
      stypes: <array of numbers>
      id: <int>
    }
    ```

    No duplicate element is allows for `stypes`.
    `id` should be unique among all ship type templates.
    User can include a `desc` to describe what it does.
