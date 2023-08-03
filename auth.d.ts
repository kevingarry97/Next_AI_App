import "next-auth";

declare global {
    interface User {
      id: number | string;
    }
  
    module "next-auth" {
      interface Session {
        user: User
      }
    }
  }