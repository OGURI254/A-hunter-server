import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatAiModule } from './chat-ai/chat-ai.module';
import { PayoutsModule } from './payouts/payouts.module';
import { PaymentsModule } from './payments/payments.module';
import { DisputesModule } from './disputes/disputes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TasksModule } from './tasks/tasks.module';
import { TasksModule } from './tasks/tasks.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DisputesModule } from './disputes/disputes.module';
import { PaymentsModule } from './payments/payments.module';
import { PayoutsModule } from './payouts/payouts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, TasksModule, ReviewsModule, DisputesModule, PaymentsModule, PayoutsModule, ChatAiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
