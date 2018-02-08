import { SType } from 'subtender/kc'
// default template when all other template have mismatched
const mainTemplate = {
  type: 'main',
  method: {
    type: 'sortie',
    flagship: 'maybe',
    rank: ['S','A','B'],
    mvp: 'maybe',
    baseExp: {type: 'standard', mapId: 54},
  },
}

/*
   TemplateList that has least element in it.
   used by <extStore> when pState is not set,
   using a minimum helps to reduce unnecessary computation
   (as this will be replaced shorterly after p-state is loaded)
 */
const minimum = [mainTemplate]

const defineCustom = (method, stypes) => ({
  type: 'custom',
  method,
  enabled: true,
  stypes,
})

const {
  DD, DE, CL, CLT, CT,
  CA, CAV, FBB, BB, BBV, XBB, CV, CVL, CVB,
} = SType

// this TemplateList is used to replace an empty one (for new users)
const recommended = [
  // for ASW-capable ships
  defineCustom(
    {
      type: 'sortie',
      flagship: 'yes',
      rank: ['S','A'],
      mvp: 'yes',
      baseExp: {type: 'standard', mapId: 4-3},
    },
    [DE, CL, DD, CLT, CT]
  ),
  // alternative ASW-capable leveling, effectively disabled
  defineCustom(
    {
      type: 'sortie',
      flagship: 'yes',
      rank: ['S'],
      mvp: 'yes',
      baseExp: {type: 'standard', mapId: 15},
    },
    [CLT, DE, DD, CL, CT]
  ),
  // the famous 3-2 leveling
  defineCustom(
    {
      type: 'sortie',
      flagship: 'yes',
      rank: ['S'],
      mvp: 'yes',
      baseExp: {type: 'standard', mapId: 32},
    },
    [CAV, CV, BBV, BB, FBB, CVL, CA, CVB, XBB]
  ),
  // 5-1 leveling
  defineCustom(
    {
      type: 'sortie',
      flagship: 'yes',
      rank: ['S','A'],
      mvp: 'yes',
      baseExp: {type: 'standard', mapId: 51},
    },
    [DD, DE, CL, CLT, CT],
  ),
  mainTemplate,
]

export {
  mainTemplate,
  minimum,
  recommended,
}
