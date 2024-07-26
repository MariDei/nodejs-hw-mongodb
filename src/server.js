/* eslint-disable no-undef */
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

export const startServer = () => {
  const app = express();

  app.use(express());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('*', (req, res) => {
    res.status(404).send({
      message: 'Not found',
    });
  });

  //   app.use((err, req, res) => {
  //     res.status(500).send({
  //       message: 'Something went wrong',
  //       error: err.message,
  //     });
  //   });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
