import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
    
    @Get()
    findAllMessages(@Query() pagination: {limit: string, offset: string}): string {
        const {limit = 10, offset = 0} = pagination
        return `list all messages within ${limit} messages starting from message number ${offset}`
    }
    
    @Post()
    createMessage(@Body('message') message: string): {"message": string} {
        return {message}
    }
    
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    retrieveMessage(@Param('id') id: string): {"id": string} {
        return {id}
    }

    @Patch(':id')
    partialUpdateMessage(@Body() body: any, @Param('id') id: string): {"id": string, "body": {}} {
        return {
            id,
            body
        }
    }

    @Delete(':id')
    destroyMessage(@Param('id') id: string): string {
        return 'message deleted'
    }
}
