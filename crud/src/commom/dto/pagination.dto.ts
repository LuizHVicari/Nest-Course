import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator'

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Max(50)
    limit: number = 10
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset: number = 0
}
