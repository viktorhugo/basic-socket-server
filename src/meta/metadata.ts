import { SetMetadata } from '@nestjs/common';
require('dotenv').config();

export const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;
export const Public = () => SetMetadata(PUBLIC_KEY, true);