export enum UserRole {
    ADMIN = "admin",
    PHARMACY= "pharmacy",
    WHOLESALER = "wholesaler",
  }
  
 export interface LoginResponse {
 
       "token":string,
       "user_role":UserRole,
       "is_verified":boolean,
       "user_id":string,
       "user_email":string,
  }