This document describes the idea of method template and
defines `Template` data structure.

# Introduction

Consider following scenarios:

- You would prefer 3-2 when leveling aircraft carriers
  but 4-3 might work better for anti-sub capable ships

- You don't want to set your leveling method every time you add a new ship

Method template solves these two problems by allowing you of defining multiple methods
prior to adding leveling goals, and specifying on every method that it is only
applicable to some ship types.

With method template being set, every newly added goals will try to fill
in its `Method` part automatically by using a matching template.

# Terms

- **Main Template**: A template that matches all ship types, and this is the only
  template that cannot be removed.

- **Template List**: a full list of templates, with the last one being the main template

- **Priority**: Every template has a unique priority, which is simply defined by its
  position in the template list, a lower index number means higher priority -
  if a ship type matches multiple templates, the one with lowest number (thus highest priority)
  gets applied.

# Data Structures

## `TemplateList` structure

- A non-empty Array of `Template`
- The last element is always the main template, therefore
  the last element's `type` field is always `main`.
- All array elements should be of type `custom`, with the exception of the last one.

## `Template` structure

- an Object at least has the following shape:

    ```
    {
      type: <string>,
      method: <Method>,
    }
    ```

- when `type` is `main`

    ```
    {
      type: "main",
      method: <Method>,
    }
    ```

    Note: as the name has suggested, main template is always enabled,
    and unconditionally matches every ship type.

- when `type` is `custom`

    ```
    {
      type: "custom",
      method: <Method>,
      enabled: <boolean>,
      stypes: <array of numbers>
    }
    ```

    Note: every number in `stypes` represents a ship type,
    which should be consistent with data received from `api_start2`.
    Additionally, every element of it should be unique.
