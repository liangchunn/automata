import * as util from 'util'

export function log(obj: any) {
  console.log(
    util.inspect(obj, {
      showHidden: false,
      depth: null
    })
  )
}
