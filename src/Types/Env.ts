declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_APP_ID: string,
      GITHUB_APP_PRIVATE_KEY: string,
      REPOSITORY_LINK: string,
    }
  }
}

export type Env = {
  GITHUB_APP_ID: string,
  GITHUB_APP_PRIVATE_KEY: string,
  REPOSITORY_LINK: string,
}
