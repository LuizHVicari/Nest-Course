import { PartialType } from '@nestjs/mapped-types'
import { CreateMessageDto } from './create-message.dto'
import { IsBoolean, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    readonly read?: boolean
}
