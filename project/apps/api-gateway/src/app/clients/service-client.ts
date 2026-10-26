import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig, Method } from 'axios';
import { firstValueFrom } from 'rxjs';
import { toHttpException } from './upstream-error';

type QueryValue = string | number | boolean | string[] | undefined | null;

export interface RequestOptions {
  query?: object;
  body?: unknown;
  // Access token of the user: it is passed to the service as it is
  accessToken?: string;
  headers?: Record<string, string>;
  responseType?: AxiosRequestConfig['responseType'];
}

const API_PREFIX = '/api';

// A client of one service: all it does is a request and the transformation
// of a failure to the error of the gateway. There is no business logic here.
export abstract class ServiceClient {
  protected readonly logger: Logger;

  constructor(
    protected readonly http: HttpService,
    private readonly baseUrl: string,
    protected readonly serviceName: string
  ) {
    this.logger = new Logger(`${serviceName}-client`);
  }

  // Any answer of the service, even an error, means it is running
  public async isAvailable(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.get(`${this.baseUrl}${API_PREFIX}`, {
          validateStatus: () => true,
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  protected async request<T>(
    method: Method,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { data } = await this.send<T>(method, path, options);
    return data;
  }

  protected async send<T>(
    method: Method,
    path: string,
    { query, body, accessToken, headers, responseType }: RequestOptions
  ) {
    try {
      return await firstValueFrom(
        this.http.request<T>({
          method,
          url: `${this.baseUrl}${API_PREFIX}${path}`,
          params: this.serializeQuery(query),
          data: body,
          responseType,
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...headers,
          },
        })
      );
    } catch (error) {
      throw await toHttpException(error, this.serviceName, this.logger);
    }
  }

  // Empty values are skipped and lists are sent comma separated,
  // as the services expect
  private serializeQuery(
    query?: object
  ): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries((query ?? {}) as Record<string, QueryValue>)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : (value as string),
        ])
    );
  }
}
