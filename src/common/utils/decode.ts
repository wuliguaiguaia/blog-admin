import * as bcrypt from 'bcryptjs'
import { saltOrRounds } from '../constants'
/* saltOrRounds: 生成salt的迭代次数 */

export const encodePass = (pass: any) => new Promise<string>((resolve, reject) => {
  bcrypt.genSalt(saltOrRounds, (err: any, salt: any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    bcrypt.hash(pass, salt, (err: any, hash: string | PromiseLike<string>) => {
      if (err) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(false)
      }
      resolve(hash)
    })
  })
})

export const comparePass = (originPass: any, pass: any) => bcrypt.compareSync(originPass, pass)


