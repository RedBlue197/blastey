import { UUID } from 'crypto';

//--------------------------------------------CREATE INTERFACE--------------------------------------------

export interface CreateUserInterface {
    user_id: UUID;
    user_name: string;
    user_email: string;
    user_phone_number : string;
}