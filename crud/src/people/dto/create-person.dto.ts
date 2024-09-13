import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator'

export class CreatePersonDto {
    @IsEmail()
    @ApiProperty()
    email: string
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty()
    password: string
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    @ApiProperty()
    name: string
}
