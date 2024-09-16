import { DynamicModule, Module } from '@nestjs/common';


export type CustomDynamicModuleSettings = {
  apiKey: string
  apiUrl: string
}

export const DYNAMIC_SETTINGS = 'DYNAMIC_SETTINGS' 

@Module({})
export class CustomDynamicModule {
  static register(settings: CustomDynamicModuleSettings): DynamicModule {

    return {
      module: CustomDynamicModule,
      imports: [],
      providers: [{
        provide: DYNAMIC_SETTINGS,
        useValue: settings
      }],
      controllers: [],
      exports: [DYNAMIC_SETTINGS],
    }
  }
}
