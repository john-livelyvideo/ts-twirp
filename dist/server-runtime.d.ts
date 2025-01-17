/// <reference types="node" />
import http from 'http';
import * as errors from './errors';
export declare enum TwirpContentType {
    Protobuf = 0,
    JSON = 1,
    Unknown = 2
}
declare type Router<T> = (url: string | undefined, contentType: TwirpContentType) => undefined | TwirpHandler<T>;
export declare type TwirpHandler<T> = (data: Buffer, rpcHandlers: T) => Promise<Uint8Array | string>;
export declare function handleRequest<T>(req: http.IncomingMessage, res: http.ServerResponse, getTwirpHandler: Router<T>, rpcHandlers: T): Promise<void>;
export declare function getRequestData(req: http.IncomingMessage): Promise<Buffer>;
export declare function writeError(res: http.ServerResponse, error: Error | errors.TwirpError): void;
export {};
