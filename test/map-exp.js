import {
  getMapExpInfo,
  computeExp,
  computePossibleExps,
} from '../map-exp'

const assert = require('assert')

const spec = it

describe('mapExp', () => {
  spec('getMapExpInfo', () => {
    assert.deepEqual(
      getMapExpInfo('3-2'),
      {
        name: "キス島沖",
        baseExp: {
          type: "single",
          value: 320,
        },
      })

    assert.deepEqual(
      getMapExpInfo('4-5'),
      {
        name: "[Extra] カレー洋リランカ島沖",
        baseExp: {
          type: "range",
          min: 180,
          max: 440,
        },
      })
  })

  spec('computeExp', () => {
    const [noFs, fs] = [false,true]
    const [noMvp, mvp] = [false,true]

    assert.equal(computeExp(320,fs,mvp,'S'), 1152)
    assert.equal(computeExp(320,fs,mvp,'A'), 960)
    assert.equal(computeExp(320,noFs,mvp,'A'), 640)
    assert.equal(computeExp(320,fs,noMvp,'A'), 480)

    // no MVP for rank E
    assert.equal(
      computeExp(1234,fs,mvp,'E'),
      computeExp(1234,fs,noMvp,'E'))
  })

  describe('computePossibleExps', () => {
    describe('standard method', () => {
      const testMethod1 = {
        type: 'sortie',
        flagship: 'yes',
        rank: ['S','A','B'],
        mvp: 'maybe',
        baseExp: {
          type: 'standard',
          map: '3-2',
        },
      }

      const testMethod2 = {
        type: 'sortie',
        flagship: 'yes',
        rank: ['S','A','B','C','D','E'],
        mvp: 'maybe',
        baseExp: {
          type: 'standard',
          map: '6-5',
        },
      }

      spec('standard map', () => {
        assert.deepEqual(
          computePossibleExps(testMethod1),
          [480, 576, 960, 1152])

        assert.deepEqual(
          computePossibleExps({
            ...testMethod1,
            flagship: 'maybe',
          }),
          [320, 384, 480, 576, 640, 768, 960, 1152])

        assert.deepEqual(
          computePossibleExps(testMethod2),
          [
            67, 94, 108, 135, 162, 188, 216,
            270, 324, 412, 577, 660, 825, 990,
            1155, 1320, 1650, 1980,
          ])
      })
      spec('custom map base exp', () => {
        assert.deepEqual(
          computePossibleExps({
            ...testMethod1,
            baseExp: {
              type: 'custom',
              value: {
                type: 'single',
                value: 160,
              },
            },
          }),
          [480, 576, 960, 1152].map(x => Math.floor(x/2)))

        assert.deepEqual(
          computePossibleExps({
            ...testMethod2,
            baseExp: {
              type: 'custom',
              value: {
                type: 'range',
                min: 90,
                max: 550,
              },
            },
          }),
          computePossibleExps(testMethod2))
      })
    })

    spec('custom method', () => {
      assert.deepEqual(
        computePossibleExps({
          type: 'custom',
          exp: {
            type: 'single',
            value: 3212,
          },
        }),
        [3212])

      assert.deepEqual(
        computePossibleExps({
          type: 'custom',
          exp: {
            type: 'range',
            min: 1234,
            max: 5678,
          },
        }),
        [1234,5678])
    })
  })
})
