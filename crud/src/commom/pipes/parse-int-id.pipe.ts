import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'param' || metadata.data !== 'id') {
            return value
        }

        const parsedValue = parseInt(value)
        if (isNaN(parsedValue)) {
            throw new BadRequestException('Param id should be an integer')
        }
        if (parsedValue < 0) {
            throw new BadRequestException('Param id should be > 0')
        }

        return parsedValue
    }

}