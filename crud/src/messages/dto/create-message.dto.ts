import { IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    readonly text: string

    @IsPositive()
    @IsNotEmpty()
    fromId: number
    @IsPositive()
    toId: number

    // @IsString()
    // @IsNotEmpty()
    // readonly from: string

    // @IsString()
    // @IsNotEmpty()
    // readonly to: string
}
