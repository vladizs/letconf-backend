import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private bucketName = process.env.S3_BUCKET_NAME;
  private s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    endpoint: `https://${process.env.S3_ENDPOINT}`,
    region: 'us-east-1',
  });

  async uploadToS3(file: Buffer, name: string, mimetype: string) {
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return {
        url: `https://${this.bucketName}.${process.env.S3_ENDPOINT}/${name}`,
      };
    } catch (err) {
      throw err;
    }
  }
}
