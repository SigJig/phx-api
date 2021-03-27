
import bcrypt from 'bcrypt'
import Constants from './constants/encrypt'

export function compare(pass: string, hashed: string) {
    return bcrypt.compareSync(pass, hashed)
}

export default function encrypt(pass: string) {
    return bcrypt.hashSync(pass, Constants.saltRounds)
}