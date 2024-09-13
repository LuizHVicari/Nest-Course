import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly text: string

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    fromId: number
    @IsPositive()
    @ApiProperty()
    toId: number

    // @IsString()
    // @IsNotEmpty()
    // readonly from: string

    // @IsString()
    // @IsNotEmpty()
    // readonly to: string
}
