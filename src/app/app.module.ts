import { Module, Logger } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { AppRouterModule } from './app.router.module';
@Module({
  controllers: [],
  providers: [Logger],
  imports: [
    // Core
    CoreModule,
    // Router
    AppRouterModule.register(),
  ],
})
export class AppModule {}
