const env = process.env

const LOCAL_URL = {
  api: 'https://social-shopping-api.jerryf.cn'
}

const DEV_URL = {
  api: 'https://social-shopping-api.jerryf.cn'
}

const TEST_URL = {
  api: 'https://social-shopping-api.jkweixin.net'
}

const PROD_URL = {
  api: 'https://social-shopping-api.jkweixin.com'
}
// console.log(env.NODE_ENV === 'production'
//   ? PROD_URL
//   : env.NODE_ENV === 'development'
//     ? TEST_URL
//     : env.NODE_ENV === 'development'
//       ? DEV_URL
//       : LOCAL_URL)
export const BASE_URL =
  env.NODE_ENV === 'production'
    ? PROD_URL
    : env.NODE_ENV === 'development'
      ? TEST_URL
      : env.NODE_ENV === 'development'
        ? DEV_URL
        : LOCAL_URL

export const ERR_OK = 0
