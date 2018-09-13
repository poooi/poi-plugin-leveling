# poi-plugin-leveling

This is a [poi](https://github.com/poooi/poi) plugin that helps you keep track of
your ship girl leveling plans.

## User Manual

- [User Manual (English)](https://github.com/poooi/poi-plugin-leveling/wiki/User-Manual-(English))
- [用户手册 (简体中文)](https://github.com/poooi/poi-plugin-leveling/wiki/%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8C-(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))

## Changelog

### 2.0.1

- Fix a problem that prevents saving.

### 2.0.0

- Updated exp-related data to support current max level (Lv. 175)
- Rework on some UI stuff

### 1.2.3

- WhoCallsTheFleet data now comes from fcd

### 1.2.2

- Panel Update for react-bootstrap

### 1.2.1

- Update stats for new ships (thanks to WhoCallsTheFleet)

### 1.2.0

- Updated exp-related data to support current max level (Lv. 165)

### 1.1.1

- Updated WhoCallsTheFleet ship database

### 1.1.0

- Fix some font problems

- Added missed translation files for ja-JP ko-KR (both defaults to en-US)

### 1.0.0

- Added User Manual

### 0.3.0

- i18n support: zh-CN & en-US

### 0.2.2

- Some optimization
- Fix a problem that ranks appear out of order in methods

### 0.2.1

- Implemented ship stat estimation as you typing in goal levels

    - Ship stat data is extracted
      from [WhoCallsTheFleet](https://github.com/Diablohu/WhoCallsTheFleet)

### 0.2.0

- Implemented Method Template

    - User can define their own method templates, every method template contains
      a method and a list of applicable ship types.
    - Method Template forms a list, when adding a new ship for leveling,
      templates are attempted in order, the first one with matching ship type
      is applied to the ship.
    - The last one in template list is the main template, which unconditionally
      matches all ship types and cannot be removed.
      Therefore template matching would never fail.
    - Templates can also be manually applied by using "Apply to" dropdown button.

### 0.1.0

- Implemented sorting

    - Ships can be sorted by clicking on ship picker headers.
    - Current goal list can be sorted by clicking on top buttons.
    - Unlike ship picker, your goal list sorting method is remembered.

- Improved Ship filter

    - Added new level filter that shows only those under their final remodel levels.
    - Ship filter names are now more properly interpreted.

- Added few common leveling goals on editing panel

- Newly added goal will take ship's next remodel level into account.

- Allow uncertain value on flagship setting.

    Because of this, old plugin data needs to be updated, which
    has been taken care of automatically. But for performance
    and data migration concerns
    the code for updating the structure would be removed in future
    when the data structure is proved stable enough.

### 0.0.1

- Initial version
