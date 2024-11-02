import { UUID } from 'crypto';

//--------------------------------------------CREATE INTERFACE--------------------------------------------

export interface CreateUserRequest {
  user_password: string; // min 8, max 100 characters
  user_email: string; // email pattern validation
  user_phone_number: string; // phone number pattern validation (10 to 15 digits, optional "+" prefix)
}

//--------------------------------------------UPDATE INTERFACE--------------------------------------------

export interface UpdateUserEmailVerificationStatus {
    user_email: string;
    verification_code_value: string;
}