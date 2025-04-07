import { IsString, IsEmail, IsOptional, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)  // Password constraint 
  password: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  constructor(username: string, password: string, email: string, firstName?: string, lastName?: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
