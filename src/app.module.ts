import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageModule } from './features/image/image.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ImageModule],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'FirebaseService',
      useFactory: async () => {
        const configService = new ConfigService();
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(
              configService.get<string>('GCS_CREDENTIALS_PATH'),
            ),
            storageBucket: configService.get<string>('STORAGE_BUCKET'),
          });
        }
        return admin;
      },
    },
  ],
})
export class AppModule {}
