import jwt from 'jsonwebtoken'

export default async function validateToken(token) {
  try {
    const secret = process.env.SECRET
    const decoded = jwt.verify(token, secret)
    return decoded;
  } catch (error) {
    return console.log(error)
  }
}