/**
 * Este fichero es el setup de los tests para el modulo de guias_trazabilidad
 * Se importan los mocks de los modulos que se usan en el modulo de guias_trazabilidad
 */
import 'reflect-metadata';
import { Test } from '@nestjs/testing';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('qrcode');
jest.mock('@react-pdf/renderer');
jest.mock('axios');

beforeAll(async () => {});

afterAll(async () => {});

jest.setTimeout(10000);

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

global.testTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export {};
