// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id:number
    first_name:string
    username:string
    language:string
    isAdmin:boolean
  }

  // interface UserSession {
  //   // Add your own fields
  // }

  interface SecureSessionData {
    // Add your own fields
    token:string
    access_token:string
    refresh_token:string
  }
}

export {}